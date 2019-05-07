
import { actionCreators } from './actions';
import { isFunction, capitalize, isString } from './lib';
import { put, select, call, apply, take, race } from 'redux-saga/effects';

import { modalSelector, modalsStateSelector } from './selectors';
import { getBoundModalActions } from './utils';

const actionsKeys = Object.keys(actionCreators);


function checkPayload(pattern, payload) {
  if (!pattern || pattern === payload || pattern === '*') {
    return true;
  }
  if (isFunction(pattern)) {
    return pattern(payload);
  }
  if (Array.isArray(pattern)) {
    return pattern.includes(payload) || pattern.some(subPattern => checkPayload(subPattern, payload));
  }
}

class Modal {
  constructor(params = {}) {
    const modal = this;
    const modalName = isString(params) 
      ? params
      : params.name;
    const {
      getModalsState = modalsStateSelector,
      renameMap,
      task,
      cancelPattern,
    } = params;
    
    modal.name = modalName;
    modal.getModalsState = getModalsState;
    modal.effect = getBoundModalActions(modalName, put, renameMap);
    modal.effect.select = modal.select.bind(this);
    modal.action = getBoundModalActions(modalName, undefined, renameMap);
    modal.effect.select = modal.select.bind(this);
    
    
    actionsKeys.forEach(actionKey => {
        
      const actionCreator = actionCreators[actionKey];
      const actionModel = actionCreator(modalName);
      const actionType = actionModel.type;
      const actionCheckerKey = `is${capitalize(actionKey)}`;
        
      modal.selector = () => modalSelector(modalName, getModalsState);
        
      modal[actionCheckerKey] = (pattern) => (action) => {
        const { type, payload, meta } = action;
            
        const result = type === actionType && 
            meta && meta.name === modalName && 
            checkPayload(pattern, payload);
        return result;
      };
    });
    modal.cancelPattern = cancelPattern || [modal.isHide(), modal.isDestroy()];

    modal.callTask = modal.callTask.bind(modal); 
    modal.task = task; 
    
  }

  action = {};
  
  callTask(...args) {
    const modal = this;
    return call([modal, modalWorker, args]);
  }

  select(customSelector) {
    const { name, getModalsState } = this;
    return select(modalSelector(name, getModalsState));
  }

  name = null;
}



export function* modalWorker(args) {
  const modal = this;
  if (!modal.task) {
    return;
  } 
    
  const cancelPattern = modal.cancelPattern;
  
  let task;

  if (cancelPattern) {
    const [result] = yield race([
      apply(modal, modal.task),
      take(cancelPattern),
    ]);
    task = result;
  } else {
    task = yield apply(modal, modal.task);
  }
  const state = yield modal.select();

  if (state.isOpen) {
    yield modal.effect.hide();
  }
  
  return yield task;
}
  

export default Modal;
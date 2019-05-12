
import * as actions from './actions';
import { put, select, join, call, apply, take, race } from 'redux-saga/effects';
import { modalMatcher } from './matcher';
import { modalSelector, modalsStateSelector } from './selectors';
import { getBoundModalActions } from './utils';
import * as is from '@redux-saga/is';
import * as defaults from './defaults';

const actionsKeys = Object.keys(actions);


export function createModal($params, ...rest) {  
  const defParams = {
    getModalsState: modalsStateSelector,
    renameMap: defaults.renameActionsMap,
  };
  const params = is.string($params)
    ? { 
      name: modalName,
      ...defParams,
      ...rest,
    }
    : {
      ...defParams,
      ...$params,
      ...rest,
    };
  
  const modalName = params.name;
  const {
    getModalsState,
    renameMap,
    task,
    cancelPattern,
    onSuccess,
  } = params;
  
  const modal = {
    name: modalName,
    selector: () => modalSelector(modalName, getModalsState),
    pattern: actionsKeys.reduce((acc, actionKey) => {
      const actionCreator = actions[actionKey];
      const patternKey = renameMap[actionKey];
      const $actionType = actionCreator(modalName).type;
      acc[patternKey] = (pattern) => (action) => {
        return modalMatcher(modalName, $actionType, pattern, action);
      };

      return acc;
    }, {}),
    effect: getBoundModalActions(modalName, put, renameMap),
    action: getBoundModalActions(modalName, undefined, renameMap),
  };

  modal.getModalsState = getModalsState;
  modal.effect.select = () => select(modal.selector());



  modal.cancelPattern = cancelPattern || [modal.pattern.hide(), modal.pattern.destroy()];

  modal.onSuccess = onSuccess;
  const modalTask = toEffectWithContext.call(modal, task);
  if (modalTask) {
    const isBlocking = isBlockingEffect(modalTask);
    const worker = isBlocking ? callModal : forkModal;
    modal.task = (...args) => call(worker, toEffectWithContext.call(modal, task, args));
  } else {
    modal.task = (fn, ...args) => call(callModal, toEffectWithContext.call(fn, args));
  }

  return modal;
}

function toEffectWithContext(fn, args) {
  const context = this;
  return is.func(fn)
    ? apply(context, fn, args)
    : is.effect(fn)
      ? {
        ...fn,
        payload: {
          ...fn.payload,
          context: {
            ...fn.context,
            ...context,
          },
          args: [...args, ...fn.payload.args],
        },

      }
      : fn;
}

const isBlockingEffect = effect => effect.type === 'CALL' || effect.type === 'TAKE';

function* forkModal(modalEffect) {
  const modal = modalEffect.payload.context;
  const cancelPattern = modal.cancelPattern;
  const task = yield modalEffect;
  const isRunning = task.isRunning();
  
  while (isRunning) {
    if (cancelPattern) {
      const winner = yield race({
        cancel: take(cancelPattern),
        task: join(task),
      });
      if (winner.cancel) {
        yield task.cancel();
      } else {
        if (modal.onSuccess) {
          yield call([modal, modal.onSuccess]);
        }
        yield call([modal, hider]);
        return yield winner.task;
      }
       
    } else {
      yield take([modal.pattern.hide(), modal.pattern.destroy()]);
      return;
    }
  }
  
}
function* callModal(modalEffect) {
  let result;
  const modal = modalEffect.payload.context;
  const { cancelPattern } = modal;
  if (!cancelPattern) {
    result = yield modalEffect;
    yield call([modal, hider], { destroy: true });
    return result;
  }

  const winner = yield race({
    task: modalEffect,
    cancel: take(cancelPattern),
  });

  if (!winner.cancel) {
    result = yield modal.onSuccess 
      ? call([modal, modal.onSuccess], winner.task) 
      : winner.task;
  } 
  
  yield call([modal, hider], { destroy: true });
  return result;
}

export function* hider(params = { destroy: false }) {
  const modal = this;
  const state = yield modal.effect.select();
  
  if (state && state.isOpen) {
    yield modal.effect.hide();
  }

  if (state && params.destroy) {
    yield modal.effect.destroy();
  }
}

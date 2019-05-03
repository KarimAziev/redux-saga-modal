// @flow

import * as isModalAction from './is';
import {
  put,
  select,
  call,
  take,
} from 'redux-saga/effects';
import { modalSelector } from './selectors';
import {
  actionsCreators,
} from './actions';
import { callModal } from './sagas';
import { capitalize } from './lib';
const effects = {
  take,
};
export const curryModalActions = (name: ModalName) => 
  Object.keys(actionsCreators)
    .reduce((acc, key) => ({
      ...acc,
      [key]: (props) => actionsCreators[key](name, props), 
    }), {});

export const curryModalEffects = (name, effect, curriedActions) => {
  return Object.keys(curriedActions)
    .reduce((acc, key) => ({
      ...acc,
      [key]: (props) => effect(curriedActions[key](props)), 
    }), {});

}

export const getModalTakeEffects = (name, effectKey) => {
  
  const effect = effects[effectKey];
  
  return Object.keys(isModalAction)
    .reduce((acc, actionKey) => ({
      ...acc,
      [`${effectKey}${capitalize(actionKey)}`]: (pattern = () => true) => effect(isModalAction[actionKey](name, pattern))
      , 
    }), {});
}

export function getModalEffects(name) {
  const actions = curryModalActions(name);
  const putEffects = curryModalEffects(name, put, actions);
  const takeEffects = getModalTakeEffects(name, 'take');
 
  const Modal = {
    name,
    actions,
    ...takeEffects,
    ...putEffects,
    call: (saga, args) => call(callModal, name, saga, args),
    select: customSelector => select(modalSelector(name, customSelector)),
  };
  return Modal;
}

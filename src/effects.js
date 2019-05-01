// @flow

import  { createModalActionCheckers } from './is';
import {
  put,
  select,
} from 'redux-saga/effects';
import { modalSelector } from './selectors';
import {
  getModalActions,
} from './actions';


export const getModalEffects = (name) => {
  const curriedActions = getModalActions(name);
  const putEffects = Object.keys(curriedActions)
    .reduce((acc, key) => ({
      ...acc,
      [key]: (props) => put(curriedActions[key](props)), 
    }), {});

    console.log('putEffects', putEffects);

  return ({
    ...putEffects,
    select: customSelector => select(modalSelector(name, customSelector)),
  });
}

export function createModal(name) {
  const actionCheckers = createModalActionCheckers(name);
  const effects = getModalEffects(name);
  const actions = getModalActions(actions);
  const Modal = {
    name,
    actions,
    ...actionCheckers,
    ...effects,
  };
  console.log('Modal', Modal);
  return Modal;
}

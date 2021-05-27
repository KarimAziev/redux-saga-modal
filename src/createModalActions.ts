import { PutEffect } from 'redux-saga/effects';
import { Dispatch } from 'redux';
import * as actionsCreators from './actionsCreators';
import { ModalActionCreators } from './interface';

const {
  showModal,
  hideModal,
  clickModal,
  updateModal,
  destroyModal,
  submitModal,
} = actionsCreators;

export function bindActionEffect<
  A extends ModalActionCreators,
  P,
  E extends Function
>(actionCreator: A, name: string, effect: E) {
  return function(
    payload?: P,
  ): E extends Dispatch<any>
    ? Dispatch<ReturnType<A>>
    : E extends Function
    ? PutEffect<ReturnType<A>>
    : ReturnType<A> {
    const action = actionCreator.apply(undefined, [name, payload]);
    return effect(action);
  };
}

export default function createModalBoundActions<E extends Function>(
  name: string,
  effect: E,
) {
  return {
    show: bindActionEffect(showModal, name, effect),
    update: bindActionEffect(updateModal, name, effect),
    submit: bindActionEffect(submitModal, name, effect),
    click: bindActionEffect(clickModal, name, effect),
    hide: bindActionEffect(hideModal, name, effect),
    destroy: bindActionEffect(destroyModal, name, effect),
  };
}

export function createModalActions(name: string) {
  return {
    show<P extends Record<string, unknown>>(payload: P) {
      return showModal<P>(name, payload);
    },
    update<P extends Record<string, unknown>>(payload: P) {
      return updateModal<P>(name, payload);
    },
    submit<P>(payload: P) {
      return submitModal<P>(name, payload);
    },
    click<P>(payload: P) {
      return clickModal<P>(name, payload);
    },
    hide(_payload?: any) {
      return hideModal(name);
    },
    destroy(_payload?: any) {
      return destroyModal(name);
    },
  };
}

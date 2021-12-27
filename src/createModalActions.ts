import { PutEffect, put } from 'redux-saga/effects';
import { Dispatch } from 'redux';
import * as actionsCreators from './actionsCreators';
import { ModalActionCreators, SagaModalAction } from './interface';

const {
  showModal,
  hideModal,
  clickModal,
  updateModal,
  destroyModal,
  submitModal,
} = actionsCreators;

export function bindActionEffect<E extends Function>(
  actionCreator: ModalActionCreators,
  name: string,
  effect: E,
) {
  return function<P = {}>(payload?: P): Dispatch<SagaModalAction<P>> {
    const action: SagaModalAction<P> = actionCreator.apply(undefined, [
      name,
      payload,
    ]);

    return effect(action);
  };
}

export function bindPutEffect<A extends ModalActionCreators>(
  actionCreator: A,
  name: string,
) {
  return function<P = {}>(payload?: P): PutEffect<SagaModalAction<P>> {
    return put(actionCreator.apply(undefined, [name, payload]));
  };
}

export default function createModalBoundActions(
  name: string,
  dispatch: Function,
) {
  return {
    show: bindActionEffect(showModal, name, dispatch),
    update: bindActionEffect(updateModal, name, dispatch),
    submit: bindActionEffect(submitModal, name, dispatch),
    click: bindActionEffect(clickModal, name, dispatch),
    hide: bindActionEffect(hideModal, name, dispatch),
    destroy: bindActionEffect(destroyModal, name, dispatch),
  };
}

export function createModalActions(name: string) {
  return {
    show<P = {}>(payload: P) {
      return showModal<P>(name, payload);
    },
    update<P = {}>(payload: P) {
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

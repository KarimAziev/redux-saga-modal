import { ModalActionTypes } from './actionTypes';

export function showModal<P = {}>(name: string, payload: P) {
  return {
    type: ModalActionTypes.SHOW_MODAL,
    payload,
    meta: {
      name: name,
    },
  };
}

export function hideModal(name: string) {
  return {
    type: ModalActionTypes.HIDE_MODAL,
    meta: {
      name,
    },
  };
}

export function clickModal<P>(name: string, payload: P) {
  return {
    type: ModalActionTypes.CLICK_MODAL,
    payload,
    meta: {
      name,
    },
  };
}

export function updateModal<P>(name: string, payload: P) {
  return {
    type: ModalActionTypes.UPDATE_MODAL,
    payload,
    meta: {
      name,
    },
  };
}

export function destroyModal(name: string) {
  return {
    type: ModalActionTypes.DESTROY_MODAL,
    meta: {
      name,
    },
  };
}

export function submitModal<P = {}>(name: string, payload: P) {
  return {
    type: ModalActionTypes.SUBMIT_MODAL,
    payload,
    meta: {
      name,
    },
  };
}

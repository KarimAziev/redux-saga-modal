import * as actionTypes from './actionTypes';

export function showModal(name, payload = {}) {
  return {
    type: actionTypes.SHOW_MODAL,
    payload,
    meta: {
      name,
    },
  };
}

export function hideModal(name) {
  return {
    type: actionTypes.HIDE_MODAL,
    meta: {
      name,
    },
  };
}

export function clickModal(name, value) {
  return {
    type: actionTypes.CLICK_MODAL,
    payload: value,
    meta: {
      name,
    },
  };
}

export function updateModal(name, payload = {}) {
  return {
    type: actionTypes.UPDATE_MODAL,
    payload,
    meta: {
      name,
    },
  };
}

export function destroyModal(name) {
  return {
    type: actionTypes.DESTROY_MODAL,
    meta: {
      name,
    },
  };
}

export function submitModal(name, payload) {
  return {
    type: actionTypes.SUBMIT_MODAL,
    payload,
    meta: {
      name,
    },
  };
}

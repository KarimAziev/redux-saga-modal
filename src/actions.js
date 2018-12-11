import types from './types';
export function showModal(name, payload = {}) {
  return {
    type: types.SHOW_MODAL,
    payload: {
      ...payload,
      name,
    },
  };
}

export function hideModal(name) {
  return {
    type: types.HIDE_MODAL,
    payload: { name },
  };
}

export function clickModal(name, value) {
  return {
    type: types.CLICK_MODAL,
    payload: {
      name: name,
      value: value,
    },
  };
}

export function updateModal(name, payload = {}) {
  return {
    type: types.UPDATE_MODAL,
    payload: {
      name,
      ...payload,
    },
  };
}

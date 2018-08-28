import types from './types';
export function forkModal({ name, saga, isOpen, props, context }) {
  return {
    type: types.FORK_MODAL,
    payload: { name, isOpen, props },
    saga,
    context,
  };
}
export function showModal(name, payload = {}) {
  return {
    type: types.SHOW_MODAL,
    payload: {
      name,
      props: payload,
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

export function updateModal(name, props = {}) {
  return {
    type: types.UPDATE_MODAL,
    payload: {
      name,
      props,
    },
  };
}
import types from './types';

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
    type: types.MODAL_CLICK,
    payload: {
      name: name,
      value: value,
    },
  };
}

export function addToModalProps(name, props = {}) {
  return {
    type: types.ADD_TO_MODAL,
    payload: {
      name,
      props,
    },
  };
}


export function resetModal(name) {
  return {
    type: types.RESET_MODAL,
    payload: { name },
  };
}

export function resetAllModals() {
  return {
    type: types.RESET_ALL_MODALS,
  };
}

export function inizializeModal(name, saga) {
  return {
    type: types.INITIALIZE_MODAL,
    payload: { name, saga, props: {} },
  };
}

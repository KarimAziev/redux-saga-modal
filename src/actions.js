import types from './types';

export function showModal(key, payload = {}) {
  return {
    type: types.SHOW_MODAL,
    payload: {
      key,
      props: payload,
    },
  };
}

export function hideModal(key) {
  return {
    type: types.HIDE_MODAL,
    payload: { key },
  };
}

export function clickModalItem(key, value) {
  return {
    type: types.MODAL_CLICK,
    payload: {
      key: key,
      value: value,
    },
  };
}

export function addToModalProps(key, props = {}) {
  return {
    type: types.ADD_TO_MODAL,
    payload: {
      key,
      props,
    },
  };
}


export function resetModal(key) {
  return {
    type: types.RESET_MODAL,
    payload: { key },
  };
}

export function resetAllModals() {
  return {
    type: types.RESET_ALL_MODALS,
  };
}

export function inizializeModal(key, saga) {
  return {
    type: types.INITIALIZE_MODAL,
    payload: { key, saga, props: {} },
  };
}

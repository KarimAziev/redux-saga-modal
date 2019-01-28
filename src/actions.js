// @flow
import actionTypes from './actionTypes';
import type { 
  ModalName,
  ShowModal,
  HideModal,
  ClickModal,
  UpdateModal, 
} from './types';


export function showModal(name: ModalName, payload: any): ShowModal {
  return {
    type: actionTypes.SHOW_MODAL,
    payload,
    meta: {
      name,
    },
  };
}

export function hideModal(name: ModalName): HideModal {
  return {
    type: actionTypes.HIDE_MODAL,
    meta: {
      name,
    },
  };
}

export function clickModal(name: ModalName, value: any): ClickModal {
  return {
    type: actionTypes.CLICK_MODAL,
    payload: value,
    meta: {
      name,
    },
  };
}

export function updateModal(name: ModalName, payload: any): UpdateModal {
  return {
    type: actionTypes.UPDATE_MODAL,
    payload,
    meta: {
      name,
    },
  };
}

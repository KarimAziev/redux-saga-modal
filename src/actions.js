// @flow
import * as actionTypes from './actionTypes';
import type {
  ModalName,
  ShowModal,
  HideModal,
  UpdateModal,
  ClickModal,
  DestroyModal,
  ConfirmModal,
} from './flow-types';

export function showModal(name: ModalName, payload: Object = {}): ShowModal {
  return {
    type: actionTypes.SHOW_MODAL,
    payload,
    meta: {
      name,
    },
  };
}

export function hideModal(name: ModalName, payload: Object = {}): HideModal {
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

export function updateModal(
  name: ModalName,
  payload: Object = {}
): UpdateModal {
  return {
    type: actionTypes.UPDATE_MODAL,
    payload,
    meta: {
      name,
    },
  };
}

export function destroyModal(name: ModalName): DestroyModal {
  return {
    type: actionTypes.DESTROY_MODAL,
    meta: {
      name,
    },
  };
}

export function submitModal(
  name: ModalName,
  payload: Object = {}
): ConfirmModal {
  return {
    type: actionTypes.SUBMIT_MODAL,
    payload,
    meta: {
      name,
    },
  };
}

// @flow
import actionTypes from './actionTypes';
import type {
  ModalName,
  ShowModal,
  HideModal,
  ClickModal,
  UpdateModal,
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

export function confirmModal(
  name: ModalName,
  payload: Object = {}
): ConfirmModal {
  return {
    type: actionTypes.CONFIRM_MODAL,
    payload,
    meta: {
      name,
    },
  };
}

export const actionCreators = {
  show: showModal,
  hide: hideModal,
  destroy: destroyModal,
  confirm: confirmModal,
  update: updateModal,
  click: clickModal,
};
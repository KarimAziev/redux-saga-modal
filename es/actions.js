import _extends from "@babel/runtime/helpers/extends";
import actionTypes from './actionTypes';
export function showModal(name, payload) {
  if (payload === void 0) {
    payload = {};
  }

  return {
    type: actionTypes.SHOW_MODAL,
    payload: _extends({}, payload, {
      name: name
    })
  };
}
export function hideModal(name) {
  return {
    type: actionTypes.HIDE_MODAL,
    payload: {
      name: name
    }
  };
}
export function clickModal(name, value) {
  return {
    type: actionTypes.CLICK_MODAL,
    payload: {
      name: name,
      value: value
    }
  };
}
export function updateModal(name, payload) {
  if (payload === void 0) {
    payload = {};
  }

  return {
    type: actionTypes.UPDATE_MODAL,
    payload: _extends({
      name: name
    }, payload)
  };
}
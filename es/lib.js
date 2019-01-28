import actionTypes from './actionTypes';
import { take } from 'redux-saga/effects';
import { toArrayMaybe, isFunction } from './utils';
export var checkModalName = function checkModalName(name) {
  return function (action) {
    return action.payload && action.payload.name === name;
  };
};
export var checkActionType = function checkActionType(type) {
  return function (action) {
    return toArrayMaybe(type).includes(action.type) && action;
  };
};
export var checkModalClick = function checkModalClick(value) {
  return function (action) {
    var actionValue = action.payload && action.payload.value;
    return isFunction(value) ? value(actionValue) : toArrayMaybe(value).includes(actionValue);
  };
};
export var takeModalShow = function takeModalShow(name) {
  return take(function (action) {
    return checkActionType(actionTypes.SHOW_MODAL)(action) && checkModalName(name)(action);
  });
};
export var takeModalHide = function takeModalHide(name) {
  return take(function (action) {
    return checkActionType(actionTypes.HIDE_MODAL)(action) && checkModalName(name)(action);
  });
};
export var takeModalClick = function takeModalClick(name, value) {
  return take(function (action) {
    return checkActionType(actionTypes.CLICK_MODAL)(action) && checkModalName(name)(action) && checkModalClick(value)(action);
  });
};
export var takeModalUpdate = function takeModalUpdate(name) {
  return take(function (action) {
    return checkActionType(actionTypes.UPDATE_MODAL)(action) && checkModalName(name)(action);
  });
};
export var takeModalDestroy = function takeModalDestroy(name) {
  return take(function (action) {
    return checkActionType(actionTypes.DESTROY_MODAL)(action) && checkModalName(name)(action);
  });
};
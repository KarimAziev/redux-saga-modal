
// @flow
import actionTypes from './actionTypes';
import { take } from 'redux-saga/effects';
import { toArrayMaybe, isFunction } from './utils';
import type { ModalName, Action } from './types';

export const checkModalName = (name:ModalName) => (action: Action) => action.meta && action.meta.name === name;

export const checkActionType = (type: string | Array<string>) => (action: Action) => toArrayMaybe(type).includes(action.type) && action;
export const checkModalClick = (value: any) => (action: Action) => {
  const actionValue = action.payload;
  return isFunction(value) 
    ? value(actionValue) 
    : toArrayMaybe(value).includes(actionValue);
}
export const takeModalShow = (name:ModalName) => take(action => 
  checkActionType(actionTypes.SHOW_MODAL)(action) && checkModalName(name)(action));
export const takeModalHide = (name:ModalName) => take(action => 
  checkActionType(actionTypes.HIDE_MODAL)(action) && checkModalName(name)(action));
export const takeModalClick = (name: ModalName, value: any) => take(action => 
  checkActionType(actionTypes.CLICK_MODAL)(action) && 
  checkModalName(name)(action) && 
  checkModalClick(value)(action)
)
export const takeModalUpdate = (name: ModalName) => take(action => 
  checkActionType(actionTypes.UPDATE_MODAL)(action) && checkModalName(name)(action));

export const takeModalDestroy = (name: ModalName) => take(action => 
  checkActionType(actionTypes.DESTROY_MODAL)(action) && checkModalName(name)(action));
  
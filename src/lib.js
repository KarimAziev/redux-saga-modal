
// @flow
import actionTypes from './actionTypes';
import { take } from 'redux-saga/effects';
import { toArrayMaybe, isFunction } from './utils';
import type { ModalName, Action } from './types';
import type { Pattern } from 'redux-saga';
export const checkModalName = (name:ModalName) => (action: Action): boolean %checks => 
  !!action.meta && !!action.meta.name === name;

export const checkActionType = (type: string | Array<string>) => (action: Action): boolean %checks => 
  toArrayMaybe(type).includes(action.type) && !!action;
export const checkModalClick = (value: any) => (action: Action) => {
  const actionValue = action.payload;
  return isFunction(value) 
    ? value(actionValue) 
    : toArrayMaybe(value).includes(actionValue);
}
export const takeModalShow = (name:ModalName) => take<Pattern>((action: Action) => 
  checkActionType(actionTypes.SHOW_MODAL)(action) && checkModalName(name)(action));
export const takeModalHide = (name:ModalName) => take<Pattern>((action): boolean %checks => 
  checkActionType(actionTypes.HIDE_MODAL)(action) && checkModalName(name)(action));
export const takeModalClick = (name: ModalName, value: any) => take<Pattern>(action => 
  checkActionType(actionTypes.CLICK_MODAL)(action) && 
  checkModalName(name)(action) && 
  checkModalClick(value)(action)
)
export const takeModalUpdate = (name: ModalName) => take<Pattern>(action => 
  checkActionType(actionTypes.UPDATE_MODAL)(action) && checkModalName(name)(action));
  
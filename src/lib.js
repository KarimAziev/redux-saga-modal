
// @flow
import actionTypes from './actionTypes';
import { take } from 'redux-saga/effects';
import { toArrayMaybe, isFunction } from './utils';
import type { ModalName, Action } from './flow-types';
import type { Pattern } from 'redux-saga';

const actionsKeys = Object.keys(actionTypes);
export const isModalAction = (action: Action): boolean => actionsKeys.includes(action.type);

export const checkModalName = (name: ModalName) => (action: Action): boolean %checks => 
  !!action.meta && action.meta.name === name;
export const checkActionType = (type: string | Array<string>) => (action: Action): boolean %checks => 
  toArrayMaybe(type).includes(action.type) && !!action;
  
export const checkModalClick = (pattern: any, name?: ModalName) => (action: Action): boolean => {
  const isClick = checkActionType(actionTypes.CLICK_MODAL);
  const isAnotherModal = name && !checkModalName(name);
  if (!isClick || isAnotherModal) {
    return false;
  };
  
  const { payload: clickedValue } = action;

  const checker = isFunction(pattern) 
    ? () => !!pattern(clickedValue)
    : () => pattern === undefined || pattern === '*' || toArrayMaybe(pattern).includes(clickedValue);

  return checker();
}

export const checkModalHide = (name:ModalName) => (action: Action): boolean %checks => 
  checkActionType(actionTypes.HIDE_MODAL)(action) && checkModalName(name)(action);


export const takeModalShow = (name:ModalName) => take<Pattern>((action: Action) => 
  checkActionType(actionTypes.SHOW_MODAL)(action) && checkModalName(name)(action));
  
export const takeModalHide = (name:ModalName) => take<Pattern>(checkModalHide(name));
export const takeModalClick = (name: ModalName, pattern: any) => take<Pattern>(action => checkModalClick(pattern, name)(action))
export const takeModalUpdate = (name: ModalName) => take<Pattern>(action => 
  checkActionType(actionTypes.UPDATE_MODAL)(action) && checkModalName(name)(action));
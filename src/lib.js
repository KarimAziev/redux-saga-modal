import types from './types';
import { take } from 'redux-saga/effects';

const checkModalName = name => action => action.payload && action.payload.name === name;
const checkActionType = type => action => action.type === type;
const checkModalClick = value => action => action.payload && action.payload.value === value;
export const takeModalShow = name => take(action => 
  checkActionType(types.SHOW_MODAL)(action) && checkModalName(name)(action));
export const takeModalHide = name => take(action => 
  checkActionType(types.HIDE_MODAL)(action) && checkModalName(name)(action));
export const takeModalClick = (name, value) => take(action => 
  checkActionType(types.CLICK_MODAL)(action) && checkModalName(name)(action) && checkModalClick(value)(action));
export const takeModalUpdate = name => take(action => 
  checkActionType(types.UPDATE_MODAL)(action) && checkModalName(name)(action));

export const takeModalDestroy = name => take(action => 
  checkActionType(types.DESTROY_MODAL)(action) && checkModalName(name)(action));
  
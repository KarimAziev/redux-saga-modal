import types from './types';
import { take } from 'redux-saga/effects';

export const toArrayMaybe = item => Array.isArray(item) ? item : [item];
export const isShowType = actionType => actionType === types.SHOW_MODAL;
export const isClickType = actionType => actionType === types.MODAL_ITEM_CLICK;
export const isHideType = actionType => actionType === types.SHOW_MODAL;

export const isModalShow = keys => ({ type, payload = {} }) => 
  isShowType(type) && toArrayMaybe(keys).includes(payload.key);
  
export const isModalHide = keys => ({ type, payload = {} }) => 
  isHideType(type) && toArrayMaybe(keys).includes(payload.key);
  
export const clickFilter = values => ({ type, payload = {} }) => 
  isClickType(type) && toArrayMaybe(values).includes(payload.key);

export const takeModal = keys => take(isModalShow(keys));
export const takeModalHide = keys => take(isModalHide(keys));
export const takeModalMaybe = keys => take.maybe(isModalShow(keys));
export const takeModalClick = items => take(clickFilter(items));

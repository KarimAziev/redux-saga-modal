import types from './types';
import { take } from 'redux-saga/effects';

export const toArrayMaybe = item => Array.isArray(item) ? item : [item];
export const isShowType = actionType => actionType === types.SHOW_MODAL;
export const isClickType = actionType => actionType === types.MODAL_ITEM_CLICK;

export const isModalShow = keys => ({ type, payload = {} }) => 
  isShowType(type) && toArrayMaybe(keys).includes(payload.key);
  
export const clickFilter = values => ({ type, payload = {} }) => 
  isClickType(type) && toArrayMaybe(values).includes(payload.key);

  
export const takeModal = key => take(isModalShow(key));
export const takeModalMaybe = key => take.maybe(isModalShow(key));
export const takeModalClick = items => take(clickFilter(items));

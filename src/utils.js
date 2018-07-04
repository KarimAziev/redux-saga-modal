import types from './types';
import { take } from 'redux-saga/effects';

const isEqual = (a, b) => a === b;
const pick = (a, b) => isObjLiteral(a) ? a[b] : isObjLiteral(b) && b[a];

export const toArrayMaybe = item => Array.isArray(item) ? item : [item];
export function isObject(val) {
  return val === Object(val);
}

export function isFunction(val) {
  return Object.prototype.toString.call(val) === '[object Function]';
}

export function isArray(val) {
  return Array.isArray(val);
}

export function isString(val) {
  return typeof val === 'string' || val instanceof String;
}

export function isObjLiteral(val) {
  return isObject(val) && 
         !isArray(val) && 
         !isFunction(val) && 
         !isString(val);
}


export const isShowType = actionType => actionType === types.SHOW_MODAL;
export const isClickType = actionType => actionType === types.MODAL_CLICK;
export const isHideType = actionType => actionType === types.HIDE_MODAL;

export const isModalShow = keys => ({ type, payload = {} }) => isShowType(type) && toArrayMaybe(keys).includes(payload.key)
  
export const isModalHide = keys => ({ type, payload = {} }) => 
  isHideType(type) && toArrayMaybe(keys).includes(payload.key);
  
export const clickFilter = values => ({ type, payload = {} }) => isClickType(type) && toArrayMaybe(values).includes(payload.value)

export const takeModalHide = keys => take(isModalHide(keys));
export const takeModalMaybe = keys => take.maybe(isModalShow(keys));
export const takeModalClick = items => take(clickFilter(items));

const checkAction = (modalKey, type) => pattern => 
  isObjLiteral(pattern) && isEqual(pick('type', pattern), type) && pattern && pattern.payload.key === modalKey; 

export const takeModal = (key, type) => take(checkAction(key, type))
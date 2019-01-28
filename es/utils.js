import * as React from 'react';
export function getDisplayName(WrappedComponent, name) {
  return isString(WrappedComponent.displayName) ? WrappedComponent.displayName : isString(WrappedComponent.name) ? WrappedComponent.name : isString(name) ? name : 'Component';
}
export var toArrayMaybe = function toArrayMaybe(item) {
  return Array.isArray(item) ? item : [item];
};
export var omitProps = function omitProps(keys, obj) {
  var data = {};
  Object.keys(obj).filter(function (key) {
    return !keys.includes(key);
  }).forEach(function (key) {
    return data[key] = obj[key];
  });
  return data;
};
export function isFunction(val) {
  return Object.prototype.toString.call(val) === '[object Function]';
}
export function isString(val) {
  return typeof val === 'string' || val instanceof String;
}
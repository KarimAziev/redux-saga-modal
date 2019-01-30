
import * as React from 'react';
export function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
export const toArrayMaybe = <T>(item: T): Array<T> => Array.isArray(item) ? item : [item];

export const omitProps = (keys: Array<string>, obj: Object): Object => {
  const data = {};
  
  Object.keys(obj)
    .filter(key => !keys.includes(key))
    .forEach(key => data[key] = obj[key]);

  return data;
};

export function isFunction(val: any) {
  return Object.prototype.toString.call(val) === '[object Function]';
}

export function isString(val: any): boolean {
  return typeof val === 'string' || val instanceof String
}

export function isObject(obj: any) {
  return obj === Object(obj);
}
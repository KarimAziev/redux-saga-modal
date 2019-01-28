
import type { ModalName } from './types';
import * as React from 'react';
type Props = {
  displayName?: string,
  name?: string,
}
export function getDisplayName(WrappedComponent: React.ComponentType<Props>, name: ModalName): ModalName {
  return isString(WrappedComponent.displayName) 
    ? WrappedComponent.displayName
    : isString(WrappedComponent.name) 
      ? WrappedComponent.name
      : isString(name)
        ? name 
        : 'Component';
}
export const toArrayMaybe = (item: mixed) => Array.isArray(item) ? item : [item];
export const omitProps = (keys: Array<mixed>, obj: Object): Object => {
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

export function isObject(obj) {
  return obj === Object(obj);
}
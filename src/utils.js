
// @flow
import * as React from 'react';

export const getDisplayName = (WrappedComponent: React.ComponentType<any>) => 
  WrappedComponent.displayName || WrappedComponent.name || 'Component';
export const toArrayMaybe = (item: mixed): Array<mixed> => Array.isArray(item) ? item : [item];

export const omitProps = (keys: Array<string>, obj: Object): Object => {
  const data = {};
  
  Object.keys(obj)
    .filter(key => !keys.includes(key))
    .forEach(key => data[key] = obj[key]);

  return data;
};

export const isFunction = (val: any) => Object.prototype.toString.call(val) === '[object Function]';
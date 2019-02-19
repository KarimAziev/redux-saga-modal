// @flow
import * as React from 'react';

type Curry<A, R> = (...r: [A]) => R;

export const curry: Curry = function curry(fn) {
  return function(...args) {
    return args.length >= fn.length
      ? fn.apply(null, args)
      : (...rest) => fn.apply(null, [...args, ...rest]);
  };
};

export const allPass = curry((checkers, args) =>
  checkers.map((fn) => fn.call(null, args)).every((r) => !!r)
);

export const anyPass = curry((checkers, args) =>
  checkers.map((fn) => fn.call(null, args)).some((r) => !!r)
);
export const getDisplayName = (WrappedComponent: React.ComponentType<any>) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';
export const toArrayMaybe = (item: mixed): Array<mixed> =>
  Array.isArray(item) ? item : [item];

export const omitProps = (keys: Array<string>, obj: Object): Object => {
  const data = {};

  Object.keys(obj)
    .filter((key) => !keys.includes(key))
    .forEach((key) => (data[key] = obj[key]));

  return data;
};

export const isFunction = (val: any) =>
  Object.prototype.toString.call(val) === '[object Function]';
export const isGenerator = (obj: Object) =>
  'function' === typeof obj.next && 'function' === typeof obj.throw;
export const isGeneratorFunction = (obj: Object) => {
  const { constructor } = obj;
  if (!constructor) {
    return false;
  }
  if (
    'GeneratorFunction' === constructor.name ||
    'GeneratorFunction' === constructor.displayName
  ) {
    return true;
  }
  return isGenerator(constructor.prototype);
};

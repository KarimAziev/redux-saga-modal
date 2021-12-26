import { Action } from 'redux';
import * as actionsCreators from './actionsCreators';
import { ModalAction } from './interface';

export const reduceObjWith = <
  F extends (...args: any) => any,
  V extends Record<string, unknown>,
  K extends keyof V,
  R extends { [P in K]: ReturnType<F> }
>(
  f: F,
  v: V,
): R => {
  const keys = Object.keys(v) as K[];
  return keys.reduce(
    (acc: R, k: K) => ({
      ...acc,
      [k]: f(v[k]),
    }),
    {} as R,
  );
};

function isFunc(f: any): f is Function {
  return typeof f === 'function';
}
export function isUndef(v: any): v is undefined {
  return v === null || v === undefined;
}

function isString(s: any): s is string {
  return typeof s === 'string';
}

function isArray(v: any): v is any[] {
  return Array.isArray(v);
}

function isObject(obj: any): obj is object {
  return obj && !isArray(obj) && typeof obj === 'object';
}

export const array = (patterns: any) => (input: any) =>
  patterns.some((p: any) => payloadMatcher(p)(input));
// eslint-disable-next-line no-shadow
export const predicate = (predicate: any) => (input: any) => predicate(input);
export const string = (pattern: any) => (input: any) =>
  input === String(pattern);
export const isSstring = (pattern: any) => (input: any) =>
  input === String(pattern);
export const symbol = (pattern: any) => (input: any) => input === pattern;
export const konst = (v: any) => () => v;
export const kTrue = konst(true);
export const wildcard = () => kTrue;
const isSringableFunc = function stringableFunc(f: Function) {
  return isFunc(f) && f.hasOwnProperty('toString');
};
const isSymbol = function symbol(sym: any) {
  return (
    Boolean(sym) &&
    typeof Symbol === 'function' &&
    sym.constructor === Symbol &&
    sym !== Symbol.prototype
  );
};

export function payloadMatcher(pattern: any) {
  // prettier-ignore
  const matcherCreator = (
    pattern === '*' ? wildcard
      : isUndef(pattern) ? wildcard
        : isString(pattern) ? string
          : isArray(pattern) ? array
            : isSringableFunc(pattern) ? string
              : isFunc(pattern) ? predicate
                : isSymbol(pattern) ? symbol
                  : null
  );

  if (matcherCreator === null) {
    throw new Error(`invalid pattern: ${pattern}`);
  }

  return matcherCreator(pattern);
}

export function modalMatcher<T>(
  modalName: string,
  actionType: string,
  pattern: any,
  action: any,
): action is ModalAction<T> {
  const { type, payload, meta } = action;

  const isMatch =
    type === actionType &&
    meta &&
    meta.name === modalName &&
    payloadMatcher(pattern)(payload);
  return isMatch;
}

export const renameActionsMap = {
  show: actionsCreators.showModal,
  hide: actionsCreators.hideModal,
  destroy: actionsCreators.destroyModal,
  update: actionsCreators.updateModal,
  click: actionsCreators.clickModal,
  submit: actionsCreators.submitModal,
};

export default function createModalPatterns<
  K extends keyof typeof renameActionsMap,
  R extends { [P in K]: (a?: any) => R[P] },
  T
>(modalName: string): R {
  const actionsKeys = Object.keys(renameActionsMap);
  return actionsKeys.reduce((acc: R, patternKey) => {
    const actionCreator = renameActionsMap[patternKey];
    const actionType = actionCreator(modalName, {}).type;
    acc[patternKey] = (patternOrAction?: any) => {
      if (isObject(patternOrAction)) {
        return modalMatcher(
          modalName,
          actionType,
          kTrue,
          patternOrAction as ModalAction<T>,
        );
      }
      return (action: Action) =>
        modalMatcher(modalName, actionType, patternOrAction, action);
    };

    return acc;
  }, {} as R);
}

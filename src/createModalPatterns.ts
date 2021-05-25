import { Action } from 'redux';
import {
  undef as isUndef,
  func as isFunc,
  string as isString,
  array as isArray,
  object as isObject,
  number as isNumber,
} from '@redux-saga/is';
import { take } from 'redux-saga/effects';
import { kTrue, identity } from './utils';
import {
  showModal,
  hideModal,
  clickModal,
  updateModal,
  destroyModal,
  submitModal,
} from './actionsCreators';
import { ModalActionCreators, ModalAction, Predicate } from './interface';

// eslint-disable-next-line no-shadow
export const predicate = (predicate: typeof payloadMatcher) => (
  input: Parameters<typeof payloadMatcher>,
) => predicate(input);

export const arrayPred = (patterns: any[]) => (input: unknown): boolean =>
  patterns.some((p) => payloadMatcher(p)(input)) as boolean;
export const stringMatcher = (pattern: string): Predicate<string> => (
  input: string,
) => input === pattern;

export const eqMatcher = (pattern: unknown) => (input: unknown) =>
  input === pattern;
export const wildcard = () => kTrue;

export function payloadMatcher(pattern?: unknown) {
  const matchCreator = isUndef(pattern)
    ? wildcard
    : isString(pattern)
    ? eqMatcher(pattern)
    : isArray(pattern)
    ? arrayPred
    : isFunc(pattern)
    ? predicate
    : isNumber(pattern)
    ? eqMatcher(pattern)
    : () => identity(false);
  return matchCreator;
}

export function modalMatcher(
  modalName: string,
  actionType: string,
  pattern: unknown,
  action: ModalAction,
) {
  const isMatch =
    action.type === actionType &&
    action.meta &&
    action.meta.name === modalName &&
    payloadMatcher(pattern)(action.payload);
  return isMatch;
}

function isAction(action: any): action is Action {
  return isObject(action);
}

const makeModalPattern = (
  modalName: string,
  actionCreator: ModalActionCreators,
) => {
  const actionType = actionCreator('', {}).type;
  return function(patternOrAction?: Action | unknown) {
    return isAction(patternOrAction)
      ? modalMatcher(modalName, actionType, kTrue, patternOrAction)
      : (action: Action): ReturnType<typeof modalMatcher> =>
          modalMatcher(modalName, actionType, patternOrAction, action);
  };
};

export const makeTakePattern = (
  modalName: string,
  actionCreator: ModalActionCreators,
) => {
  const actionType = actionCreator('', {}).type;
  return function(patternOrAction?: Action | unknown) {
    return isAction(patternOrAction)
      ? take(modalMatcher(modalName, actionType, kTrue, patternOrAction))
      : take(
          (action: Action): ReturnType<typeof modalMatcher> =>
            modalMatcher(modalName, actionType, patternOrAction, action),
        );
  };
};
export default function createModalPatterns(modalName: string) {
  return {
    show: makeModalPattern(modalName, showModal),
    update: makeModalPattern(modalName, updateModal),
    click: makeModalPattern(modalName, clickModal),
    destroy: makeModalPattern(modalName, destroyModal),
    submit: makeModalPattern(modalName, submitModal),
    hide: makeModalPattern(modalName, hideModal),
  };
}

export function createTakePatterns(modalName: string) {
  return {
    takeShow: makeTakePattern(modalName, showModal),
    takeUpdate: makeTakePattern(modalName, updateModal),
    takeClick: makeTakePattern(modalName, clickModal),
    takeDestroy: makeTakePattern(modalName, destroyModal),
    takeSubmit: makeTakePattern(modalName, submitModal),
    takeHide: makeTakePattern(modalName, hideModal),
  };
}

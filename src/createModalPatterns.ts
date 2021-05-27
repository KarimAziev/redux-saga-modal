import { Action } from 'redux';
import { take } from 'redux-saga/effects';
import {
  showModal,
  updateModal,
  hideModal,
  clickModal,
  destroyModal,
  submitModal,
} from './actionsCreators';
import { ModalActionCreators, ModalAction } from './interface';

const identity = <T>(v: T): T => v;

function isFunc(f: any): f is Function {
  return typeof f === 'function';
}
function isUndef(v: any): v is undefined {
  return v === null || v === undefined;
}

function isString(s: any): s is string {
  return typeof s === 'string';
}

function isNumber(n: any): n is number {
  return typeof n === 'number';
}

function isArray(v: any): v is any[] {
  return Array.isArray(v);
}

function isObject(obj: any): obj is object {
  return obj && !isArray(obj) && typeof obj === 'object';
}

// eslint-disable-next-line no-shadow
const predicate = (predicate: typeof payloadMatcher) => (
  input: Parameters<typeof payloadMatcher>,
) => predicate(input);

const arrayPred = (patterns: any[]) => (input: unknown): boolean =>
  patterns.some((p) => payloadMatcher(p)(input)) as boolean;

const eqMatcher = (pattern: unknown) => (input: unknown) => input === pattern;

const konst = <T>(v: T): (() => T) => () => v;
const kTrue = konst(true);
const wildcard = () => kTrue;

function payloadMatcher(pattern?: unknown) {
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

function modalMatcher(
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
  return function(pattern?: Action | unknown): any {
    return isAction(pattern)
      ? modalMatcher(modalName, actionType, kTrue, pattern as ModalAction)
      : (action: Action) =>
          modalMatcher(modalName, actionType, pattern, action as ModalAction);
  };
};

export const makeTakePattern = (
  modalName: string,
  actionCreator: ModalActionCreators,
) => {
  const actionType = actionCreator('', {}).type;
  return function(pattern?: Action | unknown) {
    return isAction(pattern)
      ? take(modalMatcher(modalName, actionType, kTrue, pattern as ModalAction))
      : take(
          (action: Action): ReturnType<typeof modalMatcher> =>
            modalMatcher(modalName, actionType, pattern, action as ModalAction),
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

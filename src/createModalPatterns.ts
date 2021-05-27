// prettier-ignore
import { Action } from 'redux';
import { take, ActionPattern } from 'redux-saga/effects';
import * as actionsCreators from './actionsCreators';
import { ModalActionCreators, ModalAction, RenameActionsMap } from './interface';
import renameMap from './renameMap';

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

const eqMatcher = (pattern: unknown) => (input: unknown) =>
  input === pattern;
const wildcard = () => kTrue;

const konst = <T>(v: T): (() => T) => () => v;
const kTrue = konst(true);

const capitalize = (v: string): Capitalize<string> =>
    v.charAt(0).toUpperCase() + v.slice(1);


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
): ActionPattern => {
  const actionType = actionCreator('', {}).type;
  return function(pattern?: Action | unknown) {
    return isAction(pattern)
      ? modalMatcher(modalName, actionType, kTrue, pattern)
      : (action: Action): ReturnType<typeof modalMatcher> =>
          modalMatcher(modalName, actionType, pattern, action);
  };
};

export const makeTakePattern = (
  modalName: string,
  actionCreator: ModalActionCreators,
)  => {
  const actionType = actionCreator('', {}).type;
  return function(pattern?: Action | unknown) {
    return isAction(pattern)
      ? take(modalMatcher(modalName, actionType, kTrue, pattern))
      : take(
          (action: Action): ReturnType<typeof modalMatcher> =>
            modalMatcher(modalName, actionType, pattern, action),
        );
  };
};





const createModalPatterns = <
    R extends {
      // eslint-disable-next-line
      [P in keyof RenameActionsMap as RenameActionsMap[P]]: ReturnType<typeof makeModalPattern>
}
    >(
      modalName: string,
): R => (Object.keys(renameMap) as string[]).reduce(
    (acc: R, k: any) => ({
      ...acc,
      [k]: makeModalPattern(modalName, actionsCreators[renameMap[k]]),
    }),
    {} as R
  );

// prettier-ignore
export const createTakePatterns = <
    R extends {
      // eslint-disable-next-line
      [P in keyof RenameActionsMap as `take${Capitalize<string & RenameActionsMap[P]>}`]: ReturnType<typeof makeTakePattern>
}
    >(
      modalName: string,
    ): R => (Object.keys(renameMap) as string[]).reduce(
    (acc: R, k: any) => ({
      ...acc,
      [`take${capitalize(k)}`]: makeModalPattern(modalName, actionsCreators[renameMap[k]]),
    }),
    {} as R
   )

export default createModalPatterns;
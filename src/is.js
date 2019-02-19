// @flow
import actionTypes from './actionTypes';
import { isFunction, curry, allPass } from './lib';
import type { ModalName, Action } from './flow-types';
import type { Pattern } from 'redux-saga';
import * as is from '@redux-saga/is';

type Checker = (name: ModalName, pattern: Pattern, action: Action) => boolean;

const callPattern = curry(
  (pattern, payload): boolean %checks =>
    pattern &&
    (isFunction(pattern)
      ? pattern(payload)
      : is.array(pattern)
      ? pattern.includes(payload)
      : (pattern && pattern === payload) || pattern === '*')
);
export const isActionType = curry(
  (type: string | Array<string>, action: Action) =>
    is.array(type) ? type.includes(action.type) : type === action.type
);

export const isModalName = curry(
  (name: ModalName | Array<string>, action: Action) =>
    action.meta && action.meta.name && callPattern(name, action.meta.name)
);

export const click: Checker = curry(
  (name, pattern, action) =>
    allPass([isActionType(actionTypes.CLICK_MODAL), isModalName(name)])(
      action
    ) && callPattern(pattern, action.payload)
);

export const hide: Checker = curry((name, action) =>
  allPass([isActionType(actionTypes.HIDE_MODAL), isModalName(name)])(action)
);

export const show = curry((name, pattern, action) =>
  allPass([isActionType(actionTypes.SHOW_MODAL), isModalName(name)])(action) &&
  pattern
    ? callPattern(pattern, action)
    : false
);

export const destroy = curry((name, action) =>
  allPass([isActionType(actionTypes.DESTROY_MODAL), isModalName(name)])(action)
);

const modalCheckers = {
  click,
  show,
  hide,
  destroy,
};

export default modalCheckers;

// export const mockAction = {
//   type: actionTypes.CLICK_MODAL,
//   payload: 'ok',
//   meta: { name: 'name' },
// };

// const mockClick = isClick('name', 'ok')(mockAction);

//

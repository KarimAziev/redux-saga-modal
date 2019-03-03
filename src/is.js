// @flow
import actionTypes from './actionTypes';
import { isFunction, curry, allPass } from './lib';
import type { ModalName, Action } from './flow-types';

import * as is from '@redux-saga/is';


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

export const click = curry(
  (name, pattern, action) =>
    allPass([isActionType(actionTypes.CLICK_MODAL), isModalName(name)])(
      action
    ) && callPattern(pattern, action.payload)
);

export const hide = curry((name, action) =>
  allPass([isActionType(actionTypes.HIDE_MODAL), isModalName(name)])(action)
);

export const show = curry((name, pattern, action) =>
  allPass([isActionType(actionTypes.SHOW_MODAL), isModalName(name)])(action) &&
  pattern
    ? callPattern(pattern, action)
    : false
);

export const update = curry(
  (name, pattern, action) =>
    allPass([isActionType(actionTypes.UPDATE_MODAL), isModalName(name)])(
      action
    ) && callPattern(pattern, action.payload)
);

export const destroy = curry((name, action) =>
  allPass([isActionType(actionTypes.DESTROY_MODAL), isModalName(name)])(action)
);

const isModal = {
  click,
  show,
  hide,
  destroy,
  update,
};

export default isModal;

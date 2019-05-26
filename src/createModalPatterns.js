import * as actions from './actions';
import renameActionsMap from './renameActionsMap';
import * as is from '@redux-saga/is';
import { kTrue } from './utils';

export const array = patterns => input =>
  patterns.some(p => payloadMatcher(p)(input));
// eslint-disable-next-line no-shadow
export const predicate = predicate => input => predicate(input);
export const string = pattern => input => input === String(pattern);
export const symbol = pattern => input => input === pattern;
export const wildcard = () => kTrue;

export function payloadMatcher(pattern) {
  // prettier-ignore
  const matcherCreator = (
    pattern === '*' ? wildcard
      : is.undef(pattern) ? wildcard
        : is.string(pattern) ? string
          : is.array(pattern) ? array
            : is.stringableFunc(pattern) ? string
              : is.func(pattern) ? predicate
                : is.symbol(pattern) ? symbol
                  : null
  );

  if (matcherCreator === null) {
    throw new Error(`invalid pattern: ${pattern}`);
  }

  return matcherCreator(pattern);
}

export function modalMatcher(modalName, actionType, pattern, action) {
  const { type, payload, meta } = action;

  const isMatch =
        type === actionType &&
        meta &&
        meta.name === modalName &&
        payloadMatcher(pattern)(payload);
  return isMatch;
}

const actionsKeys = Object.keys(actions);

export default function createModalPatterns(
  modalName,
  renameMap = renameActionsMap
) {
  return actionsKeys.reduce((acc, actionKey) => {
    const actionCreator = actions[actionKey];
    const patternKey = renameMap[actionKey];
    const actionType = actionCreator(modalName).type;
    acc[patternKey] = patternOrAction => {
      if (is.object(patternOrAction)) {
        return modalMatcher(
          modalName,
          actionType,
          kTrue,
          patternOrAction
        );
      }
      return action =>
        modalMatcher(modalName, actionType, patternOrAction, action);
    };

    return acc;
  }, {});
}

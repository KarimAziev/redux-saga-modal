
import * as actions from './actions';
import { modalMatcher } from './matcher';

const actionsKeys = Object.keys(actions);

export default function createModalPatterns(modalName, renameMap) {
  return actionsKeys.reduce((acc, actionKey) => {
    const actionCreator = actions[actionKey];
    const patternKey = renameMap[actionKey];
    const actionType = actionCreator(modalName).type;
    acc[patternKey] = (pattern) => (action) => {
      return modalMatcher(modalName, actionType, pattern, action);
    };

    return acc;
  }, {});
}
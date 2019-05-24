import * as actions from '../actions';
import { modalMatcher } from '../matcher';
import { renameActionsMap } from '../defaults';
import * as is from '@redux-saga/is';

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
      console.log('patternOrAction', patternOrAction);
      if (is.object(patternOrAction)) {
        console.log(
          'is.object(patternOrAction)',
          is.object(patternOrAction)
        );
        return modalMatcher(
          modalName,
          actionType,
          () => true,
          patternOrAction
        );
      }
      return action =>
        modalMatcher(modalName, actionType, patternOrAction, action);
    };

    return acc;
  }, {});
}

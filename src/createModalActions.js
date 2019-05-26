import * as actionCreators from './actions';
import defaultRenameMap from './renameActionsMap';

export function bindActionCreator(actionCreator, name, effect) {
  return function(...args) {
    if (typeof effect === 'function') {
      return effect(actionCreator.apply(this, [name, ...args]));
    }

     return actionCreator.apply(this, [name, ...args]);
  };
}

 export default function createModalActions(name, renameActionsMap, effect) {
  const binder = bindActionCreator;
  if (typeof actionCreators === 'function') {
    return binder(actionCreators, name, effect);
  }

   if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `createModalActions expected an object or a function, instead received ${
        actionCreators === null ? 'null' : typeof actionCreators
      }. ` +
                'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?'
    );
  }

   const boundActionCreators = {};
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    const renameMap = renameActionsMap || defaultRenameMap;
    const boundKey = renameMap[key] ? renameMap[key] : key;

     if (typeof actionCreator === 'function') {
      boundActionCreators[boundKey] = binder(actionCreator, name, effect);
    }
  }
  return boundActionCreators;
}
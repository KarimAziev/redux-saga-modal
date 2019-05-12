import * as actionCreators from './actions';


export function bindActionCreator(actionCreator, name, effect) {
  return function(...args) {
    
    if (typeof effect === 'function') {
      return effect(actionCreator.apply(this, [name, ...args]));
    }

    return actionCreator.apply(this, [name, ...args]);
  };
}



export function getBoundModalActions(name, effect, renameMap, customBinder) {
  const binder = customBinder || bindActionCreator;
  if (typeof actionCreators === 'function') {
    return binder(actionCreators, name, effect);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `getBoundModalActions expected an object or a function, instead received ${
        actionCreators === null ? 'null' : typeof actionCreators
      }. ` +
                'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?'
    );
  }
  
  const boundActionCreators = {};
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];

    const boundKey = renameMap && renameMap[key] 
    ? renameMap[key]
      : key;

    if (typeof actionCreator === 'function') {
      boundActionCreators[boundKey] = binder(
        actionCreator,
        name,
        effect,
      );
    } 
  }
  return boundActionCreators;
}

export const konst = v => () => v;
export const kTrue = konst(true);
export const kFalse = konst(false);
export const noop = () => {};
export const identity = v => v;

const hasSymbol = typeof Symbol === 'function';
export const asyncIteratorSymbol = hasSymbol && Symbol.asyncIterator ? Symbol.asyncIterator : '@@asyncIterator';

export function check(value, predicate, error) {
  if (!predicate(value)) {
    throw new Error(error);
  }
}

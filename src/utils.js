function bindActionCreator(actionCreator, dispatch, name) {
  return function(...args) {
    return dispatch(actionCreator.apply(this, [name, ...args]));
  };
}

export function bindModalActionCreators(actionCreators, dispatch, name) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch, name);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, instead received ${
        actionCreators === null ? 'null' : typeof actionCreators
      }. ` +
                'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?'
    );
  }

  const boundActionCreators = {};
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(
        actionCreator,
        dispatch,
        name
      );
    }
  }
  return boundActionCreators;
}

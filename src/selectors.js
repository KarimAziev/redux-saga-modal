
import { createSelector } from 'reselect';

const uncurry = curriedFn => (...args) => (
  args.reduce((left, right) => left(right), curriedFn)
);

const createSelectorN = curriedFn => (...selectors) => (
  createSelector(...selectors, uncurry(curriedFn))
);

const propOr = (data, defProp) => key => data[key] || defProp;

export const modalsReducerSelector = state => state.modal;

export const modalsKeysSelector = createSelector(
  modalsReducerSelector,
  data => Object.keys(data)
);
export const childrenSelector = (props) => props.children;

export const isModalsInittedSelector = createSelector(
  modalsReducerSelector,
  childrenSelector,
  (data, children = []) => {
    
    const keysCounter = Object.keys(data).length;
    const childrenCounter = children.length;
    return keysCounter > 0 && keysCounter === childrenCounter; 
  }
);

export const modalDataSelector = createSelectorN(propOr)(modalsReducerSelector);

import { put, select, take } from 'redux-saga/effects';
import { modalSelector, modalsStateSelector } from './selectors';
import createModalActions from './createModalActions';
import renameActionsMap from './renameActionsMap';
import { capitalize } from './utils';

export function createTakeEffects(patterns = {}) {
  return Object.keys(patterns)
    .reduce((acc, key) => {
      const pattern = patterns[key];
      const effectName = `take${capitalize(key)}`;
      const effect = payloadPattern => take((action) => {
        if (payloadPattern) {
          return pattern(payloadPattern)(action);
        }
        return pattern(action);
      });

      acc[effectName] = effect;
      return acc;
    }, {});
}

export function createPutEffects(modalName, renameMap) {
  return createModalActions(
    modalName,
    renameMap,
    put,
  );
}

export default function createModalEffects(modalName, params) {
  const config = {
    getModalsState: modalsStateSelector,
    renameMap: renameActionsMap,
    ...params,
  };
  
  const selector =
        config.selector || modalSelector(modalName, config.getModalsState);

  const effects = {
    ...createPutEffects(
      modalName,
      config.renameMap,
    ),
    ...createTakeEffects(params.patterns),
  }
  effects.select = () => select(selector);
  
  return effects;
}
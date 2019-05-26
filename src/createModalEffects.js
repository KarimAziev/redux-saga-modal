import { put, select, take } from 'redux-saga/effects';
import { modalSelector, modalsStateSelector } from './selectors';
import createModalActions from './createModalActions';
import renameActionsMap, { renameActionsMapValues } from './renameActionsMap';
import { capitalize } from './utils';

export function createTakeEffects(patterns) {
  return renameActionsMapValues
    .reduce((acc, key) => {
      const pattern = patterns[key];
      const effectName = `take${capitalize(key)}`
      const effect = payloadPattern => take((action) => {
        if (payloadPattern) {
          return pattern(payloadPattern)(action)
        }
        return pattern(action);
      });

      acc[effectName] = effect;
      return acc;
    }, {});
}

 export default function createModalEffects(modalName, params) {
  const config = {
    getModalsState: modalsStateSelector,
    renameMap: renameActionsMap,
    ...params,
  };

  const selector =
        config.selector || modalSelector(modalName, config.getModalsState);
  const effects = createModalActions(
    modalName,
    config.renameMap,
    put
  );
  effects.select = () => select(selector);

   return effects;
}
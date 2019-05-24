import { put, select } from 'redux-saga/effects';
import { modalSelector, modalsStateSelector } from '../selectors';
import createModalActions from './createModalActions';
import * as defaults from '../defaults';

export default function createModalEffects(modalName, params) {
  const config = {
    getModalsState: modalsStateSelector,
    renameMap: defaults.renameActionsMap,
    effect: put,
    ...params,
  };

  const selector =
        config.selector || modalSelector(modalName, config.getModalsState);
  const effects = createModalActions(
    modalName,
    config.renameMap,
    config.effect
  );
  effects.select = () => select(selector);

  return effects;
}

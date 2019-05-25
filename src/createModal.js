import { modalSelector, modalsStateSelector } from './selectors';
import createModalActions from './helpers/createModalActions';
import createModalPatterns from './helpers/createModalPatterns';
import createModalEffects from './helpers/createModalEffects';
import * as defaults from './defaults';
import { check } from './utils';
import { string } from '@redux-saga/is';

export default function createModal(modalName, params) {
  if (process.env.NODE_ENV !== 'production') {
    check(
      modalName,
      string,
      'name passed to the createModal is not a string!'
    );
  }

  const config = {
    getModalsState: modalsStateSelector,
    renameMap: defaults.renameActionsMap,
    ...params,
  };

  const renameMap = config.renameMap || defaults.renameActionsMap;
  const modalStateSelector = config.getModalState;
  const selector = modalSelector(modalName, modalStateSelector);

  const effects = createModalEffects(modalName, {
    selector,
    renameMap,
  });

  const boundActions = createModalActions(modalName, renameMap);
  const patterns = createModalPatterns(modalName);

  const modal = {
    name: modalName,
    selector: selector,
    pattern: patterns,
    effect: effects,
    action: boundActions,
  };

  return modal;
}

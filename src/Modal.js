import { modalSelector, modalsStateSelector } from './selectors';
import { getBoundModalActions } from './utils';
import * as defaults from './defaults';
import createModalPatterns from './patterns';
import createModalEffects from './effects';
import { check } from './utils';
import { string } from '@redux-saga/is';

export function createModal(modalName, params) {
  if (process.env.NODE_ENV !== 'production') {
    check(modalName, string, 'name passed to the createModal is not a string!');
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

  const boundActions = getBoundModalActions(modalName, undefined, renameMap);
  const patterns = createModalPatterns(modalName, renameMap);

  const modal = {
    name: modalName,
    selector: selector,
    pattern: patterns,
    effect: effects,
    action: boundActions,
  };

  
  return modal;
};
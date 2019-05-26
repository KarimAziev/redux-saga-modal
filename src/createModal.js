import { modalSelector, modalsStateSelector } from './selectors';
import createModalActions from './createModalActions';
import createModalPatterns from './createModalPatterns';
import createModalEffects, { createTakeEffects } from './createModalEffects';
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
    ...params,
  };

  const modalStateSelector = config.getModalState;
  const selector = modalSelector(modalName, modalStateSelector);

  const effects = createModalEffects(modalName, {
    selector,
  });

  const boundActions = createModalActions(modalName);
  const patterns = createModalPatterns(modalName);

  const modal = {
    name: modalName,
    selector: selector,
    pattern: patterns,
    action: boundActions,
    ...effects,
    ...createTakeEffects(patterns),
  };

  return modal;
}
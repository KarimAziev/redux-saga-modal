import { modalSelector, modalsStateSelector } from './selectors';
import createModalActions from './createModalActions';
import createModalPatterns from './createModalPatterns';
import createModalEffects from './createModalEffects';
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

  const helpers = createModalHelpers(modalName, params);

  const modal = {
    ...helpers,
    ...createModalEffects(modalName, {
      selector: helpers.selector,
      patterns: helpers.patterns,
    }),
  };

  return modal;
}

export function createModalHelpers(modalName, params) {
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

  return ({
    name: modalName,
    selector: modalSelector(modalName, config.getModalsState),
    patterns: createModalPatterns(modalName),
    actions: createModalActions(modalName),
  });
}

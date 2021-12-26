import { modalSelector, modalsStateSelector } from './selectors';
import { createModalActions } from './createModalActions';
import createModalPatterns from './createModalPatterns';
import createModalEffects from './createModalEffects';
import { ICreateModalParams, ModalHelpers } from './interface';

/**
 * Creates a modal instance.
 *
 * @public
 *
 * @param modalName - name of the modal
 * @param params.getModalsState - a selector that takes the Redux store and
 *    returns the slice which corresponds to where the redux-saga-modal
 *    =reducer= was mounted. By default, the reducer is mounted under the
 *    =modals= key.
 *
 * @returns an object with such methods properties:
 *    `name`,
 *    `selector`,
 *    `patterns`,
 *    `actions`,
 *    `show`,
 *    `click`,
 *    `submit`,
 *    `update`,
 *    `hide`,
 *    `destroy`,
 *    `takeShow`,
 *    `takeClick`,
 *    `takeSubmit`,
 *    `takeUpdate`,
 *    `takeHide`,
 *    `takeDestroy`,
 *
 *    Both `patterns` and `actions` includes methods named `show`, `update`, `hide`, `submit`, `click` and `destroy`.
 *    All methods refer to the modal's name so you don't need manually pass it.
 *
 **/

export default function createModal(
  modalName: string,
  params?: ICreateModalParams,
) {
  const helpers = createModalHelpers(modalName, params);

  return {
    name: helpers.name,
    selector: helpers.selector,
    patterns: helpers.patterns,
    actions: helpers.actions,
    ...createModalEffects(modalName, {
      selector: helpers.selector,
      patterns: helpers.patterns,
    }),
  };
}

export function createModalHelpers(
  modalName: string,
  params?: ICreateModalParams,
): ModalHelpers {
  const config = {
    getModalsState: modalsStateSelector,
    ...params,
  };

  return {
    name: modalName,
    selector: modalSelector(modalName, config.getModalsState),
    patterns: createModalPatterns(modalName),
    actions: createModalActions(modalName),
  };
}

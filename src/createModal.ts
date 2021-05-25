import { modalSelector, modalsStateSelector } from './selectors';
import { createModalActions } from './createModalActions';
import createModalPatterns from './createModalPatterns';
import createModalEffects from './createModalEffects';
import { ICreateModalParams, ModalHelpers } from './interface';

export default function createModal(
  modalName: string,
  params?: ICreateModalParams,
) {
  const helpers = createModalHelpers(modalName, params);

  return {
    ...helpers,
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

import { modalSelector, modalsStateSelector } from './selectors';
import { createModalActions } from './createModalActions';
import createModalPatterns from './createModalPatterns';
import createModalEffects from './createModalEffects';
import { ICreateModalParams, ModalHelpers, State } from './interface';

export default function createModal(
  modalName: string,
  params?: ICreateModalParams,
) {
  const helpers = createModalHelpers(modalName, params);
  const selectProps = (state: State) => helpers.selector(state)?.props;
  const isOpenSelector = (state: State) => helpers.selector(state)?.isOpen;
  return {
    name: helpers.name,
    selector: helpers.selector,
    patterns: helpers.patterns,
    actions: helpers.actions,
    selectProps: selectProps,
    isOpenSelector: isOpenSelector,
    ...createModalEffects(modalName, {
      selector: helpers.selector,
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

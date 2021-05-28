import { State, ModalItemState } from './interface';

export const modalsStateSelector = (
  state: State,
): Record<string, ModalItemState> => (state['modals'] ? state['modals'] : {});

export const modalSelector = (name: string, selector = modalsStateSelector) => (
  state: State,
) => {
  const modalsState = selector(state);
  return modalsState && modalsState[name];
};

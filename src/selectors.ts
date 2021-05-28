import { State } from './interface';

export const modalsStateSelector = (state: State) => state.modals;

export const modalSelector = (name: string, selector = modalsStateSelector) => (
  state: State,
) => {
  const modalsState = selector(state);
  return modalsState && modalsState[name];
};

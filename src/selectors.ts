import { State } from './interface';

export const modalsStateSelector = <S extends State>(state: S) => state.modals;

export const modalSelector = <S extends State>(
  name: string,
  selector = modalsStateSelector,
) => (state: S) => {
  const modalsState = selector(state);
  return modalsState && modalsState[name];
};

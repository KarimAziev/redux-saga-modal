// @flow
import type { ModalsState, ModalName } from './flow-types';
import { Store } from 'redux';
export const modalsStateSelector = (state: Store): ModalsState => state.modals;
export const modalSelector = (
  name: ModalName,
  selector: typeof modalsStateSelector = modalsStateSelector
) => (state: Store, props: any) => {
  const modalsState: ModalsState = selector(state, props);
  return modalsState && modalsState[name];
};

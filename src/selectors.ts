import { State } from './interface';

/**
 * A selector that takes the Redux store and returns the slice which
 * corresponds to where the redux-saga-modal reducer mounted
 * @param state - Redux store
 * @returns an object which corresponds to where the redux-saga-modal reducer mounted
 **/
export const modalsStateSelector = <S extends State>(state: S) =>
  state.modals as any;

/**
 * A selector creator
 * @param modalName - name of the modal
 * @param modalsSelector - selector that returns the slice with all modals. See {@link modalsStateSelector}
 * @returns an {@link ./interface#ModalItemState}
 **/
export const modalSelector = <S extends State>(
  modalName: string,
  modalsSelector = modalsStateSelector,
) => {
  return <R>(state: S) => {
    const modals = modalsSelector<S>(state);
    return modals[modalName] as R;
  };
};

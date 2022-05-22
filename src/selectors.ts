import { RootStateOrAny, State, ModalItemState } from './interface';

/**
 * A selector that takes the Redux store and returns the slice which
 * corresponds to where the redux-saga-modal reducer mounted
 * @param state - Redux store
 * @returns an object which corresponds to where the redux-saga-modal reducer mounted
 **/
export const modalsStateSelector = <S extends State>(state: S) => state.modals;

/**
 * A selector creator
 * @param modalName - name of the modal
 * @param modalsSelector - selector that returns the slice with all modals. See {@link modalsStateSelector}
 * @returns modal selector {@link ./interface#ModalItemState}
 **/
export const modalSelector = (
  modalName: string,
  modalsSelector = modalsStateSelector,
) => {
  return <InitProps>(state: RootStateOrAny) => {
    const modals = modalsSelector(state);
    return modals[modalName] as ModalItemState<InitProps>;
  };
};

import { ModalActionTypes } from './actionTypes';
import { SagaModalAction, SagaModalCommonAction } from './interface';

/**
 *  Create a modal action creator which accept name and payload.
 *
 *  See {@link showModal}, {@link updateModal}, {@link submitModal} and {@link clickModal}
 *
 *  @return an action creator which arguments are name and payload,
 *  and returned value is an action with payload, meta (with property name) and type.
 **/
const createModalAction =
  (type: ModalActionTypes) =>
  <P>(name: string, payload: P): SagaModalAction<P> => ({
    type: type,
    payload,
    meta: { name },
  });
/**
 *  Create a modal action creator which accept only modal name.
 *
 * See {@link hideModal} and {@link destroyModal}
 *
 *  @return an action creator which arguments are name,
 *  and returned value is an action with meta (with property name) and type.
 *
 *
 **/
const createModalWithoutPayload =
  (type: ModalActionTypes) =>
  (name: string): SagaModalCommonAction => ({
    type: type,
    meta: { name },
  });

/**
 *  An action creator to show a modal and sets payload as props.
 *  @param name - name of the modal
 *  @param payload - object with props which will be passed to connected component.
 **/
export const showModal = createModalAction(ModalActionTypes.SHOW_MODAL);

/**
 *  An action creator to update a modal by merging with current redux props
 *  @param name - name of the modal
 *  @param payload - object with props which will be passed to connected component.
 **/
export const updateModal = createModalAction(ModalActionTypes.UPDATE_MODAL);

/**
 * An action creator to hide a modal by setting `isOpen` to false.
 * Existing props will be preserved
 *  @param name - name of the modal
 **/
export const hideModal = createModalWithoutPayload(ModalActionTypes.HIDE_MODAL);

/**
 * An action creator to close a modal and clean props from redux-state
 *  @param name - name of the modal
 **/
export const destroyModal = createModalWithoutPayload(
  ModalActionTypes.DESTROY_MODAL,
);

/** An action creator to indicate submitted.
 *  @param name - name of the modal
 *  @param payload - will *not* be stored in modal redux state
 **/
export const submitModal = createModalAction(ModalActionTypes.SUBMIT_MODAL);

/** An action creator to indicate some users clicks.
 *  @param name - name of the modal
 *  @param payload - will *not* be stored in modal redux state
 **/
export const clickModal = createModalAction(ModalActionTypes.CLICK_MODAL);

import { ModalActionTypes } from './actionTypes';
import { ModalAction } from './interface';

const createModalAction = (type: ModalActionTypes) => <P>(
  name: string,
  payload: P,
): ModalAction<P> => ({
  type: type,
  payload,
  meta: { name },
});

const createModalWithoutPayload = (type: ModalActionTypes) => (
  name: string,
) => ({
  type: type,
  meta: { name },
});

/** An action creator to show a modal and sets payload as props.
 *  @param name - name of the modal
 *  @param payload - object with props which will be passed to connected component.
 **/
export const showModal = createModalAction(ModalActionTypes.SHOW_MODAL);

/** An action creator to update a modal by merging with current redux props
 *  @param name - name of the modal
 *  @param payload - object with props which will be passed to connected component.
 **/
export const updateModal = createModalAction(ModalActionTypes.UPDATE_MODAL);

/** An action creator to hide a modal by setting `isOpen` to false
 *  @param name - name of the modal
 **/
export const hideModal = createModalWithoutPayload(ModalActionTypes.HIDE_MODAL);

/** An action creator to close a modal and clean props from redux-state
 *  @param name - name of the modal
 **/
export const destroyModal = createModalWithoutPayload(
  ModalActionTypes.DESTROY_MODAL,
);

/** An action creator to indicates that something was submitted
 *  @param name - name of the modal
 *  @param payload - any value
 **/
export const submitModal = createModalAction(ModalActionTypes.SUBMIT_MODAL);

/** An action creator to indicate some users clicks
 *  @param name - name of the modal
 *  @param payload - any value
 **/
export const clickModal = createModalAction(ModalActionTypes.CLICK_MODAL);

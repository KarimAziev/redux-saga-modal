import reducer from './reducer';
import {
  showModal,
  hideModal,
  clickModal,
  updateModal,
  destroyModal,
  submitModal,
} from './actionsCreators';
import sagaModal from './sagaModal';
import sagas from './sagas';
import createModalBoundActions, {
  createModalActions,
} from './createModalActions';
import createModalPatterns from './createModalPatterns';
import createModalEffects, { createTakeEffects } from './createModalEffects';
import createModal, { createModalHelpers } from './createModal';
import { modalSelector, modalsStateSelector } from './selectors';
import { ModalActionTypes } from './actionTypes';

export * from './interface';

export {
  sagaModal,
  reducer,
  ModalActionTypes,
  sagas,
  createTakeEffects,
  createModalBoundActions,
  showModal,
  hideModal,
  clickModal,
  updateModal,
  createModal,
  destroyModal,
  submitModal,
  createModalEffects,
  createModalPatterns,
  createModalActions,
  createModalHelpers,
  modalsStateSelector,
  modalSelector,
};

import reducer from './reducer';
import {
  showModal,
  hideModal,
  clickModal,
  updateModal,
  destroyModal,
  submitModal,
} from './actionsCreators';
import sagaModal, { SagaModalConfig } from './sagaModal';
import sagas from './sagas';
import createModalBoundActions, {
  ModalActions,
  createModalActions,
} from './createModalActions';
import createModalPatterns, { ModalPatterns } from './createModalPatterns';
import createModalEffects, {
  createTakeEffects,
  ModalTakeEffects,
  ModalPutEffects,
} from './createModalEffects';
import createModal from './createModal';
import { modalSelector, modalsStateSelector } from './selectors';
import { ModalActionTypes } from './actionTypes';

export * from './createModal';

export {
  createModal,
  ModalActions,
  ModalPatterns,
  SagaModalConfig,
  ModalTakeEffects,
  ModalPutEffects,
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
  destroyModal,
  submitModal,
  createModalEffects,
  createModalPatterns,
  createModalActions,
  modalsStateSelector,
  modalSelector,
};

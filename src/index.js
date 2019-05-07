// @flow
import reducer from './reducer';
import sagaModal from './sagaModal';
import sagas, { forkModal, callModal } from './sagas';
import {
  clickModal,
  showModal,
  hideModal,
  updateModal,
  destroyModal,
  confirmModal,
} from './actions';
import actionTypes from './actionTypes';
import { getModalEffects } from './effects';
import Modal from './Modal';

export {
  sagaModal,
  Modal,
  getModalEffects,
  reducer,
  sagas,
  clickModal,
  showModal,
  hideModal,
  updateModal,
  destroyModal,
  confirmModal,
  actionTypes,
  forkModal,
  callModal,
};

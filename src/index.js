// @flow
import reducer from './reducer';
import sagaModal from './sagaModal';
import sagas from './sagas';
import {
  clickModal,
  showModal,
  hideModal,
  updateModal,
  destroyModal,
  confirmModal,
} from './actions';
import actionTypes from './actionTypes';
import { createModal, getModalEffects } from './effects';

export {
  sagaModal,
  createModal,
  reducer,
  sagas,
  clickModal,
  showModal,
  hideModal,
  updateModal,
  destroyModal,
  confirmModal,
  getModalEffects,
  actionTypes,
};

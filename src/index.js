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
  submitModal,
} from './actions';
import * as actionTypes from './actionTypes';
import { createModal } from './Modal';

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
  submitModal,
  actionTypes,
};

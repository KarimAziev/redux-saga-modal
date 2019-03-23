// @flow
import reducer from './reducer';
import sagaModal from './sagaModal';
import sagas, { createModal } from './sagas';
import {
  clickModal,
  showModal,
  hideModal,
  updateModal,
  destroyModal,
} from './actions';
import actionTypes from './actionTypes';

export {
  sagaModal,
  reducer,
  sagas,
  clickModal,
  showModal,
  hideModal,
  updateModal,
  destroyModal,
  createModal,
  actionTypes,
};

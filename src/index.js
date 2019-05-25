// @flow
import reducer from './reducer';
import sagaModal from './sagaModal';
import sagas, { modalSaga } from './sagas';
import {
  clickModal,
  showModal,
  hideModal,
  updateModal,
  destroyModal,
  submitModal,
} from './actions';
import * as actionTypes from './actionTypes';
import createModal from './createModal';
import createModalActions from './helpers/createModalActions';
import createModalPatterns from './helpers/createModalPatterns';
import createModalEffects from './helpers/createModalEffects';

export {
  sagaModal,
  modalSaga,
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
  createModalActions,
  createModalPatterns,
  createModalEffects,
};

// @flow
import reducer from './reducer';
import { clickModal, showModal, hideModal, updateModal } from './actions';
import sagaModal from './sagaModal';
import sagas from './sagas';
import {
  checkModalName,
  checkModalClick,
  checkActionType,
  takeModalShow,
  takeModalHide,
  takeModalClick,
  takeModalUpdate,
} from './lib';

export {
  sagaModal,
  reducer,
  sagas,
  clickModal,
  showModal,
  hideModal,
  updateModal,
  checkModalName,
  checkModalClick,
  checkActionType,
  takeModalShow,
  takeModalHide,
  takeModalClick,
  takeModalUpdate,
};

import reducer from './reducer';
import { clickModal, showModal, hideModal, updateModal } from './actions';
import sagaModal from './sagaModal';
import sagas from './sagas';
import {
  checkModalName,
  checkActionType,
  takeModalShow,
  takeModalHide,
  takeModalClick,
  takeModalUpdate,
  takeModalDestroy,
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
  checkActionType,
  takeModalShow,
  takeModalHide,
  takeModalClick,
  takeModalUpdate,
  takeModalDestroy,
};



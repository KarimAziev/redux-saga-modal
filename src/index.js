// @flow
import reducer from './reducer';
import {
  clickModal,
  showModal,
  hideModal,
  updateModal,
  destroyModal,
} from './actions';
import sagaModal from './sagaModal';
import sagas from './sagas';

export {
  sagaModal,
  reducer,
  sagas,
  clickModal,
  showModal,
  hideModal,
  updateModal,
  destroyModal,
};

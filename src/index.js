import reducer from './reducer';
import { showModal, hideModal, clickModal, updateModal } from './actions';
import sagaModal from './sagaModal';
import sagas from './sagas';
import createModalActions from './createModalActions';
import createModalPatterns from './createModalPatterns';
import createModalEffects, { createTakeEffects } from './createModalEffects';
import createModal from './createModal';

export {
  sagaModal,
  reducer,
  sagas,
  showModal,
  hideModal,
  clickModal,
  updateModal,
  createModal,
  createModalEffects,
  createTakeEffects,
  createModalPatterns, 
  createModalActions,
};

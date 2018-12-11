import 'core-js/shim';
import 'regenerator-runtime/runtime';
import reducer from './reducer';
import * as actions from './actions';
import sagaModal from './sagaModal';
import sagas from './sagas';
import * as lib from './lib';

export default {
  sagaModal,
  reducer,
  sagas,
  ...actions,
  ...lib,
};



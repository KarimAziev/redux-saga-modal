import 'core-js/shim';
import 'regenerator-runtime/runtime';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import connectSagaModal from './SagaModal';
import sagas from './sagas';
import * as lib from './lib';

export default {
  connectSagaModal,
  reducer,
  sagas,
  ...actions,
  ...selectors,
  ...lib,
};



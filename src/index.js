import 'core-js/shim';
import 'regenerator-runtime/runtime';

import reducer from './reducer';
import types from './types';
import * as actions from './actions';
import ConnectModal from './ConnectModal';
import sagas from './sagas';

export default {
  ConnectModal,
  reducer,
  types,
  sagas,
  ...actions,
};


/* if (!global._babelPolyfill) {
  console.log('global._babelPolyfill', global._babelPolyfill);
  require('core-js/shim');
  require('regenerator-runtime/runtime');
} 

global._babelPolyfill = true; */
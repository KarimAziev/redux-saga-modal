import 'core-js/shim';
import 'regenerator-runtime/runtime';

import reducer from './reducer';
import types from './types';
import * as actions from './actions';
import * as selectors from './selectors';
import Modals from './Modals';
import sagas from './sagas';
import * as utils from './utils';

export default {
  Modals,
  reducer,
  types,
  sagas,
  ...actions,
  ...selectors,
  ...utils,
};



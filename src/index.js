import reducer from './reducer';
import types from './types';
import * as actions from './actions';
import connectModal from './containers';

export default {
  connectModal,
  reducer,
  types,
  ...actions,
};

import { combineReducers } from 'redux';
import { reducer as modalsReducer } from 'redux-saga-modal';

export default combineReducers({
    // ...your other reducers
  // you have to pass modalReducer under 'modals' key,
  // for custom keys use 'getModalsState'
  modals: modalsReducer,
});

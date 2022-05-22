import { Reducer } from 'redux';
import { ModalActionTypes as actionTypes } from './actionTypes';
import { ModalsState } from './interface';

const initialState = {};

/**
 * The modals reducer. Should be mounted to Redux state at `modals`.
 *
 * @param state - see {@link ModalsState}
 * @param action - any action
 * @example
 * import { reducer as modalsReducer } from 'redux-saga-modal';
 * import { combineReducers } from 'redux';
 *
 * export default combineReducers({
 *  modals: modalsReducer,
 *  // ...other reducers
 * });
 */
const reducer: Reducer<ModalsState> = function(state = initialState, action) {
  switch (action?.type) {
    case actionTypes.SHOW_MODAL: {
      const { name } = action.meta;
      return {
        ...state,
        [name]: {
          props: action.payload,
          isOpen: true,
        },
      };
    }
    case actionTypes.UPDATE_MODAL: {
      const { name } = action.meta;

      return {
        ...state,
        [name]: {
          ...state[name],
          props: {
            ...state[name].props,
            ...action.payload,
          },
        },
      };
    }
    case actionTypes.HIDE_MODAL: {
      const { name } = action.meta;

      return {
        ...state,
        [name]: {
          ...state[name],
          isOpen: false,
        },
      };
    }

    case actionTypes.DESTROY_MODAL: {
      const { name } = action.meta;

      const shallowState = state[name] ? { ...state } : state;

      if (shallowState[name]) {
        delete shallowState[name];
      }
      return shallowState;
    }

    default:
      return state;
  }
};
export default reducer;

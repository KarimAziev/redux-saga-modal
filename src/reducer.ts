import { ModalActionTypes as actionTypes } from './actionTypes';
import { ModalsState, ModalItemState } from './interface';

const initialState: ModalsState = {};

const initialModalState: ModalItemState<{}> = {
  props: {},
};

const pluckModalState = (state: ModalsState, name: string) =>
  state[name] || initialModalState;

export default function reducer<S extends ModalsState>(
  reducerState?: S,
  action: any = {},
): ModalsState {
  const state = reducerState || initialState;
  switch (action.type) {
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

    case actionTypes.CLICK_MODAL: {
      const { name } = action.meta;

      return {
        ...state,
        [name]: {
          ...state[name],
          clicked: action.payload,
        },
      };
    }

    case actionTypes.UPDATE_MODAL: {
      const { name } = action.meta;
      const modalState = pluckModalState(state, name);

      return {
        ...state,
        [name]: {
          ...modalState,
          props: {
            ...modalState.props,
            ...action.payload,
          },
        },
      };
    }

    case actionTypes.SUBMIT_MODAL: {
      const { name } = action.meta;
      const modalState = pluckModalState(state, name);
      return {
        ...state,
        [name]: {
          ...modalState,
          props: {
            ...modalState.props,
          },
          isSubmitted: true,
          submitted: action.payload,
        },
      };
    }

    case actionTypes.HIDE_MODAL: {
      const { name } = action.meta;
      const modalState = pluckModalState(state, name);

      return {
        ...state,
        [name]: {
          ...modalState,
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
}

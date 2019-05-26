import * as actionTypes from './actionTypes';
import { omitProps } from './utils';

const initialState = {};
const initialModalState = {
  props: {},
};

const pluckModalState = (state, name) => state[name] || initialModalState;

export default function reducer(state = initialState, action) {
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
    return omitProps([name], state);
  }

  default:
    return state;
  }
}

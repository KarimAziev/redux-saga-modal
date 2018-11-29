import types from './types';
import { omitFunctions, omitProps } from './utils';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    
  case types.FORK_MODAL: {
    const { name, isOpen, saga } = action.payload;
    return {
      ...state,
      [name]: {
        ...omitProps(['isOpen', 'name'], omitFunctions(action.payload)),
        isOpen,
        saga,
      },
    };
  }

  case types.SHOW_MODAL: {
    const { name } = action.payload;
    return {
      ...state,
      [name]: {
        ...omitProps(['isOpen', 'name'], omitFunctions(action.payload)),
        isOpen: true,
        saga: state[name] && state[name].saga,
      },
    };
  }
  
  case types.HIDE_MODAL: {
    const { name } = action.payload;
    return {
      ...state,
      [name]: {
        isOpen: false,
        clicked: null,
        saga: state[name] && state[name].saga,
      },
    };
  }

  case types.CLICK_MODAL: {
    const { name, value } = action.payload;
    return {
      ...state,
      [name]: {
        ...state[name],
        clicked: value,
      },
    };
  }
    
  case types.UPDATE_MODAL: {
    const { name } = action.payload;
    return {
      ...state,
      [name]: {
        ...state[name],
        ...omitProps(['isOpen', 'name'], omitFunctions(action.payload)),
      },
    };
  }

  case types.DESTROY_MODAL: {
    const { name } = action.payload;
    return omitProps([name], state);
  }

  default: 
    return state;
  }
}


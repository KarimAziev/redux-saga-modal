import types from './types';
import { omitProps } from './utils';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

  case types.SHOW_MODAL: {
    const { name } = action.payload;
    return {
      ...state,
      [name]: {
        ...omitProps(['isOpen', 'name'], action.payload),
        isOpen: true,
      },
    };
  }
  
  case types.HIDE_MODAL: {
    const { name } = action.payload;
    return omitProps([name], state);
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
        ...omitProps(['isOpen', 'name'], action.payload),
      },
    };
  }

  default: 
    return state;
  }
}


import types from './types';
import { omitFunctions } from './utils';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    
  case types.FORK_MODAL: {
    const { name, isOpen, props } = action.payload;

    return {
      ...state,
      [name]: {
        isOpen: isOpen,
        props: omitFunctions(props),
        clicked: null,
      },
    };
  }

  case types.SHOW_MODAL: {
    const { name, props, clicked } = action.payload;
    return {
      ...state,
      [name]: {
        isOpen: true,
        props: props,
        clicked: clicked,
      },
    };
  }
  
  case types.HIDE_MODAL: {
    const { name } = action.payload;
    return {
      ...state,
      [name]: {
        props: {},
        isOpen: false,
        clicked: null,
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
    const { name, props } = action.payload;
    return {
      ...state,
      [name]: {
        ...state[name],
        props: {
          ...state[name].props,
          ...props,
        },
      },
    };
  }

  default: 
    return state;
  }
}


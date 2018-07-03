import types from './types';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    
  case types.INITIALIZE_MODAL: {
    const { key, props, clicked } = action.payload;
    return {
      ...state,
      [key]: {
        isOpen: false,
        props: props,
        clicked: clicked,
      },
    };
  }

  case types.SHOW_MODAL: {
    const { key, props, clicked } = action.payload;
    return {
      ...state,
      [key]: {
        isOpen: true,
        props: props,
        clicked: clicked,
      },
    };
  }
  
  case types.HIDE_MODAL: {
    const { key } = action.payload;
    return {
      ...state,
      [key]: {
        ...state[key],
        isOpen: false,
      },
    };
  }
    
  case types.RESET_MODAL: {
    const { key } = action.payload;
    return {
      ...state,
      [key]: {
        isOpen: false,
        props: {},
        clicked: null,
      },
    };
  }
    
  case types.MODAL_CLICK: {
    const { key, value } = action.payload;
    return {
      ...state,
      [key]: {
        ...state[key],
        clicked: value,
      },
    };
  }
    
  case types.ADD_TO_MODAL: {
    const { key, props } = action.payload;
    return {
      ...state,
      [key]: {
        ...state[key],
        props: {
          ...state[key].props,
          ...props,
        },
      },
    };
  }

  default: 
    return state;
  }
}


import types from './types';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    
  case types.INITIALIZE_MODAL: {
    const { name, props, clicked } = action.payload;
    return {
      ...state,
      [name]: {
        isOpen: false,
        props: props,
        clicked: clicked,
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
        ...state[name],
        isOpen: false,
      },
    };
  }
    
  case types.RESET_MODAL: {
    const { name } = action.payload;
    return {
      ...state,
      [name]: {
        isOpen: false,
        props: {},
        clicked: null,
      },
    };
  }
    
  case types.MODAL_CLICK: {
    const { name, value } = action.payload;
    return {
      ...state,
      [name]: {
        ...state[name],
        clicked: value,
      },
    };
  }
    
  case types.ADD_TO_MODAL: {
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


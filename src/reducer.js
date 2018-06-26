import Immutable from 'seamless-immutable';
import types from './types';

const initialState = Immutable({
});

export default function modalReducer(state = initialState, action = {}) {
  
  switch (action.type) {

  case types.SHOW_MODAL: {
    const { key, props, clicked } = action.payload;
   
    return state
      .set(key, { props, clicked, isOpen: true });
  }
  
  case types.INITIALIZE_MODAL: {
    const { key, props, clicked } = action.payload;
    return state
      .set(key, { props, clicked, isOpen: false });
  }

  case types.HIDE_MODAL: {
    const { key } = action.payload;

    return state
      .updateIn([key, 'isOpen'], val => false);
  }
    
  case types.MODAL_ITEM_CLICK: {
    const { key, value } = action.payload;
    return state.setIn([key, 'clicked'], value);
  }
    
  case types.ADD_TO_MODAL: {
    const { key, props } = action.payload;
    return state.updateIn([key, 'props'], data => ({ ...data, props }));
  }
    
  case types.RESET_MODAL: {
    const { key } = action.payload;
    
    return state
      .set(key, { isOpen: false });
  }

  default: return Immutable.merge(state, {});
  }
}


// @flow
import actionTypes from './actionTypes';
import { omitProps } from './utils';
import { Action } from 'redux';
import type { ModalsState } from './types';

const initialState: ModalsState = {};
export default function reducer(state: ModalsState = initialState, action: Action): ModalsState {
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
  
  case actionTypes.HIDE_MODAL: {
    const { name } = action.meta;
    return omitProps([name], state);
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
    const modal = state[name] || {};
    
    return {
      ...state,
      [name]: {
        ...modal,
        props: {
          ...modal.props,
          ...action.payload,
        },
      },
    };
  }

  default: 
    return state;
  }
}


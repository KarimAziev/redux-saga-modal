// @flow
import actionTypes from './actionTypes';
import { omitProps, isObject } from './utils';
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
    const { payload } = action;
    const { props } = state[name];
    
    const nextProps = isObject(props) && isObject(payload) 
      ? { ...props, ...payload }
      : payload;

    return {
      ...state,
      [name]: {
        ...state[name],
        props: nextProps,
      },
    };
  }

  default: 
    return state;
  }
}


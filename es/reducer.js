import _extends from "@babel/runtime/helpers/extends";
import actionTypes from './actionTypes';
import { omitProps } from './utils';
var initialState = {};
export default function reducer(state, action) {
  if (state === void 0) {
    state = initialState;
  }

  switch (action.type) {
    case actionTypes.SHOW_MODAL:
      {
        var _extends2;

        var name = action.payload.name;
        return _extends({}, state, (_extends2 = {}, _extends2[name] = _extends({}, omitProps(['isOpen', 'name'], action.payload), {
          isOpen: true
        }), _extends2));
      }

    case actionTypes.HIDE_MODAL:
      {
        var _name = action.payload.name;
        return omitProps([_name], state);
      }

    case actionTypes.CLICK_MODAL:
      {
        var _extends3;

        var _action$payload = action.payload,
            _name2 = _action$payload.name,
            value = _action$payload.value;
        return _extends({}, state, (_extends3 = {}, _extends3[_name2] = _extends({}, state[_name2], {
          clicked: value
        }), _extends3));
      }

    case actionTypes.UPDATE_MODAL:
      {
        var _extends4;

        var _name3 = action.payload.name;
        return _extends({}, state, (_extends4 = {}, _extends4[_name3] = _extends({}, state[_name3], omitProps(['isOpen', 'name'], action.payload)), _extends4));
      }

    default:
      return state;
  }
}
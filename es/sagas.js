import _regeneratorRuntime from "@babel/runtime/regenerator";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(rootModalSaga);

import { fork, put, all, takeLatest } from 'redux-saga/effects';
import actionTypes from './actionTypes';
import * as actions from './actions';
import { checkActionType, checkModalName, takeModalClick } from './lib';
export default function rootModalSaga(config) {
  var names;
  return _regeneratorRuntime.wrap(function rootModalSaga$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (config === void 0) {
            config = {};
          }

          names = Object.keys(config);
          _context2.prev = 2;
          _context2.next = 5;
          return all(names.map(function (name) {
            var saga = config[name];

            var filters = function filters(action) {
              return checkActionType([actionTypes.SHOW_MODAL, actionTypes.HIDE_MODAL])(action) && checkModalName(name)(action);
            };

            return takeLatest(filters,
            /*#__PURE__*/
            _regeneratorRuntime.mark(function forker(action) {
              var type, payload, context;
              return _regeneratorRuntime.wrap(function forker$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      type = action.type, payload = action.payload;

                      if (!(type === actionTypes.HIDE_MODAL)) {
                        _context.next = 3;
                        break;
                      }

                      return _context.abrupt("return");

                    case 3:
                      context = {
                        name: name,
                        update: function update(props) {
                          return put(actions.updateModal(name, props));
                        },
                        hide: function hide() {
                          return put(actions.hideModal(name));
                        },
                        takeClick: function takeClick(value) {
                          return takeModalClick(name, value);
                        }
                      };
                      _context.next = 6;
                      return fork([context, saga], payload);

                    case 6:
                    case "end":
                      return _context.stop();
                  }
                }
              }, forker, this);
            }));
          }));

        case 5:
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](2);
          console.error('ERROR IN @@REDUX-SAGA-MODAL', _context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked, this, [[2, 7]]);
}

import { takeEvery, setContext } from 'redux-saga/effects';
import * as utils from './utils';
import { inizializeModal } from './actions';


if (!global._babelPolyfill) {
  require('core-js/shim');
  require('regenerator-runtime/runtime');
} 

global._babelPolyfill = true;

export default function* sagasInvoker() {
  yield takeEvery(inizializeModal().type, function* ({ payload: { key, saga } }) {
    
    yield setContext({ key, utils })
    
    return yield takeEvery(utils.isModalShow(key), saga);
  });
}


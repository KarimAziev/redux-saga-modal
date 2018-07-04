
import { takeEvery, setContext } from 'redux-saga/effects';
import * as utils from './utils';
import { inizializeModal } from './actions';


export default function* sagasInvoker() {
  yield takeEvery(inizializeModal().type, invoker);
}

function* invoker({ payload: { key, saga } }) {
  yield setContext({ key, utils })
  return yield takeEvery(utils.isModalShow(key), saga);
}
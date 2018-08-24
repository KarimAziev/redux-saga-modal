
import { takeEvery, setContext, fork } from 'redux-saga/effects';
import * as utils from './utils';
import { inizializeModal } from './actions';


export default function* sagasInvoker() {
  yield takeEvery(inizializeModal().type, invoker);
}

function* invoker({ payload: { name, saga } }) {
  yield setContext({ name, utils })
  yield fork(saga);
}
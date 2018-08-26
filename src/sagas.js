
import { takeEvery, fork } from 'redux-saga/effects';
import types from './types';

export default function* sagasInvoker() {
  yield takeEvery(types.FORK_MODAL, invoker);
}

function* invoker(action) {
  const { saga, payload, context } = action;
  yield fork([context, saga], payload);
}
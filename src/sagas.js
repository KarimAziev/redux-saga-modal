
import { takeEvery, fork } from 'redux-saga/effects';
import types from './types';
export default function* sagasForker() {
  yield takeEvery(types.FORK_MODAL, forker);
}

function* forker(action) {
  const { saga, payload, context } = action;
  
  if (saga) {
    yield fork([context, saga], payload);
  }
}
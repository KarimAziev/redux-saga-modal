import { takeEvery, fork } from 'redux-saga/effects';
import types from './types';
import { omitProps } from './utils';
export default function* sagasForker() {
  yield takeEvery(types.FORK_MODAL, forker);
}

function* forker(action) {
  const { payload } = action;
  const { saga, context } = payload;

  if (saga) {
    yield fork([context, saga], omitProps(['saga', 'context'], payload));
  }
}

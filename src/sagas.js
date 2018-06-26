

import { takeEvery } from 'redux-saga/effects';
import { isModalShow } from './utils';
import { inizializeModal } from './actions';

export default function* sagasInvoker() {
  yield takeEvery(inizializeModal().type, function* ({ payload: { key, saga } }) {
    return yield takeEvery(isModalShow(key), saga);
  });
}


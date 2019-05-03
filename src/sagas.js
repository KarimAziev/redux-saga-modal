// @flow
import {
  fork,
  apply,
  all,
  take,
  call,
  race,
  actionChannel,
} from 'redux-saga/effects';
import type { SagaRootConfig, RootModalSaga } from './flow-types';
import { getModalEffects } from './effects';

export default function* rootModalSaga(
  config: SagaRootConfig = {}
): RootModalSaga {
  const names = Object.keys(config);

  const tasks = yield all(
    names.map(name => {
      return fork(forkModal, name, config[name]);
    })
  );

  return tasks;
}

export function* forkModal(modalName, modalSaga) {
  const modal = getModalEffects(modalName);
  const showChan = yield actionChannel(modal.isShow());
  
  while (true) {
    const { payload } = yield take(showChan);
    yield call(callModal, modalName, modalSaga, payload);
  }
}

export function* callModal(modalName, modalSaga, ...args) {
  const modal = getModalEffects(modalName);

  const winner = yield race({
    task: apply(modal, modalSaga, args),
    hide: modal.takeHide(),
    destroy: modal.takeDestroy(),
  });
  if (winner.hide || winner.destroy) {
    return false;
  } else {
    const state = yield modal.select();
    if (state.isOpen) {
      yield modal.hide();
    }
    const task = winner.task || true;
    return yield task;
  }
}

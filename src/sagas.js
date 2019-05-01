// @flow
import {
  fork,
  put,
  all,
  take,
  call,
  setContext,
  race,
  getContext,
  actionChannel,
} from 'redux-saga/effects';
import { channel } from 'redux-saga';
import {
  destroyModal,
} from './actions';
import type {
  SagaRootConfig,
  RootModalSaga,
} from './flow-types';
import { getModalEffects } from './effects';

export default function* rootModalSaga(
  config: SagaRootConfig = {}
): RootModalSaga {
  const names = Object.keys(config);

  const tasks = yield all(
    names.map(name => {
      return fork(forker, name, config);
    })
  );

  return tasks;
}

function* forker(name, config) {
  const saga = config[name];
  const modalChan = yield call(channel);
  const modal = getModalEffects(name);
  const chan = yield actionChannel(modal.isShow());

  while (true) {
    const { payload } = yield take(chan);
    yield setContext({ [modal.name]: modal });

    const winner = yield race({
      task: call(modalTask, saga, name, payload, modalChan),
      destroy: take(modalChan),
    });

    if (winner.destroy) {
      yield modal.destroy();
    }
  }
}

function* modalTask(saga, name, payload = {}, modalChan) {
  const modal = yield getContext(name);
  const hideChan = yield actionChannel(modal.isHide());

  const task = yield fork([modal, saga], payload);

  while (true) {
    const { meta } = yield take(hideChan);

    if (meta.destroy) {
      yield put(modalChan, { 
        ...destroyModal(name),
        task: task, 
      });
    } else {
      return task;
    }
  }
}

export function* callModal(name, { props, onConfirm, onHide }) {
  const modal = getModalEffects(name);
  const state = yield modal.select();
  const isOpen = state ? state.isOpen : false;
  if (!isOpen) {
    yield modal.show(props);
  }

  yield setContext({ [modal.name]: modal });

  const { confirm } = yield race({
    confirm: modal.takeClick(),
    hide: modal.takeHide(),
  });
  if (!confirm) {
    const worker = onHide ? onHide : false;
    return yield worker;
  } else {
    return yield onConfirm || true;
  }
}

// export function* confirmModal(name, {
//   props,
//   onConfirm,
//   onHide,
// }) {

//   const modal = getModalEffects(name);
//   console.log('callModal modal', modal);
//   const state = yield modal.select();
//   const isOpen = state ? state.isOpen : false;
//   if (!isOpen) {
//     yield modal.show(props);
//   }
//   const { confirm, hide } = yield race({
//     confirm: modal.takeClick(),
//     hide: modal.takeHide(),
//   });
//   if (confirm) {
//     yield call(onConfirm);
//   }

// }

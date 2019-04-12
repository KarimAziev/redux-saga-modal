// @flow
import {
  fork,
  put,
  select,
  all,
  take,
  call,
  setContext,
  race,
  takeEvery,
  takeLatest,
  getContext,
  takeMaybe,
  actionChannel,
} from 'redux-saga/effects';
import { channel } from 'redux-saga';
import {
  updateModal,
  destroyModal,
  hideModal,
  clickModal,
  showModal,
} from './actions';
import type {
  SagaContext,
  SagaRootConfig,
  RootModalSaga,
  ModalName,
} from './flow-types';
import { modalSelector } from './selectors';
import is from './is';

export const createModal = (name: ModalName): SagaContext<ModalName> => ({
  name,
  show: (props) => put(showModal(name, props)),
  hide: (props) => put(hideModal(name, props)),
  destroy: () => put(destroyModal(name)),
  update: (props: any) => put(updateModal(name, props)),
  click: (props: any) => put(clickModal(name, props)),
  select: (customSelector) => select(modalSelector(name, customSelector)),
  
  is: {
    click: (pattern = () => true) => is.click(name, pattern),
    update: (pattern = () => true) => is.update(name, pattern),
    show: (pattern = () => true) => is.show(name, pattern),
    hide: () => is.hide(name),
    destroy: () => is.destroy(name),
  },

  call: (props, onConfirm, onHide) => call(callModal, name, props, onConfirm, onHide),

  takeShow: (pattern = () => true) => take(is.show(name, pattern)),
  takeClick: (pattern = () => true) => take(is.click(name, pattern)),
  takeHide: (pattern = () => true) => take(is.hide(name)),
  takeUpdate: (pattern = () => true) => take(is.update(name, pattern)),

  takeEveryClick: (pattern = () => true, func) =>
    takeEvery(is.click(name, pattern), func),
  takeLatestClick: (pattern = () => true, func) =>
    takeLatest(is.click(name, pattern), func),

  takeUpdate: (pattern = () => true) => take(is.update(name, pattern)),
  takeEveryUpdate: (pattern = () => true, func) =>
    takeEvery(is.update(name, pattern), func),
  takeLatestUpdate: (pattern = () => true, func) =>
    takeLatest(is.update(name, pattern), func),
});
export default function* rootModalSaga(
  config: SagaRootConfig = {}
): RootModalSaga {
  const names = Object.keys(config);

  const tasks = yield all(
    names.map((name) => {
      return fork(forker, name, config);
    })
  );

  return tasks;
}

function* forker(name, config) {
  const saga = config[name];
  const modalChan = yield call(channel);
  const modal = createModal(name);
  const chan = yield actionChannel(modal.is.show());
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
  const hideChan = yield actionChannel(modal.is.hide());

  const task = yield fork([modal, saga], payload);

  while (true) {
    const { meta } = yield take(hideChan);

    if (meta.destroy) {
      yield put(modalChan, { ...destroyModal(name), task: task });
    }
 else {
      return task;
    }
  }
}

export function* callModal(name, props, onConfirm, onHide) {
  const modal = createModal(name);
  const state = yield modal.select();
  const isOpen = state ? state.isOpen : false;
  if (!isOpen) {
    yield modal.show(props);
  }

  yield setContext({ [modal.name]: modal });

  const { confirm, hide } = yield race({
    confirm: modal.takeClick(),
    hide: modal.takeHide(),
  });

  if (!confirm) {
    return yield* onHide ? onHide(hide) : false;
  }

  return true;
}

export function* maybeHide(name) {
  const modal = yield getContext(name);
  const state = yield modal.select();
  const isOpen = state ? state.isOpen : false;
  if (isOpen) {
    yield modal.hide(name);
  }
}

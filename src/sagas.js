// @flow
import { fork, all, take, call, race } from 'redux-saga/effects';
import type { SagaRootConfig, RootModalSaga } from './flow-types';
import createModal from './createModal';
import * as is from '@redux-saga/is';
import * as defaults from './defaults';

export default function* rootModalSaga(
  config: SagaRootConfig = {}
): RootModalSaga {
  const names = Object.keys(config);
  const tasks = yield all(
    names.map(key =>
      fork(function*() {
        while (true) {
          const params = is.func(config[key])
            ? {
              task: config[key],
              name: key,
            }
            : config[key];

          const modal = createModal(key);
          const action = yield take(modal.pattern.show());
          yield call([{ modal }, modalSaga], {
            ...params,
            initProps: { ...params.initProps,
              ...action },
          });
        }
      })
    )
  );
  return tasks;
}

export function* modalSaga(...args) {
  const params = args.find(is.object) || {};
  const modal = params.modal || this && this.modal;
  const modalName = args.find(is.string) || params && params.name || modal && modal.name
  const modalContext = createModal(modalName);

  const task = args.find(is.func) || params.task;

  const config = {
    createCancelPattern: defaults.createCancelPattern,
    hideOnEnd: true,
    destroyOnHide: true,
    args,
    ...params,
  };

  const { createCancelPattern, hideOnEnd, onSuccess, initProps } = config;

  const cancelPattern =
        createCancelPattern && createCancelPattern(modalContext);

  const winner = yield race({
    task: call([modalContext, task], initProps),
    cancel: take(cancelPattern),
  });

  if (!winner.cancel && onSuccess) {

    const worker = is.effect(onSuccess)
      ? onSuccess
      : call([modalContext, onSuccess], winner.task);
    yield worker;
  }

  if (hideOnEnd) {
    yield call([modalContext, hider], { destroy: config.destroyOnHide });
  }

  return winner.cancel ? false : winner.task || !!winner.task;
}

export function* hider(params = { destroy: false }) {
  const modal = this;
  const state = yield modal.effect.select();

  if (state && state.isOpen) {
    yield modal.effect.hide();
  }

  if (state && params.destroy) {
    yield modal.effect.destroy();
  }
}

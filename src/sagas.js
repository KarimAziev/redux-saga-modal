// @flow
import {
  fork,
  all,
  take,
  call,
  race,
} from 'redux-saga/effects';
import type { SagaRootConfig, RootModalSaga } from './flow-types';
import { createModal } from './Modal';
import * as is from '@redux-saga/is';
import { check } from './utils';
import * as defaults from './defaults';

export default function* rootModalSaga(
  config: SagaRootConfig = {}
): RootModalSaga {
  const names = Object.keys(config);

  const tasks = yield all(
    names.map(name => {

      return fork([createModal(name), config[name]]);
    })
  );

  return tasks;
}

export function* callModal(modal, ...args) {
  check(modal, (val) => is.string(val) || is.object(val), 'first argument in callModal should be a string or an object!')

  const modalName = modal && modal.name || modal;

  check(modalName, (val) => is.string(val), 'name of the modal should be a string!')

  const modalContext = is.object(modal) ? modal : createModal(modalName);
  const params = args.find(is.object) || {};
  const task = args.find(is.func) || params.task;

  check(task, is.func, 'name passed to the callModal is not a function!');
  
  
  const config = {
    createCancelPattern: defaults.createCancelPattern,
    hideOnEnd: true,
    destroyOnHide: true,
    args,
    ...params,
  };

  const { createCancelPattern, hideOnEnd, onSuccess } = config;
  
  check(createCancelPattern, is.func, 'createCancelPattern should be a function which returns a pattern!')

  const cancelPattern = createCancelPattern && createCancelPattern(modalContext);
  

  const winner = yield race({
    task: call([modalContext, task], args),
    cancel: take(cancelPattern),
  });

  if (!winner.cancel && onSuccess) {
    const worker = is.effect(onSuccess) ? onSuccess : call([modalContext, onSuccess], winner.task);
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

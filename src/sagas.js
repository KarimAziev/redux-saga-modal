// @flow
import {
  fork,
  apply,
  all,
  take,
  call,
  race,
} from 'redux-saga/effects';
import type { SagaRootConfig, RootModalSaga } from './flow-types';
import { createModal } from './Modal';

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

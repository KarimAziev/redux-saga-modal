import { fork, all, take, race, call } from 'redux-saga/effects';
import { Saga } from 'redux-saga';
import createModal from './createModal';
import { ICreateModalParams } from './interface';

export default function* rootModalSaga(
  config: Record<string, Saga>,
  params: ICreateModalParams,
) {
  const names = Object.keys(config);
  // @ts-ignore
  const tasks = yield all(
    names.map((name) => {
      const saga = config[name];
      const modal = createModal(name, params);

      return fork(function*() {
        while (true) {
          const { payload } = yield take(modal.patterns.show);
          try {
            yield race({
              task: call([modal, saga], payload),
              cancel: modal.takeDestroy(),
            });
          } catch (error) {
            yield modal.destroy();
          }
        }
      });
    }),
  );

  return tasks;
}

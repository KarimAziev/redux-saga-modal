import { fork, all, take, race, call } from 'redux-saga/effects';
import createModal from './createModal';
import { isDev } from './utils';
import { ICreateModalParams } from './interface';

export default function* rootModalSaga(
  config = {},
  params: ICreateModalParams,
) {
  const names = Object.keys(config);
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
            if (isDev) {
              console.error(`Error catched in the modal task ${name}: `, error);
            }

            yield modal.destroy();
          }
        }
      });
    }),
  );

  return tasks;
}

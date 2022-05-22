import { fork, all, take, race, call } from 'redux-saga/effects';
import { Saga } from 'redux-saga';
import createModal from './createModal';
import { CreateModalParams } from './interface';

export default function* rootModalSaga(
  config: Record<string, Saga>,
  params: CreateModalParams,
) {
  const names = Object.keys(config);

  yield all(
    names.map((name: string) => {
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
}

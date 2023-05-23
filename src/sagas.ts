import { fork, all, take, race, call } from 'redux-saga/effects';
import createModal from './createModal';
import { CreateModalParams } from './interface';

/**
 * Saga routine for frequently repeated modals
 * @param config -  an object with modals names as keys and tasks as values.
 * @param params - required only if modals reducer mounted under other key than
   `modals`
 *
 * @example
 * ```ts
 * import { race, call, fork, all } from 'redux-saga/effects';
 * import {
 *   sagas as modalsSaga,
 *   SagaModalInstance,
 *   SagaModalAction,
 * } from 'redux-saga-modal';
 * import { saveCommentWorker } from './saveComment';
 *
 * const modalsTasks = {
 *   saveComment: saveCommentWorker,
 * };
 *
 * export default function* rootSaga() {
 *   yield all([fork(modalsSaga, modalsTasks)]);
 * }
 * ```
 */

export default function* rootModalSaga(
  config: Record<string, any>,
  params?: CreateModalParams,
) {
  const names = Object.keys(config);

  yield all(
    names.map((name: string) => {
      const saga = config[name];
      const modal = createModal(name, params);

      return fork(function* () {
        while (true) {
          const { payload } = yield take(modal.patterns.show());
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

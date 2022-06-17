import { fork, all, take, race, call } from 'redux-saga/effects';
import { Saga } from 'redux-saga';
import createModal from './createModal';
import { CreateModalParams } from './interface';

/**
 * Saga routine for frequently repeated modals
 * @param config -  an object with modals names as keys and tasks as values.
 * @param params - required only if modals reducer mounted under other key than `modals`
 *
 * @example
 * import { race, call, fork, all, getContext } from 'redux-saga/effects';
 * import { sagas as modalsSaga } from 'redux-saga-modal';
 * import { anotherModalSaga } from './sagas';
 *
 * const modalsTasks = {
 *   CONFIRM_MODAL: function* confirmModal(payload) {
 *     const { name, patterns, actions, selector, ...effects } = this;
 *
 *     const apiCall = getContext('api');
 *
 *     const winner = yield race({
 *       submit: effects.takeSubmit(),
 *       hide: effects.takeHide(),
 *     });
 *
 *     if (winner.submit) {
 *       yield effects.update({
 *         title: 'Saving',
 *         loading: true,
 *       });
 *       yield call(apiCall);
 *       yield effects.update({
 *         title: 'Changes saved',
 *         loading: false,
 *       });
 *     }
 *
 *     yield effects.destroy();
 *   },
 *   ANOTHER_MODAL: anotherModalSaga,
 * };
 *
 * function* rootSaga() {
 *   yield all([fork(modalsSaga, modalsTasks)]);
 * }
 */
export default function* rootModalSaga(
  config: Record<string, Saga>,
  params: CreateModalParams,
) {
  const names = Object.keys(config);

  yield all(
    names.map((name: string) => {
      const saga = config[name];
      const modal = createModal(name, params);

      return fork(function* () {
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

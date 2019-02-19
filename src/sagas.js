// @flow
import {
  fork,
  put,
  select,
  all,
  takeLeading,
  take,
  takeLatest,
  delay,
} from 'redux-saga/effects';
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
import is, { show as isShow, hide as isHide, destroy as isDestroy } from './is';
export const createModal = (name: ModalName): SagaContext<ModalName> => ({
  name,
  show: (props) => put(showModal(name, props)),
  hide: () => put(hideModal(name)),
  destroy: () => put(destroyModal(name)),
  update: (props: any) => put(updateModal(name, props)),
  click: (props: any) => put(clickModal(name, props)),
  select: (customSelector) => select(modalSelector(name, customSelector)),

  is: {
    click: (pattern = () => true) => is.click(name, pattern),
    show: (pattern = () => true) => is.show(name, pattern),
    hide: () => is.hide(name),
    destroy: () => is.destroy(name),
  },
});
export default function* rootModalSaga(
  config: SagaRootConfig = {}
): RootModalSaga {
  const names = Object.keys(config);

  const tasks = yield all(
    names.map((name) => {
      const sagaConfig = config[name];

      const call = takeLeading(isShow(name, () => true), caller, sagaConfig);

      return call;
    })
  );

  return tasks;
}

function* caller(sagaConfig, action) {
  const { name } = action.meta;
  const saga = sagaConfig.worker || sagaConfig;
  const sagaArgs = sagaConfig.args;
  const modal = createModal(name);
  const isCancellable = sagaConfig.cancellable !== false;
  const isDestroyOnHide = sagaConfig.destroyOnHide !== false;

  const [task, subtasks] = yield all([
    fork([modal, saga], sagaArgs),
    takeLatest(isHide(name), function*(params) {
      yield delay(500);
      const { isOpen } = yield modal.select();
      if (!isOpen && isCancellable) {
        if (!task.isCancelled()) {
          yield task.cancel();
        }
        return yield isDestroyOnHide && put(destroyModal(name));
      }
    }),
  ]);
  yield take(isDestroy(name));

  return task.result();
}

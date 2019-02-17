// @flow
import { fork, put, select, all, takeLatest, setContext } from 'redux-saga/effects';
import actionTypes from './actionTypes';
import { updateModal, destroyModal, hideModal, clickModal, showModal } from './actions';
import { checkActionType, checkModalName } from './lib';
import type { SagaContext, SagaConfig, RootModalSaga, ModalName } from './flow-types';
import { modalSelector } from './selectors';
export const createModal = (name: ModalName): SagaContext<ModalName> => ({
  name,
  show: () => put(showModal(name)),
  hide: () => put(hideModal(name)),
  destroy: () => put(destroyModal(name)),
  update: (props: any) => put(updateModal(name, props)),
  click: (props: any) => put(clickModal(name, props)),
  select: (customSelector) => select(modalSelector(name, customSelector)),
});
export default function* rootModalSaga(config: SagaConfig = {}): RootModalSaga {
  const names = Object.keys(config);

  const tasks = yield all(names.map(name => {
    const saga = config[name];
    
    const filters = action => 
      checkActionType([actionTypes.SHOW_MODAL, actionTypes.HIDE_MODAL, actionTypes.DESTROY_MODAL])(action) && 
      checkModalName(name)(action);

    
  
    return takeLatest(filters, function* forker (action) {
      const { type, payload } = action;
      if (type === actionTypes.HIDE_MODAL || type === actionTypes.DESTROY_MODAL) {
        return;
      }

      const context = createModal(name);
      yield setContext({ modal: context })
      yield fork([context, saga], payload);
    })
  }));
  
  return tasks;
}


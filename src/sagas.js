// @flow
import { fork, put, select, all, takeLatest, setContext } from 'redux-saga/effects';
import actionTypes from './actionTypes';
import { updateModal, hideModal, clickModal, showModal } from './actions';
import { checkActionType, checkModalName } from './lib';
import type { SagaContext, SagaConfig, RootModalSaga, ModalName } from './types';
import { modalSelector } from './selectors';
export const createModal = (name: ModalName): SagaContext<ModalName> => ({
  name,
  update: (props: any) => put(updateModal(name, props)),
  hide: () => put(hideModal(name)),
  click: (props: any) => put(clickModal(name, props)),
  show: () => put(showModal(name)),
  select: (customSelector) => select(modalSelector(name, customSelector)),
});
export default function* rootModalSaga(config: SagaConfig = {}): RootModalSaga {
  const names = Object.keys(config);

  const tasks = yield all(names.map(name => {
    const saga = config[name];
    
    const filters = action => 
      checkActionType([actionTypes.SHOW_MODAL, actionTypes.HIDE_MODAL])(action) && 
      checkModalName(name)(action);

    
  
    return takeLatest(filters, function* forker (action) {
      const { type, payload } = action;
      if (type === actionTypes.HIDE_MODAL) {
        return;
      }

      const context = createModal(name);
      yield setContext({ modal: context })
      yield fork([context, saga], payload);
    })
  }));
  
  return tasks;
}


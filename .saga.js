// @flow
import {
    fork,
    put,
    select,
    all,
    take,
    call,
    setContext,
    race,
    takeEvery,
    takeLatest,
    getContext,
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
  import is from './is';
  
  export const getModalEffects = (name: ModalName): SagaContext<ModalName> => ({
    name,
    show: (props) => put(showModal(name, props)),
    hide: () => put(hideModal(name)),
    destroy: () => put(destroyModal(name)),
    update: (props: any) => put(updateModal(name, props)),
    click: (props: any) => put(clickModal(name, props)),
    select: (customSelector) => select(modalSelector(name, customSelector)),
    call: (props, onConfirm, onHide) => call(callModal, name, props, onConfirm, onHide),
    is: {
      click: (pattern = () => true) => is.click(name, pattern),
      update: (pattern = () => true) => is.update(name, pattern),
      show: (pattern = () => true) => is.show(name, pattern),
      hide: () => is.hide(name),
      destroy: () => is.destroy(name),
    },
    takeConfirm: (pattern = () => true) => take(is.click(name, pattern)),
    takeClick: (pattern = () => true) => take(is.click(name, pattern)),
    takeHide: () => take(is.hide(name)),
  
    takeEveryClick: (pattern = () => true, func) =>
      takeEvery(is.click(name, pattern), func),
    takeLatestClick: (pattern = () => true, func) =>
      takeLatest(is.click(name, pattern), func),
  
    takeUpdate: (pattern = () => true) => take(is.update(name, pattern)),
    takeEveryUpdate: (pattern = () => true, func) =>
      takeEvery(is.update(name, pattern), func),
    takeLatestUpdate: (pattern = () => true, func) =>
      takeLatest(is.update(name, pattern), func),
  });
  export default function* rootModalSaga(
    config: SagaRootConfig = {}
  ): RootModalSaga {
    const names = Object.keys(config);
  
    const tasks = yield all(
      names.map((name) => {
        return fork(forker, name, config);
      })
    );
  
    return tasks;
  }
  
  function* forker(name, config) {
    const saga = config[name];
    const modal = getModalEffects(name);
  
    while (true) {
      const { payload } = yield take(modal.is.show());
      yield setContext({ [modal.name]: modal });
  
      yield race({
        task: call(modalTask, saga, name, payload),
        destroyAction: take(modal.is.destroy()),
      });
    }
  }
  
  function* modalTask(saga, name, payload = {}) {
    const modal = yield getContext(name);
  
    yield fork([modal, saga], payload);
  
    while (true) {
      yield take(modal.is.hide());
      yield modal.destroy();
    }
  }
  
  export function* callModal(
    name,
    props,
    onConfirm,
    onHide
  ) {
    const modal = getModalEffects(name);
    const state = yield modal.select();
    const isOpen = state ? state.isOpen : false;
    if (!isOpen) {
      console.log('isOpen', isOpen);
  
      yield modal.show(props);
    }
  
    yield setContext({ [modal.name]: modal });
  
    const { confirm, hide } = yield race({
      confirm: modal.takeClick(),
      hide: modal.takeHide(),
    });
  
    if (!confirm) {
      return yield* onHide ? onHide(hide) : false;
    }
    
    console.log('onConfirm', onConfirm);
    return true;
  }
  
  export function* maybeHide(name) {
    const modal = yield getContext(name);
    const state = yield modal.select();
    const isOpen = state ? state.isOpen : false;
    if (isOpen) {
      yield modal.hide(name);
    }
  }
  
  // function* emptySaga() {}
  
  // export function* withConfirmation(text, onConfirm, onCancel = emptySaga) {
  //   yield put({ type: 'ShowConfirmationDialog', payload: text });
  
  //   const { type } = yield take([
  //     'ConfirmationDialogConfirmed',
  //     'ConfirmationDialogCanceled'
  //   ]);
  
  //   switch (type) {
  //     case 'ConfirmationDialogConfirmed':
  //       yield* onConfirm();
  //       break;
  
  //     case 'ConfirmationDialogCanceled':
  //       yield* onCancel();
  //       break;
  
  //     default:
  //       throw `${type} - Missing impl`;
  //   }
  
  //   yield put({ type: 'HideConfirmationDialog' });
  // }
  
  // export function* requestDelete({ payload }) {
  //   const {
  //     id,
  //     firstName,
  //     lastName
  //   } = yield select(appState => appState.list.users.find(({ id }) => id === payload));
  
  //   yield* withConfirmation(`Are you sure that you want to delete ${firstName} ${lastName}?`, function*() {
  //     yield put({
  //       type: 'DeleteUser',
  //       payload: id
  //     });
  //   });
  // }
  
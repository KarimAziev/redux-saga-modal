import { sagas as modalSagas } from 'redux-saga-modal';
import { all, race, call, take, fork, delay } from 'redux-saga/effects';
import { hideModal, clickModal } from 'redux-saga-modal';
import api from 'api';

const modalSagasConfig = {
  'confirmModal': confirmModalWorker,
}

export default function* rootAppSaga() {
  yield all([
    fork(modalSagas, modalSagasConfig),
    //another app sagas
  ]);
}



function* confirmModalWorker() {
  const modal = this;
  const initProps = { 
    text: 'You are leaving without saving. Save changes?', 
    title: 'Save changes?',
    confirmBtn: {
      title: 'Save',
    },
    cancelBtn: {
      title: 'Close',
    },
  };
  
  yield modal.update(initProps);


  const click = yield race({
    ok: take(clickModal().type),
    hide: take(hideModal().type),
  })

  if (click.ok) {
    yield modal.update({ 
      title: 'Saving', 
      confirmBtn: {  
        ...initProps.confirmBtn, 
      
        disabled: true, 
        loading: true,
      }, 
    });
    yield call(api.save);
    yield modal.update({ title: 'Changes saved', confirmBtn: { loading: false } });
  }

  yield delay(1000);
  yield modal.hide();
}


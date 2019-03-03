import { sagas as modalSagas } from 'redux-saga-modal';
import {
  all,
  call,
  fork,
  cancelled,
} from 'redux-saga/effects';
import api from 'api';

export const MODAL_TYPES = {
  CONFIRM: 'ConfirmModal'
}

const modalSagasConfig = {
  [MODAL_TYPES.CONFIRM]: confirmModalWorker,
};

export default function* rootAppSaga() {
  yield all([
    fork(modalSagas, modalSagasConfig),
    //another app sagas
  ]);
}

const cancelledModalProps = {
  title: 'Api call was cancelled! You can retry it',
  confirmBtn: {
    disabled: false,
    loading: false,
    title: 'Save again',
  },
  cancelBtn: {
    disabled: false,
    loading: false,
    title: 'Close modal',
  },
};

function* confirmModalWorker() {

  const modal = this;

  yield modal.takeClick('OK');
  
  try {    
    const props = yield modal.select();
    
    yield modal.update({
      title: 'Saving',
      text: 'By clicking cancel you will see how modal performs cleanup',
      confirmBtn: {
        ...props.confirmBtn,
        disabled: true,
        loading: true,
      },
    });
    
    yield call(api.save);

    yield modal.update({
      title: 'Changes saved',
      confirmBtn: { loading: false },
    });

    yield modal.hide();
  } finally {
    if (yield cancelled()) {
      yield modal.show(cancelledModalProps);
    }
  }
}

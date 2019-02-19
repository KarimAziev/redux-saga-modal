import { sagas as modalSagas } from 'redux-saga-modal';
import {
  all,
  race,
  call,
  take,
  fork,
  delay,
  takeMaybe,
  takeEvery,
  cancelled,
} from 'redux-saga/effects';
import api from 'api';

const modalSagasConfig = {
  confirmModal: confirmModalWorker,
};

export default function* rootAppSaga() {
  const [modalsTasks] = yield all([
    fork(modalSagas, modalSagasConfig),
    //another app sagas
  ]);
}

function* confirmModalWorker() {
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
  const modal = this;

  try {
    yield modal.update(initProps);

    yield take(modal.is.click('OK'));

    yield modal.update({
      title: 'Saving',
      confirmBtn: {
        ...initProps.confirmBtn,

        disabled: true,
        loading: true,
      },
    });
    yield call(api.save);
    yield delay(1000);
    yield modal.update({
      title: 'Changes saved',
      confirmBtn: { loading: false },
    });

    yield modal.hide();
  } finally {
    if (yield cancelled()) {
      yield all([
        modal.show({
          title: 'Are you sure?',
          confirmBtn: {
            ...initProps.confirmBtn,
            disabled: false,
            loading: false,
          },
        }),
      ]);
    }
  }
}

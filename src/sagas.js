import { fork, all, take, race, call } from 'redux-saga/effects';
import createModal from './createModal';

export default function* rootModalSaga(config = {}) {
  const names = Object.keys(config);
  yield all(
    names.map(name => {
      const saga = config[name];
      const modal = createModal(name);
      return fork(function*() {
        while (true) {
          const { payload } = yield take(modal.pattern.show);
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
    })
  );
}

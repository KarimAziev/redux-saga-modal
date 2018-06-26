
# Redux Saga Modal (currently under development)

`redux-saga-modal` (currently under development)
will connect list of your modals to the redux store and invoke sagas when action showModal is dispatched.


## Usage
#Root-container
import { Modals } from 'redux-saga-modal';
import { SimpleModal, ConfirmModal } from 'components/Modals';

export default class App extends Component {
  render() {
    const {
      children,
    } = this.props;

  
    return (
    <div>
      {this.props.children}
      <Modals>
        <ConfirmModal 
          { ...initialProps.confirm }
          saga={confirmModalSaga}
          key={'confirm'} />
        <SimpleModal 
          {...initialProps.greeting}
          saga={greetingModalSaga}
          key={'greeting'} />
      </Modals>
    </div>
    );
  }
}

#Root-reducer
import cabinetReducer from './domains/cabinet';
import { modalReducer } from 'redux-saga-modal';

const appReducer = combineReducers({
  cabinet: cabinetReducer,
  modal: modalReducer,
});

#Root-saga
import { fork, all } from 'redux-saga/effects';
import { sagas as appSagas } from 'domains/app';
import { modalSagas } from 'redux-saga-modal';

export default function* () {
  
  yield all([
    fork(appSagas),
    fork(modalSagas),
  ]);
}

#After that you can manage modals with you sagas
import { modalUtils, modalsTypes, modalActions } from 'redux-saga-modal';
import types from 'domains/modal/types';

export function* confirmModalSaga(action) {
  while (true) {
    const resetModal = yield take(modalsTypes.RESET_MODAL);
    yield call(....)
  }
}

## License

MIT
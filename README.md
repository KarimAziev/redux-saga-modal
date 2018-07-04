# Redux Saga Modal (currently under development)

`redux-saga-modal` (currently under development)
will connect list of your modals to the redux store and invoke sagas when action showModal is dispatched.
## Install (currently only local)

git clone git@github.com:KarimAziev/redux-saga-modal.git && 
cd redux-saga-modal && 
yarn && 
yarn link

#In your app-directory 
yarn link redux-saga-modal && yarn

## Setup

```javascript
//in the root-container (already connected to store)
import { ConnectModal } from 'redux-saga-modal';
import { SimpleModal, ConfirmModal } from 'components/Modals';

export default class App extends Component {
  render() {
    const {
      children,
      modals,
    } = this.props;

    return (
      <div>
        {children}
        <ConnectModal
          {...this.props}
          dispatch={props.dispatch}
          reducer={modals}>
          <ConfirmModal
            { ...initialProps.confirm }
            saga={confirmModalSaga}
            key={'confirm'} />
          <SimpleModal
            {...initialProps.greeting}
            saga={greetingModalSaga}
            key={'greeting'} />
        </ConnectModal>
      </div>
    );
  }
}

//in the root-reducer
import cabinetReducer from './domains/cabinet';
import { reducer as modalReducer } from 'redux-saga-modal';

const appReducer = combineReducers({
  cabinetReducer: cabinetReducer,
  modalReducer: modalReducer,
});

//in the root-saga
import { fork, all } from 'redux-saga/effects';
import { sagas as appSagas } from 'domains/app';
import { sagas as modalSagas } from 'redux-saga-modal';

export default function* rootSaga() {
  yield all([
    fork(appSagas),
    fork(modalSagas),
  ]);
}

//After that you can manage modals with you sagas. They will be automatically invoken after dispatching action showModal
import { showModal } from 'redux-saga-modal';

export function* confirmModalSaga(action) {
  while (true) {
    const modalKey = yield getContext('key');
    const {
      takeModalClick,
      takeModalHide,
      showModal,
     } = yield getContext('utils');

    const click = yield race(
      ok: takeModalClick('OK'),
      cancel: takeModalClick('CANCEL'),
      hide: takeModalHide(modalKey)
    );

    if (hide) {
      yield put(showModal(modalKey, { text: 'Are you sure? '}));
      ...
    }
  }
}
```

## License

MIT

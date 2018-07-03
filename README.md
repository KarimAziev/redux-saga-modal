
# Redux Saga Modal (currently under development)

`redux-saga-modal` (currently under development)
will connect list of your modals to the redux store and invoke sagas when action showModal is dispatched.


## Setup

```javascript
//in the root-container
import { ConnectModal } from 'redux-saga-modal';
import { SimpleModal, ConfirmModal } from 'components/Modals';

export default class App extends Component {
  render() {
    const {
      children,
    } = this.props;

  
    return (
    <div>
      {this.props.children}
     <ConnectModal 
        {...props}
        dispatch={props.dispatch}
        reducer={modal}>
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
  cabinet: cabinetReducer,
  modal: modalReducer,
});

//in the root-saga
import { fork, all } from 'redux-saga/effects';
import { sagas as appSagas } from 'domains/app';
import { sagas as modalSagas } from 'redux-saga-modal'; 

export default function* () {
  yield all([
    fork(appSagas),
    fork(modalSagas),
  ]);
}

//After that you can manage modals with you sagas. They will be automatically invoken after dispatching action showModal
import { showModal } from 'redux-saga-modal';
import types from 'domains/modal/types';

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
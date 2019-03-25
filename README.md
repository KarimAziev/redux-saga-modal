# Redux Saga Modal

`redux-saga-modal` allows to manage your modals within [redux-saga](https://github.com/redux-saga/redux-saga) by passing a context to your saga and keeping modals's state in the redux store. Old docs [(v0.2)](https://github.com/KarimAziev/redux-saga-modal/blob/57d356d16510a25bb28dae48ebb90ec3b401a6bc/README.md)
and [(v0.3)](https://github.com/KarimAziev/redux-saga-modal/blob/6cef4e0ce37fe9be9b8573ec1812569d57508b3f/README.md)

## Installation
```bash
yarn add redux-saga-modal
```
## Usage
Wrap your modal component with `sagaModal`.  
```javascript
import { sagaModal } from 'redux-saga-modal'
import ConfirmModal from './ConfirmModal'

const MODAL_TYPES = {
  CONFIRM: 'ConfirmModal',
  GREETING: 'GreetingModal',
}

 const ConnectedModal = sagaModal({ 
   
   // an unique name for the modal 
  name: MODAL_TYPES.CONFIRM,
  initProps: {
    title: 'Save changes?',
    confirmBtn: { title: 'Save'},
    cancelBtn: {
      title: 'Cancel',
    },
  },
  // getModalsState - optional selector. Use it if your modals reducer's name is not "modals",
  getModalsState: state => state.myCustomModalReducer, 
})(ConfirmModal);
```

Pass the `reducer` to your store. It keeps the state of all modal components and should be named `modals` if you didn't pass a custom selector `getModalsState` to `sagaModal`.

```javascript
import { combineReducers } from 'redux';
import { reducer as modalsReducer } from 'redux-saga-modal';

export default combineReducers({
  // ...your other reducers
  modals: modalsReducer,
});
```
Create a config object with modals names as keys and sagas as values. Pass the config as argument to `sagas` and fork it in your rootSaga.

```javascript
import { fork, all } from 'redux-saga/effects'
import { sagas as modalsSagas } from 'redux-saga-modal'
import { confirmModalSaga, anotherModalSaga } from './sagas';


export const MODAL_TYPES = {
  CONFIRM: 'ConfirmModal',
  GREETING: 'GreetingModal',
}

 //key is a modal name and modal is a value
const modalSagasConfig = {
  [MODAL_TYPES.CONFIRM]: confirmModalWorker,
  [MODAL_TYPES.GREETING]: greetingModalWorker,
};

export default function* rootAppSaga() {
  yield all([
    fork(modalSagas, modalSagasConfig),
    //another app sagas
  ]);
}
```

From now your sagas will be forked every time after dispatching `showModal` and cancelled after `hideModal`. They will be invoked with `this` context providing some useful methods.  

```javascript
import {
  all,
  call,
  fork,
  cancelled,
  getContext,
} from 'redux-saga/effects';
import api from 'api';

function* confirmModalWorker() {
  //alternatively you can use getContext: 
  //const modal = getContext(modalTypes.CONFIRM)
  const modal = this; 
  const initProps = yield modal.select();
    
    yield modal.update({
      title: 'Are you sure want to exit without saving?',
      confirmBtn: {
        loading: false,
      },
    });
  
  try {    
    yield modal.takeClick('OK');
    yield call(api.save, initProps.changes);

    yield modal.update({
      title: 'Changes saved',
      confirmBtn: { loading: false },
    });

    yield modal.hide();
  } finally {
    if (yield cancelled()) {
      yield modal.show({ title: 'Or no, you have cancelled me!' });
    }
  }
}

```
## API
### Action creators:
**showModal(name: String, payload?: Object)**

Toggles on a modal visibility and forks it's task (if the previus one has been completed). 

**updateModal(name: String, payload?: Object)**

Updates a modal by **merging** payload with props in the reducer.

**clickModal(name: String, payload?: any)**

Useful for handling user actions, e.g. submitting, resetting. 

**hideModal(name: String)**

Toggles off a modal visibility. 

**destroyModal(name: String)**

Automatically fired after an action `hideModal`. Resets a modal reducer.

### Modal Context:
`redux-saga-modal` forks your tasks providing them a context which includes common modal effects and patterns, binded to a specific name of modal.    

Methods are available in your forked sagas in `this`. 
```javascript
function* confirmModalSaga() {
  const modal = this;
  const {
    name,
    show,  
    hide,
    destroy,
    update,
    click,
    takeClick,
    takeEveryClick,
    takeEvery,
    takeLatestClick,
    takeLatest,
    takeUpdate,
    takeEveryUpdate,
    takeLatestUpdate,
    takeLatest.
  } = modal;
}

```

**hide**()
Return a `put` effect Triggers an `hideModal(this.name)` 
The same as put from `redux-saga`
```javascript
const modal = this;

yield modal.hide();
//same as 
yield put(hideModal(modal.name))

```

## License

**MIT**

# Redux Saga Modal (0.3.0-beta.0)

`redux-saga-modal` allows to manage your modals within [redux-saga](https://github.com/redux-saga/redux-saga) by passing a context to your saga and keep modals's state in the redux store. Old [docs (version 0.2)](https://github.com/KarimAziev/redux-saga-modal/blob/57d356d16510a25bb28dae48ebb90ec3b401a6bc/README.md)

## Installation
```bash
npm i redux-saga-modal@^0.3.0-beta
```
## Usage
Pass the `modalReducer` to your store. It keeps the state of all your modal components.

```javascript
import { createStore, combineReducers } from 'redux'
import { reducer as modalReducer } from 'redux-saga-modal'

const rootReducer = combineReducers({
  // ...your other reducers
  // you have to pass modalReducer under 'modal' key,
  // for custom keys use 'getModalsState'
  modals: modalReducer
})

const store = createStore(rootReducer)

```
Create a config object with modals names as keys and sagas as values. Pass the config as argument to `modalsSaga` and fork it in your rootSaga.

```javascript
import { fork, all } from 'redux-saga/effects'
import { sagas as modalsSaga } from 'redux-saga-modal'
import { confirmModalSaga, anotherModalSaga } from './sagas';


 //key is a modal name and modal is a value
const modalsConfig = {
  'CONFIRM_MODAL': confirmModalSaga,
  'ANOTHER_MODAL': anotherModalSaga,
};

export default function* rootSaga() {
  yield all([
    fork(modalsSaga, modalsConfig),
  ]);
}
```
Wrap your modal component with `sagaModal`.  
```javascript
import { sagaModal } from 'redux-saga-modal'
import CustomModal from './ExampleModal'

const ConnectedModal = sagaModal({
  // an unique name for the modal 
  name: 'CONFIRM_MODAL', 
  // saga to forked
  // modals own init props
  initProps: { title: 'Hello' },
  // getModalsState - optional selector. Use it if your modals reducer's name is not "modals",
  getModalsState: state => state.myCustomModalReducer, 
 })(CustomModal);
```
From now your sagas will be called every time when action `showModal` has been dispatched and cancelled after `hideModal`. They will  receive the context includes methods `hide`, `update`, `click`, prop `name` and helper `takeClick`. It will also be passed to your component as a props.

```javascript
import { takeModalClick } from 'redux-saga-modal';
import { showModal } from 'redux-saga-modal';
import { race, call } from 'redux-saga/effects';
import api from '../api';

export function* confirmModalSaga(props) {
  while (true) {
   const click = yield race({
     //will take click with value 'SUBMIT'
      submit: this.takeClick('SUBMIT'), 
      //if takeClick receive function as an argument it will be called as a custom checker
      cancel: this.takeClick(value => value === 'CANCEL'),
    });

    if (click.submit) {
      yield this.update({ title: 'Saving', isLoading: true });
      yield call(api.save);
      yield this.update({ title: 'Changes saved', isLoading: false });
    }
    
    yield this.hide();
    yield put(showModal('ANOTHER_MODAL', { text: 'Goodbye'}));
  }
}
```
## API
### Action creators:
**showModal**(name, props)
* name  : string [required]
* props : object 

**hideModal**(name)
* name: string [required]

**clickModal**(name, value)
* name: string [required]
* value: string - a value of an item on the modal that have been clicked

**updateModal**(name, props) 
* name  : string [required]
* props : object 

### Context:

**hide**()

**update**(props) 
* props : object 

**click**(value) 
* value: string

**takeClick**(value)
* value: string | function 

## License

**MIT**

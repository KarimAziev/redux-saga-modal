# Redux Saga Modal

`redux-saga-modal` allows to manage your modals within redux-saga by passing a this context to your saga and keep modals's state in the redux store. 

## Installation
```bash
npm i redux-saga-modal
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
Add `modalsSaga` from `redux-saga-modal` to your root saga. 
> **NOTE**: You don't need to fork your modals sagas here, instead pass them as a prop to the `sagaModal` wrapper. 

```javascript
import { fork, all } from 'redux-saga/effects'
import { sagas as modalsSaga } from 'redux-saga-modal'

export default function* rootSaga() {
  yield all([
    //...another app sagas, don't fork here modals sagas, pass them to the sagaModal wrapper
    fork(modalsSaga),
  ]);
}
```
Wrap your modal component with `sagaModal`.  
```javascript
import { sagaModal } from 'redux-saga-modal'
import { exampleModalSaga } from '../sagas/modals'
import CustomModal from './ExampleModal'

const ConnectedModal = sagaModal({
  // a unique name for the modal 
  name: 'bootstrap', 
  // saga to forked
  saga: exampleModalSaga,
  // modals own init props
  initProps: { title: 'Hello' },
  // getModalsState - optional selector. Use it if your modals reducer's name is not "modals",
  getModalsState: state => state.myCustomModalReducer, 
 })(CustomModal);
```
From now you can manage your modals as within you sagas as within its component. Your saga function will fork with context, includes methods `show`, `hide`, `update`, `click`, and prop `name`. It will also be passed to your component as a props. Moreover you can use some helpers for saga.

```javascript
import { takeModalClick } from 'redux-saga-modal';
import { showModal } from 'redux-saga-modal';
import { race, call } from 'redux-saga/effects';
import api from '../api';

export function* exampleModalSaga(props) {
  this.show({ 
    text: 'You are leaving without saving', 
    title: 'Save changes?',
  })
  
  while (true) {
    const click = yield race({
      ok: takeModalClick(this.name, 'ok'),
      cancel: takeModalClick(this.name, 'cancel'),
    })

    if (click.ok) {
      this.update({ title: 'Saving', isLoading: true });
      yield call(api.save);
      this.update({ title: 'Changes saved', isLoading: true });
    }
    
    this.hide();
    yield put(showModal('ANOTHER_MODAL_NAME', { text: 'Goodbye'}));
  }
}
```
## API
### Action creators:
**showModal**(name, props)
* name  : String [required]
* props : Object 

**hideModal**(name)
* name: String [required]

**clickModal**(name, value)
* name: String [required]
* value: String - a value of an item on the modal that have been clicked

**updateModal**(name, props) 
* name  : String [required]
* props : Object 

### Context:
**show**() 

**hide**()

**update**(props) 
* props : Object 

**click**(value) 
* value: String [required]

### Saga helpers:
**takeModalShow**(name)
* name  : String [required]

**takeModalHide**(name)
* name  : String [required]

**takeModalClick**(name, value)
* name  : String [required]
* value : String [required]

**takeModalUpdate**(name)
* name  : String [required]
## License

**MIT**

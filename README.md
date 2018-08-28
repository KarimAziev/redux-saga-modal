# Redux Saga Modal

`redux-saga-modal` allows to manage your modals within redux-saga and keep its state in the redux store.

## Installation
```bash
npm i redux-saga-modal
```
## Usage
Pass the `modalReducer` to your store. It serves for all of your modals.

```javascript
import { createStore, combineReducers } from 'redux'
import { reducer as modalReducer } from 'redux-saga-modal'

const rootReducer = combineReducers({
  // ...your other reducers
  // you have to pass formReducer under 'modal' key,
  // for custom keys use 'getModalState'
  modals: formReducer
})

const store = createStore(rootReducer)
```
Add `modalsSaga` from `redux-saga-modal` to your root saga. 
**NOTE**: You don't need to fork your modals sagas here, instead pass them as a prop to the `sagaModal` wrapper. 

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
  initProps: { title: 'Hello' }
 })(CustomModal);
```
From now you can manage modals as within you sagas as within your connected component. As a first argument your saga will receive object with methods `show`, `hide`, `update`, `click`, and props `name`, `isOpen`. These methods will also passed to your component as a props. You can also use some helpers for saga.

```javascript
import { takeModalClick } from 'redux-saga-modal';
import { showModal } from 'redux-saga-modal';
import { race, call } from 'redux-saga/effects';
import api from '../api';
//first argument is object with methods (already connected to store)
export function* exampleModalSaga(modal) {
  modal.show({ 
    text: 'You are leaving without saving', 
    title: 'Save changes?',
  })
  
  while (true) {
    const click = yield race({
      ok: takeModalClick(modal.name, 'ok'),
      cancel: takeModalClick(modal.name, 'cancel'),
    })

    if (click.ok) {
      modal.update({ title: 'Saving', isLoading: true });
      yield call(api.save);
      modal.update({ title: 'Changes saved', isLoading: true });
    }
    
    modal.hide();
    yield put(showModal, 'ANOTHER_MODAL_NAME');
  }
}
```
## API
#### Action creators:
* showModal(modalName, modalProps)
* hideModal(modalName)
* clickModal(modalName, clickedValue)
* updateModal(modalName, modalProps)
#### Modal methods:
* show(modalName)
* hide()
* update(modalName, modalProps) 
* click(clickedValue) 
#### Saga helpers:
* takeModalShow(modalName)
* takeModalHide(modalName)
* takeModalClick(modalName, modalValue)
* takeModalUpdate(modalName)

## License

MIT

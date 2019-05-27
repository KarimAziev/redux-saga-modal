# Redux Saga Modal

`redux-saga-modal` provides some helpers and high-level API of [redux-saga](https://github.com/redux-saga/redux-saga) effects.

## Installation
```bash
npm i redux-saga-modal
```
Or
```bash
yarn add redux-saga-modal
```

## Usage


```javascript

import { createModal } from 'redux-saga-modal';
import { call, put, take, race } from 'redux-saga/effects';
import * as routines from 'routines';
import api from 'api';

function* confirmModal(initProps) {
  const modal = createModal('CONFIRM_MODAL');

  yield modal.show(initProps);

  const winner = yield race({
    submit: modal.takeSubmit(),
    hide: modal.takeHide(),
  });

  if (winner.submit) {
    yield modal.hide();
    return true;
  } else {
    return false;
  }
}

export function* removeUserSaga() {
  while (true) {
    const { payload: userId } = yield take(
      routines.removeUser.TRIGGER
    );
    const isConfirmed = yield call(confirmModal, {
      text: 'Are you sure want to remove this user?',
    });
    
    if (!isConfirmed) {
      continue;
    }

    yield call(remove, userId);
  }
}

```
Connect your modal component with `sagaModal`.  
```javascript
import { sagaModal } from 'redux-saga-modal';
import ReactModal from "react-modal";

const Modal = ({
  modal: {
    name,
  },
  show,
  update,
  destroy, 
  click,
  submit, 
  hide,
  showModal,
  ...ownProps,  
  }) => (
    <ReactModal isOpen={isOpen}>
      <div onClick={() => click('CUSTOM_VALUE')}>{ownProps.text}</div>
      <button onClick={() => showModal('ANOTHER_MODAL')}>
        Show another modal
      </button>
      <button onClick={() => hide()}>Cancel</button>
      <button onClick={() => submit()}>Ok</button>
    </ReactModal>
)

const ConnectedModal = sagaModal({
  // an unique name for the modal 
  name: 'CONFIRM_MODAL',
  initProps: {
    text: 'Init text',
  },
 })(Modal);

```
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
## Action creators:
**showModal**(name, props)
* name  : string [required]
* props : object 

**updateModal**(name, payload) 
  merges payload with props in the modal state
* name  : string [required]
* props : object 

**submitModal**(name, props) 
* name  : string [required]
* props : any 

**clickModal**(name, value)
* name: string [required]
* value: any

**hideModal**(name)
* name: string [required]

**destroyModal**(name) 
* name  : string [required]

## Helpers
To create a minimal set of helpers without high-level effects use `createModalHelpers`. 
To create as high-level effects, as helpers use `createModal`. 

```javascript
   import { createModalHelpers } from 'redux-saga-modal';
   import { createModal } from 'redux-saga-modal';
   
   const {
     patterns,
     actions,
     selector,
     name,
   } = createModalHelpers('CONFIRM_MODAL');
```

### Patterns:

A collection of patterns for filtering modal actions inside `redux-saga` take effects, such as `take`, `takeLatest`, `takeEvery` etc. Every of pattern accepts optional argument for checking payload.
Payload pattern can be a string, undefined, an array or a function.

  * show
  * click
  * submit
  * update
  * hide
  * destroy

```javascript
//matches an action showModal with name 'CONFIRM_MODAL' and any payload
yield take(patterns.show);


//matches showModal with name CONFIRM_MODAL only if it has property text
yield take(patterns.show((payload) => payload.text));

//If payload pattern is a String, the action is matched if payload === pattern
//matches submitModal with name CONFIRM_MODAL only if payload equals CUSTOM_VALUE
yield take(patterns.submit('CUSTOM_VALUE');


//will take an action submitModal with name CONFIRM_MODAL if any of the payload patterns in the array matches
yield take(patterns.submit(['CUSTOM_VALUE', (payload) => payload.text)]);

```

### Actions: 
The same as action creators but bound with a name of modal. 
  * show
  * click
  * submit
  * update
  * hide
  * destroy

  
### Selector

```javascript
   import { createModal } from 'redux-saga-modal';
   
   const {
     patterns,
     actions,
     selector,
     name,
   } = createModal('CONFIRM_MODAL');
   
   const state = yield select(selector);

```

### Put effects:

**show**(payload) 
* payload : object

**update**(payload) 
* payload : object 

**submit**(payload)
* payload: any

**click**(payload) 
* payload: any

**hide**()
**destroy**()

### Take effects:
All take effects accepts optional payload for waiting an action which matches not only actionType and name, but also payload payload. 
 
**takeClick**
**takeDestroy**
**takeHide**
**takeShow**:
**takeSubmit**: 
**takeUpdate**: 

## License

**MIT**

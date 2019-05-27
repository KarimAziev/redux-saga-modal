# Redux Saga Modal

[![](https://img.shields.io/npm/v/redux-saga-modal.svg)](https://www.npmjs.com/package/redux-saga-modal)
[![](https://img.shields.io/npm/dt/redux-saga-modal.svg)](https://www.npmjs.com/package/redux-saga-modal)

`redux-saga-modal` provides some helpers and high-level API of [redux-saga](https://github.com/redux-saga/redux-saga) effects.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Helpers and effects](#Helpers-and-effects) 
- [API](#api)
  - [patterns](#patterns)
  - [effects](#effects)
  - [actions](#actions)
  - [Actions creators](#actions-creators)
   
  
  

## Installation
```bash
npm i redux-saga-modal
```
Or
```bash
yarn add redux-saga-modal
```

## Usage

Pass the `reducer` to your store. It keeps the state of all your modal components, so you only have to pass it once.

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
Wrap your modal component with `sagaModal`. It provides the modal state, bound to it's name actions `show`, `update`, `submit`, `click`, `hide`, `destroy` and unbound `showModal`, `updateModal`, `submitModal`, `clickModal`, `hideModal` and `destroyModal` to trigger or handle another modals. 

```javascript
import { sagaModal } from 'redux-saga-modal';
import ReactModal from "react-modal";

const Modal = ({
  modal: {
    name,
  },
  isOpen,
  show,
  update,
  destroy, 
  click,
  submit, 
  hide,
  showModal,
  updateModal,
  submitModal,
  clickModal,
  hideModal,
  destroyModal,
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

export default sagaModal({
  // an unique name for the modal 
  name: 'CONFIRM_MODAL',
 })(Modal);

```
Now you can use `createModal`, which contains helpers and effects to manage the modal.

```javascript

import { createModal } from 'redux-saga-modal';
import { call, put, take, race } from 'redux-saga/effects';
import * as routines from 'routines';
import api from 'api';

function* confirmModal(initProps) {
  const {
     name,
     patterns,
     actions,
     selector,
     ...effects
   } = createModal('CONFIRM_MODAL');

  yield effects.modal.show(initProps);

  const winner = yield race({
    submit: effects.modal.takeSubmit(),
    hide: effects.modal.takeHide(),
  });

  if (winner.submit) {
    yield effects.modal.hide();
    return true;
  } 

  return false;
}

export function* removeUser() {
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
For frequently repeated modals tasks create a config object with modals names as keys and tasks as values. Pass the config as argument to `sagas` and fork it in your rootSaga.

Yout tasks will be fired on action `showModal` with it's name and **cancelled** on destroyModal.   

 ```javascript
 import { fork, all, getContext } from 'redux-saga/effects'
 import { sagas as modalsSaga } from 'redux-saga-modal'
 import { anotherModalSaga } from './sagas';
 
   export default function* rootSaga() {
    yield all([
      fork(modalsSaga, modalsConfig),
    ]);
  }

   //key is a modal name and modal is a value
   const modalsConfig = {
     'CONFIRM_MODAL': function* confirmModal(payload) {
    const {
       name,
       patterns,
       actions,
       selector,
       ...effects
     } = this;
    
    const apiCall = getContext('api');
    
    const winner = yield race({
      submit: effects.modal.takeSubmit(),
      hide: effects.modal.takeHide(),
    });
  
   if (winner.submit) {
      yield effects.update({ title: 'Saving', isLoading: true });
      yield call(apiCall);
      yield effects.update({ title: 'Changes saved', isLoading: false });
    } 
  
    yield effects.destroy();
   }  ,
    'ANOTHER_MODAL': anotherModalSaga,
   };
 

```
## Helpers and effects
 Methods of helpers (actions, patterns) and effects have the same names `show`, `update`, `submit`, `click`, `hide`, `destroy`. Patterns is used inside `take`, `takeEvery` and etc for matching action.

```javascript
   import { createModalHelpers, createModal, showModal } from 'redux-saga-modal';
   
   const {
     patterns,
     actions,
     selector,
     name,
   } = createModalHelpers('CONFIRM_MODAL');

  const {
     patterns,
     actions,
     selector,
     name,
     ...effects
   } = createModal('CONFIRM_MODAL');

      //all of them will put the same action
   yield effects.show({ text: 'Some text' }});
   yield put(actions.show({ text: 'Some text' }}));
   yield put(showModal('CONFIRM_MODAL', { text: 'Some text' }}));
   

  //all of them will wait for the same action

   yield effects.takeClick('value');
   yield take(patterns.click('value'));
   yield take(action => action.type === clickModal().type && 
                      action.meta.name === 'CONFIRM_MODAL' &&
                      action.payload === 'value'
  );
```

To get both helpers and effects use `createModal`. 
To create a minimal set of helpers without high-level API use `createModalHelpers`. 


## API

### Patterns:
  * show
  * click
  * submit
  * update
  * hide
  * destroy

A collection of patterns for filtering modal actions inside `redux-saga` take effects, such as `take`, `takeLatest`, `takeEvery` etc. Every of pattern accepts optional argument for checking payload.
Payload pattern can be a string, undefined, an array or a function.


```javascript
import { createModal } from 'redux-saga-modal';
  const {
     patterns,
     actions,
     selector,
     name,
     ...effects
   } = createModal('CONFIRM_MODAL');

//matches an action showModal with name 'CONFIRM_MODAL' and any payload
yield take(patterns.show);


//matches showModal with name CONFIRM_MODAL only if it has property text
yield take(patterns.show((payload) => payload.text));

//If payload pattern is a String, the action is matched if payload === pattern
//matches submitModal with name CONFIRM_MODAL only if payload equals CUSTOM_VALUE
yield take(patterns.submit('CUSTOM_VALUE'));


//will take an action submitModal with name CONFIRM_MODAL if any of the payload patterns in the array matches
yield take(patterns.submit(['CUSTOM_VALUE', (payload) => payload.text)]);
```

### Actions: 
The same as [actions creators](#actions-creators) actions creators but bound with a name of modal. 

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

### Selectors
```javascript
   import { createModal } from 'redux-saga-modal';
   
   const {
     patterns,
     actions,
     selector,
     name,
     ...effects
   } = createModal('CONFIRM_MODAL');
   
   // the same
   yield select(selector);
   yield effects.select();

```

### Effects

Effects includes put effects and take effects. All take effects accepts optional payload for waiting an action which matches not only actionType and name, but also payload.

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

**takeClick**(payloadPattern)
* payloadPattern: String | Array | Function

**takeShow**(payload)
* payloadPattern: String | Array | Function

**takeSubmit**(payload)
* payloadPattern: String | Array | Function

**takeUpdate**(payload)
* payloadPattern: String | Array | Function

**takeHide**(payload)

**takeDestroy**(payload)


### Actions creators

**showModal**(name, payload = {})
* name  : string [required]
* payload : object 
```javascript
{
    type: String,
    payload: Object,
    meta: {
      name: String,
    }
  }
  ```
**updateModal**(name, payload = {}) 
  merges payload with props in the modal state. 
* name  : string [required]
* payload : object [required]
```javascript
{
    type: String,
    payload: Object,
    meta: {
      name: String,
    }
  }
  ```

**submitModal**(name, payload) 
* name  : string [required]
* payload : any 
```javascript
{
    type: String,
    payload: any,
    meta: {
      name: String,
    }
  }
  ```
**clickModal**(name, payload)
* name: string [required]
* payload: any
```javascript
{
    type: String,
    payload: any,
    meta: {
      name: String,
    }
  }
  ```

**hideModal**(name)
* name: string [required]

```javascript
{
    type: String,
    meta: {
      name: String,
    }
  }

  ```

**destroyModal**(name) 
* name  : string [required]
```javascript
{
    type: String,
    meta: {
      name: String,
    }
  }
  ```

## License

**MIT**

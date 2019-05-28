# Redux-Saga-Modal

[![](https://img.shields.io/npm/v/redux-saga-modal.svg)](https://www.npmjs.com/package/redux-saga-modal)
[![](https://img.shields.io/npm/dt/redux-saga-modal.svg)](https://www.npmjs.com/package/redux-saga-modal)

`redux-saga-modal` provides interface with effects, patterns and actions for [redux-saga](https://github.com/redux-saga/redux-saga) effects.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [Modal Interface](#Modal-Interface) 
    - [patterns](#patterns)
    - [effects](#effects)
    - [actions](#actions)
    - [selectors](#selectors)  
  - [Actions creators](#actions-creators)
  - [createModal](#createModal)
  - [createModalHelpers](#createModalEffects)
  - [sagas](#sagas)
  - [sagaModal](#sagaModal)
  - [reducer](#reducer)
   
  
  

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
Now you can use `createModal`, which contains [actions](#actions), [patterns](#patterns) and [effects](#effects) to manage the modal.

```javascript
import { createModal } from 'redux-saga-modal';
import { race } from 'redux-saga/effects';

function* confirmModal(initProps) {
  const { 
    name, 
    patterns, 
    actions, 
    selector, 
    ...effects
  } = createModal('CONFIRM_MODAL');
  
  yield effects.show(initProps);

  const winner = yield race({
    submit: effects.takeSubmit(),
    hide: effects.takeHide(),
  });

  if (winner.submit) {
    yield effects.hide();
    return true;
  }
  yield effects.destroy();
  return false;
}
```
For frequently repeated modals tasks create a config object with modals names as keys and tasks as values. Pass the config as argument to `sagas` and fork it in your rootSaga.

Yout tasks will be fired on action `showModal` with it's name and **cancelled** on destroyModal.   

 ```javascript
import { race, call, fork, all, getContext } from 'redux-saga/effects';
import { sagas as modalsSaga } from 'redux-saga-modal';
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
      submit: effects.takeSubmit(),
      hide: effects.takeHide(),
    });

    if (winner.submit) {
      yield effects.update({ 
        title: 'Saving', 
        loading: true, 
      });
      yield call(apiCall);
      yield effects.update({ 
        title: 'Changes saved',
        loading: false, 
      });
    } 

    yield effects.destroy();
  },
  'ANOTHER_MODAL': anotherModalSaga,
};


```

## API

## Modal Interface
 Created by [createModal](#createModal). Includes [actions](#actions), [patterns](#patterns) and [effects](#effects) are named `show`, `update`, `submit`, `click`, `hide`, `destroy`. Patterns is used inside `take`, `takeEvery` and etc for matching action.

 To create a minimal set of helpers without effects use [createModalHelpers](#createModalHelpers). 
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

**select**()

**takeClick**(payloadPattern)
* payloadPattern: String | Array | Function

**takeShow**(payloadPattern)
* payloadPattern: String | Array | Function

**takeSubmit**(payloadPattern)
* payloadPattern: String | Array | Function

**takeUpdate**(payloadPattern)
* payloadPattern: String | Array | Function

**takeHide**(payloadPattern)

**takeDestroy**(payloadPattern)


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

  Hides modal and doesn't destroy it's props in the state.

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
 
  Hides modal and destroy it's props in the state.

```javascript
{
    type: String,
    meta: {
      name: String,
    }
  }
  ```

 ### createModal 

 Created interface with  [actions](#actions), [patterns](#patterns), [effects](#effects), name and selector. 
 
 Arguments:
 * name: String[required]  
 * Config: 
   * name: *Required* String - name of the modal;
   * getModalsState: Function - use it if you pass reducer under name different then `modals`. Default `state => state.modals`;

```javascript
import { createModal } from 'redux-saga-modal';
  
  const {
     patterns,
     actions,
     selector,
     name,
     ...effects
   } = createModal('CONFIRM_MODAL');
```
 ### createModalHelpers
 
  Created interface with methods [actions](#actions), [patterns](#patterns), selector and name. 
   
  Arguments:
  * name: String[required]  
  * Config: 
    * name: *Required* String - name of the modal;
    * getModalsState: Function - use it if you pass reducer under name different then `modals`. Default `state => state.modals`;

```javascript
    import { createModalHelpers } from 'redux-saga-modal';
   
   const {
     patterns,
     actions,
     selector,
     name,
   } = createModalHelpers('CONFIRM_MODAL');
```

 ### sagas
 Calls your sagas it with modal context when action `showModal` dispatches with it's name. Config must be an object with keys as modals names and value as its sagas.
   
   **sagas**(config: {
     [String]: Generator,
   }) 


 ### sagaModal

 **sagaModal**(config: Object)(component: React.Component)
 
 Config: 
 * name: *Required* String - name of the modal;
 * getModalsState: Function - use it if you pass reducer under name different then `modals`. Default `state => state.modals`;
 * initProps: Object - init props that will be passed to component;
 * actions: Object - custom actions to bind them with dispatch;
 * destroyOnHide: Boolean - Whether automatically dispatch `destroy` to after `hide`. Default `true`;
 * keepComponentOnHide: Boolean - Whether keep component when `isOpen` equals `false`. Default `false`;
  

  A HOC which connects you react component and injects props: 
  * modal: {
      name
    }
  * isOpen
  * show
  * update
  * destroy
  * click
  * submit
  * hide
  * showModal
  * updateModal
  * submitModal
  * clickModal
  * hideModal
  * destroyModal

 ### reducer

 The modals reducer keeps state of the all modals. Should be mounted to redux store under name `modals` or any other but in this case you need to pass selector `getModalsState` to `sagaModal`.

## License

**MIT**

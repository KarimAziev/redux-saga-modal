# Redux-Saga-Modal

[![](https://img.shields.io/npm/v/redux-saga-modal.svg)](https://www.npmjs.com/package/redux-saga-modal)
[![](https://img.shields.io/npm/dt/redux-saga-modal.svg)](https://www.npmjs.com/package/redux-saga-modal)

`redux-saga-modal` provides interface with effects, patterns and actions for [redux-saga](https://github.com/redux-saga/redux-saga) effects.

[Live Demo](https://codesandbox.io/s/reduxsagamodalexample-jzxve?fontsize=14) 

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Actions Creators](#Actions-Creators)
- [Effects Creators](#Effects-Creators)
- [Patterns Creators](#Patterns-Creators)
- [createModal](#createModal)
- [createModalHelpers](#createModalHelpers)
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

Now you can use `createModal`, which contains [Actions Creators](#Actions-Creators), [Patterns Creators](#Patterns-Creators) and [Effects Creators](#Effects-Creators) to manage the modal.


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

### Actions Creators

#### Scoped actions creators

Created with `createModalActions`, `createModal` and `createModalHelpers` by passing them a modal's name. `createModal` and `createModalHelpers` locates them in the property `actions`.

| Name            |        Arguments                  |               Description                                     |
|---------------- |---------------------------------- |-------------------------------------------------------------- |
| show            | (payload = Object)                | Triggers to show a modal and sets payload as it's props       |
| update          | (payload = Object)                | Updates the modal by merging payload with it's current props  |
| submit          | (payload = any)                   | Triggers that a target's button was pressed                   |
| click           | (payload = any)                   | A trigger for handling any click on modal                     |
| hide            | ()                                | Hide modal without destroying it's state in the redux store   |
| destroy         | ()                                | Close a modal by destroying it's props                        |

#### Basic Actions

| Name            |        Arguments                  |              Description                                      |
|---------------- |---------------------------------- |-------------------------------------------------------------- |
| showModal       | (name: String, payload = Object)  | Triggers to show a modal and sets payload as it's props       |
| updateModal     | (name: String, payload = Object)  | Updates the modal by merging payload with it's current props  |
| submitModal     | (name: String, payload = any)     | Triggers that a target's button was pressed                   |
| clickModal      | (name: String, payload = any)     | A trigger for handling any click on modal                     |
| hideModal       | (name: String)                    | Hide modal without destroying it's state in the redux store   |
| destroyModal    | (name: String)                    | Close a modal by destroying it's props                        |

**Example**

```javascript
import { createModal, createModalActions, showModal } from 'redux-saga-modal';

  const modal = createModal('CONFIRM_MODAL');  
  yield put(modal.actions.show({ title: 'Some title'}));

  //or
  const confirmActions = createModalActions('CONFIRM_MODAL');
  yield put(confirmActions.show({ title: 'Some title'} );

  //or
  yield put(showModal('CONFIRM_MODAL', { title: 'Some title'} );

```

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

### Effects Creators

Produced with `createModal`. Returns scoped `put`, `select` and `take` effects.

Payload pattern in the `take` effects have the same meaning and rules as in's the [redux-saga](https://redux-saga.js.org/docs/api/#takepattern), but applies not for whole action but only to it's payload.


| Name 	            | Arguments         	| Effect 	|                                                              	|
|-----------------  |------------------- |-------- |--------------------------------------------------------------|
| show              | (payload: Object)  | put     | Triggers to show a modal and sets payload as it's props      |
| update            | (payload: Object)  | put     | Updates the modal by merging payload with it's current props |
| submit            | (payload: any)     | put     | Triggers that a target's button was pressed                  |
| click             | (payload: any)     | put     | A trigger for handling any click on modal                    |
| hide              | (name: String)     | put     | Hide modal without destroying it's state in the redux store  |
| destroy           | (name: String)     | put     | Close a modal by destroying it's props                       |
| select            | (name: String)    	| select  | Select a modal state from the Redux Store                     |
| takeShow          | (?payloadPattern: String \| Function \| Array \| '*' ) | take    | Returns a `take` effect for an action `showModal` with scoped name. Accepts optional pattern for payload
| takeUpdate        | (?payloadPattern: String \| Function \| Array \| '*') | take    | Returns a `take` effect for an action `updateModal` with scoped name. Accepts optional pattern for payload
| takeSubmit        | (?payloadPattern: String \| Function \| Array \| '*')   | take    | Returns a `take` effect for an action `sumitModal` with scoped name. Accepts optional pattern for payload
| takeClick         | (?payloadPattern: String \| Function \| Array \| '*')   | take    | Returns a `take` effect for an action `clickModal` with scoped name. Accepts optional pattern for payload
| takeHide          |                    | take    | Returns a `take` effect for an action `hideModal` with scoped name
| takeDestroy       |                  | take    | Returns a `take` effect for an action `destroyModal` with scoped name

**Example**

```javascript
   import { createModal } from 'redux-saga-modal';

  const {
     name,
     ...effects
   } = createModal('CONFIRM_MODAL');
  
   //result: put(showModal('CONFIRM_MODAL', ({ text: 'Some text' }))
   yield effects.show({ text: 'Some text' }}); 


   //result: take(action => action.type === clickModal().type && action.meta.name === 'CONFIRM_MODAL' && payload === 'value' 
   yield effects.takeClick('value');

  //result: take(action => action.type === clickModal().type && action.meta.name === 'CONFIRM_MODAL' && payload && payload.text === 'Some text'
   yield effects.takeClick(payload => payload && payload.text === 'Some text');
  //result: take(action => action.type === clickModal().type && action.meta.name === 'CONFIRM_MODAL'
   yield effects.takeClick();
  );
```

### Patterns Creators

A collection of patterns for filtering modal actions inside `redux-saga` take effects, such as `take`, `takeLatest`, `takeEvery` etc. Every of pattern accepts optional argument for checking payload.

Payload pattern have the same meaning and rules as in's the [redux-saga](https://redux-saga.js.org/docs/api/#takepattern), but applies not for whole action but only to it's payload.

| Name            |        Arguments                                    |               Description                                     |
|---------------- |-----------------------------------------------------|-------------------------------------------------------------- |
| show            | ?payloadPattern: String \| Function \| Array \| '*' | Triggers to show a modal and sets payload as it's props       |
| update          | ?payloadPattern: String \| Function \| Array \| '*' | Updates the modal by merging payload with it's current props  |
| submit          | ?payloadPattern: String \| Function \| Array \| '*' | Triggers that a target's button was pressed                   |
| click           | ?payloadPattern: String \| Function \| Array \| '*' | A trigger for handling any click on modal                     |
| hide            |                                                     | Hide modal without destroying it's state in the redux store   |
| destroy         |                                                     | Close a modal by destroying it's props                        |


**Example**

```javascript
   import { createModal } from 'redux-saga-modal';

  const {
     patterns,
   } = createModal('CONFIRM_MODAL');
  

   //result: take(action => action.type === clickModal().type && action.meta.name === 'CONFIRM_MODAL' && payload === 'value'
   yield take(patterns.click(payload === 'value'));

  //result: take(action => action.type === clickModal().type && action.meta.name === 'CONFIRM_MODAL' && payload && payload.text === 'Some text'
   yield take(patterns.show((payload => payload && payload.text === 'Some text')));
  
  //result: take(action => action.type === clickModal().type && action.meta.name === 'CONFIRM_MODAL'
   yield take(patterns.click);
  );
```

## createModal

 Creates a model with  [Actions Creators](#Actions-Creators), [Patterns Creators](#Patterns-Creators), [Effects Creators](#Effects-Creators), name and selector. 

 **Arguments**

- **name**(String)(Require) the name of a modal
- **config**(Object)
  - **getModalState** (Function) A selector that takes the Redux store and returns the slice which corresponds to where the redux-saga-modal `reducer` was mounted. By default reducer is mounted under the 'modals' key.

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

## createModalHelpers

Created a model with methods [Actions Creators](#Actions-Creators), [Patterns Creators](#Patterns-Creators), selector and name.  

**Arguments**

- **name**(String)(Require) the name of a modal
- **config**(Object)
  - **getModalState** (Function) A selector that takes the Redux store and returns the slice which corresponds to where the redux-saga-modal `reducer` was mounted. By default reducer is mounted under the 'modals' key.

```javascript
    import { createModalHelpers } from 'redux-saga-modal';

   const {
     patterns,
     actions,
     selector,
     name,
   } = createModalHelpers('CONFIRM_MODAL');
```

## sagas

Calls your sagas it with modal context when action `showModal` dispatches with it's name. Config must be an object with key/value pairs as modals names and value as its sagas.

**Arguments**

- **config**(Object)(Require)
  - <[key: ModalName], Saga: Generator>

## sagaModal

  Connects a component to Redux store and injects the modal state and action creators:

- modal: Object;
  - name;
- isOpen;
- show;
- update;
- destroy;
- click;
- submit;
- hide;
- showModal;
- updateModal;
- submitModal;
- clickModal;
- hideModal;
- destroyModal;

 **Arguments**

- **name**(String)(Required) the name of a modal
- **config**(Object)
  - **name** (Function) A selector that takes the Redux store and returns the slice which corresponds to where the redux-saga-modal `reducer` was mounted. By default reducer is mounted    under the 'modals' key: `state => state.modals`
  - **getModalState** (Function) A selector that takes the Redux store and returns the slice which corresponds to where the redux-saga-modal `reducer` was mounted. By default reducer is       mounted under the 'modals' key: `state => state.modals`;
  - **actions**(Object) Custom actions to bind with redux `dispatch`;
  - **keepComponentOnHide**(Boolean) Whether keep modal component when `isOpen` equals `false`. By default equals `false`;
  - **destroyOnHide**(Boolean) Whether automatically dispatch `destroy` to after `hide`. By default equals `true`.
  
## reducer

 The modals reducer keeps state of the all modals. Should be mounted to redux store under name `modals` or any other but in this case you need to pass selector `getModalsState` to `sagaModal`.

## License

## MIT

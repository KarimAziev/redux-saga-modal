# redux-saga-modal

Manage modals with `redux-saga`.

[![](https://img.shields.io/npm/v/redux-saga-modal.svg)](https://www.npmjs.com/package/redux-saga-modal)
[![](https://img.shields.io/codecov/c/github/KarimAziev/redux-saga-modal.svg)](https://codecov.io/gh/KarimAziev/redux-saga-modal)
[![](https://img.shields.io/npm/dt/redux-saga-modal.svg)](https://www.npmjs.com/package/redux-saga-modal)

## [Live Demo](https://codesandbox.io/s/github/KarimAziev/redux-saga-modal-example/tree/master/)

## Install

```bash
npm i redux-saga-modal
```

Or

```bash
yarn add redux-saga-modal
```

## Usage

Pass the `reducer` to your store. It keeps the state of all your modal
components, so you only have to pass it once.

```typescript
import { createStore, combineReducers } from 'redux';
import { reducer as modalReducer } from 'redux-saga-modal';

const rootReducer = combineReducers({
  // ...your other reducers
  // modalReducer should be mounted under 'modals' key,
  modals: modalReducer,
});

const store = createStore(rootReducer);
```

Connect a component to Redux Store with `sagaModal`.

```typescript
import {
  sagaModal,
  createModal,
  SagaModalInjectedProps,
} from 'redux-saga-modal';
import ReactModal from 'react-modal';
import { ReactNode } from 'react';

ReactModal.setAppElement('#root');

export interface ConfirmModalOwnProps {
  title: ReactNode;
  text: ReactNode;
}

const Confirm: React.FC<ConfirmModalOwnProps & SagaModalInjectedProps> = ({
  isOpen,
  submit,
  hide,
  title,
  text,
}) => {
  const handleSubmit = () => {
    submit();
  };
  return (
    <ReactModal isOpen={isOpen} onRequestClose={hide} closeTimeoutMS={500}>
      <h3>{title}</h3>
      <p>{text}</p>
      <div>
        <button onClick={hide}>Cancel</button>
        <button onClick={handleSubmit}>Confirm</button>
      </div>
    </ReactModal>
  );
};

const modal = createModal('confirm');

const ConnectedConfirmModal = sagaModal({
  name: modal.name,
})(Confirm);

export { modal, ConnectedConfirmModal };
```

To create an instance use `createModal` and pass the modal name as the
first argument.

```typescript
import { createModal } from 'redux-saga-modal';
const modal = createModal('CONFIRM');
```

Result

```typescript
{
  name: 'CONFIRM',
  selector: function (r) {},
  patterns: {
    show: function (n) {},
    hide: function (n) {},
    destroy: function (n) {},
    update: function (n) {},
    click: function (n) {},
    submit: function (n) {},
  },
  actions: {
    show: function (n) {},
    update: function (n) {},
    submit: function (n) {},
    click: function (n) {},
    hide: function () {},
    destroy: function () {},
  },
  takeShow: function (t) {},
  takeUpdate: function (t) {},
  takeClick: function (t) {},
  takeDestroy: function (t) {},
  takeSubmit: function (t) {},
  takeHide: function (t) {},
  show: function (r) {},
  update: function (r) {},
  click: function (r) {},
  submit: function (r) {},
  hide: function () {},
  destroy: function () {},
  select: function () {},
};
```

All methods already bound to the modal's name so you don't need manually
pass it. The instance will receive properties [actions](#actions),
[patterns](#patterns), `name`, `selector` and high-level
[effects](#effects) `show`, `update`, `hide`, `submit`, `click`,
`destroy`, `takeShow`, `takeUpdate`, `takeHide`, `takeSubmit`,
`takeClick` and `takeDestroy`.

Both `patterns` and `actions` have methods named `show`, `update`,
`hide`, `submit`, `click` and `destroy`.

```typescript
import { race } from 'redux-saga/effects';
import { createModal } from 'redux-saga-modal';

const modal = createModal('confirm');

const confirmModal = function* (initProps: ConfirmModalOwnProps) {
  yield modal.show(initProps);

  const [submit]: boolean[] = yield race([
    modal.takeSubmit(),
    modal.takeHide(),
  ]);

  yield modal.hide();

  return !!submit;
};
```

Alternatively if you don't need high-level effects you can use
[createModalHelpers](#createModalHelpers). The example above can be
rewritten like this:

```typescript
import { race, put, take } from 'redux-saga/effects';
import { createModalHelpers } from 'redux-saga-modal';
import { ConfirmModalOwnProps } from './Modal';

const modal = createModalHelpers('confirm');
const confirmModal = function* (initProps: ConfirmModalOwnProps) {
  yield put(modal.actions.show(initProps));

  const [submit]: boolean[] = yield race([
    take(modal.patterns.submit()),
    take(modal.patterns.hide()),
  ]);

  yield put(modal.actions.hide());

  return !!submit;
};
```

For frequently repeated modals tasks create a config object with modals
names as keys and tasks as values. Pass the config as the argument to
`sagas` and fork it in your rootSaga.

Your tasks will be called with a `this` context every time when an
action `showModal` has been dispatched with it's name and **cancelled**
on destroyModal.

The context of your task will have properties `actions`, `patterns`,
`name`, `selector` and high-level [effects](#effects) `show`, `update`,
`hide`, `submit`, `click`, `destroy`, `takeShow`, `takeUpdate`,
`takeHide`, `takeSubmit`, `takeClick` and `takeDestroy`.

Both `patterns` and `actions` have methods named `show`, `update`,
`hide`, `submit`, `click` and `destroy`.

```typescript
import { race, call, fork, all } from 'redux-saga/effects';
import {
  sagas as modalsSaga,
  SagaModalInstance,
  SagaModalAction,
} from 'redux-saga-modal';

interface CommentData {
  id: number;
  comment: string;
}

const saveComment = (data: CommentData) =>
  new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 1000));

const saveCommentWorker = function* (this: SagaModalInstance) {
  const [submitAction]: SagaModalAction<CommentData>[] = yield race([
    this.takeSubmit(),
    this.takeHide(),
  ]);

  if (submitAction) {
    yield this.update({
      title: 'Saving',
      loading: true,
    });

    yield call(saveComment, submitAction.payload as CommentData);
    yield this.update({
      title: 'Changes saved',
      loading: false,
    });
  }

  yield this.hide();
};

const modalsTasks = {
  saveComment: saveCommentWorker,
};

export default function* rootSaga() {
  yield all([fork(modalsSaga, modalsTasks)]);
}
```

## API

- [Actions Creators](#Actions-Creators)
- [Instance Creators](#Instance-properties)
  - [createModal](#createModal)
  - [createModalHelpers](#createModalHelpers)
- [Instance properties](#Instance-properties)

  - [name](#name)
  - [actions](#actions)
  - [patterns](#patterns)
  - [selector](#selector)
  - [show](#show)
  - [update](#effects)
  - [submit](#effects)
  - [click](#effects)
  - [hide](#effects)
  - [destroy](#effects)
  - [takeShow](#effects)
  - [takeUpdate](#effects)
  - [takeSubmit](#effects)
  - [takeClick](#effects)
  - [takeHide](#effects)
  - [takeDestroy](#effects)

- [sagas](#sagas)

- [sagaModal](#sagaModal)

- [reducer](#reducer)

- [createModalActions](#createModalActions)

- [createModalEffects](#createModalEffects)

## Actions Creators

Basic actions creators.

| Name         | Arguments                            | Description                                                  |
| ------------ | ------------------------------------ | ------------------------------------------------------------ |
| showModal    | (name: String, payload: Object = {}) | Triggers to show a modal and sets payload as props           |
| updateModal  | (name: String, payload: Object = {}) | Updates the modal by merging payload with it's current props |
| submitModal  | (name: String, payload: any)         | Triggers that a target's button was pressed                  |
| clickModal   | (name: String, payload: any)         | A trigger for handling any click on modal                    |
| hideModal    | (name: String)                       | Hide modal without destroying its state in the redux store   |
| destroyModal | (name: String)                       | Close a modal by destroying its props                        |

## Instance Creators

### createModal

Creates a modal instance with properties `name`, `selector`, `actions`,
`patterns`, and [effects creators](#effects) `show`, `update`, `hide`,
`submit`, `click`, `destroy`, `takeShow`, `takeUpdate`, `takeHide`,
`takeSubmit`, `takeClick` and `takeDestroy`.

Both `patterns` and `actions` includes methods named `show`, `update`,
`hide`, `submit`, `click` and `destroy`. All methods refer to the
modal's name so you don't need manually pass it.

**Arguments**

- name(String)(Required) the name of a modal

- config(Object)

  - **getModalsState** (Function) A selector that takes the Redux
    store and returns the slice which corresponds to where the
    redux-saga-modal `reducer` was mounted. By default, the reducer
    is mounted under the `modals` key.

<!-- end list -->

```typescript
import { createModal } from 'redux-saga-modal';

const {
  name,
  selector,
  //patterns creators used for filtering actions inside take effects
  patterns: { show, click, submit, update, hide, destroy },
  //action creators
  actions: { show, click, submit, update, hide, destroy },
  //put effects (already wrapped in redux-saga put)
  show,
  click,
  submit,
  update,
  hide,
  destroy,
  //take effects (already wrapped in redux-saga take)
  takeShow,
  takeClick,
  takeSubmit,
  takeUpdate,
  takeHide,
  takeDestroy,
} = createModal('CONFIRM');
```

## createModalHelpers

Creates a [modal instance](#Instance-properties) with properties
`actions`, `patterns`, `selector` and `name`.

Both `patterns` and `actions` have methods named `show`, `update`,
`hide`, `submit`, `click` and `destroy`.

**Arguments**

- name(String)(Required) the name of a modal

- config(Object)

  - getModalsState (Function) A selector that takes the Redux store
    and returns the slice which corresponds to where the
    redux-saga-modal `reducer` was mounted. By default, the reducer
    is mounted under the `modals` key.

<!-- end list -->

```typescript
import { createModalHelpers } from 'redux-saga-modal';

const {
  name,
  selector,
  patterns: { show, click, submit, update, hide, destroy },
  actions: { show, click, submit, update, hide, destroy },
} = createModalHelpers('CONFIRM');
```

## Instance properties

### name

The name of the modal instance which was passed to `createModal` or
`createModalHelpers`. Should be the same as passed one in `sagaModal`.

### actions

Same as [basic actions creators](#Actions-Creators) but the first
argument is already bound to the modal name.

| Name    | Arguments              | Description                                                  |
| ------- | ---------------------- | ------------------------------------------------------------ |
| show    | (payload: Object = {}) | Triggers to show a modal and sets payload as it's props      |
| update  | (payload: Object = {}) | Updates the modal by merging payload with it's current props |
| submit  | (payload: any)         | Triggers that a target's button was pressed                  |
| click   | (payload: any)         | A trigger for handling any click on modal                    |
| hide    | ()                     | Hide modal without destroying its state in the redux store   |
| destroy | ()                     | Close a modal by destroying its props                        |

**Example**

```typescript
import { createModal, createModalActions, showModal } from 'redux-saga-modal';

const modal = createModal('CONFIRM');
yield put(modal.actions.show({ title: 'Some title' }));

//or
const confirmActions = createModalActions('CONFIRM');
yield put(confirmActions.show({ title: 'Some title' }));

//or
yield put(showModal('CONFIRM', { title: 'Some title' }));
```

### patterns

Matcher methods for filtering modal actions inside `redux-saga` take
effects, such as `take`, `takeLatest`, `takeEvery` etc. Every pattern
accepts optional argument for checking payload.

Payload pattern has the
[same](https://redux-saga.js.org/docs/api/#takepattern) meaning and
rules as in the `redux-saga` but applies not for the whole action but
only to its payload.

| Name    | Arguments               | Description                                                                  |
| ------- | ----------------------- | ---------------------------------------------------------------------------- |
| show    | payloadPattern?: String | Function                                                                     |
| update  | payloadPattern?: String | Function                                                                     |
| submit  | payloadPattern?: String | Function                                                                     |
| click   | payloadPattern?: String | Function                                                                     |
| hide    |                         | An action matcher for `hideModal` with the same name as it's instance has    |
| destroy |                         | An action matcher for `destroyModal` with the same name as it's instance has |

**Example**

```typescript
import { createModal } from 'redux-saga-modal';

const { patterns } = createModal('CONFIRM');

//result: take(action => action.type === clickModal().type && action.meta.name === 'CONFIRM' && payload === 'value'
yield take(patterns.click(payload === 'value'));

//result: take(action => action.type === clickModal().type && action.meta.name === 'CONFIRM' && payload && payload.text === 'Some text'

yield take(patterns.show((payload) => payload && payload.text === 'Some text'));

//result: take(action => action.type === clickModal().type && action.meta.name === 'CONFIRM'
yield take(patterns.click);
```

### selector

```typescript
import { createModal } from 'redux-saga-modal';

const { selector, ...effects } = createModal('CONFIRM');

// the same
yield select(selector);
yield effects.select();
```

### effects

Produced with `createModal` or `createModalEffects`. Returns scoped
`put`, `select` and `take` effects.

Payload pattern in the `take` effects has the same meaning and rules as
in's the `redux-saga`, but applies not for the whole action but only to
the payload.

| Name        | Arguments                | Effect   |                                                                       |
| ----------- | ------------------------ | -------- | --------------------------------------------------------------------- |
| show        | (payload: Object)        | put      | Triggers to show a modal and sets payload as it's props               |
| update      | (payload: Object)        | put      | Updates the modal by merging payload with it's current props          |
| submit      | (payload: any)           | put      | Triggers that a target's button was pressed                           |
| click       | (payload: any)           | put      | A trigger for handling any click on modal                             |
| hide        | (name: String)           | put      | Hide modal without destroying it's state in the redux store           |
| destroy     | (name: String)           | put      | Close a modal by destroying it's props                                |
| select      | (name: String)           | select   | Select a modal state from the Redux Store                             |
| takeShow    | (payloadPattern?: String | Function | Array                                                                 |
| takeUpdate  | (payloadPattern?: String | Function | Array                                                                 |
| takeSubmit  | (payloadPattern?: String | Function | Array                                                                 |
| takeClick   | (payloadPattern?: String | Function | Array                                                                 |
| takeHide    |                          | take     | Returns a `take` effect for an action `hideModal` with scoped name    |
| takeDestroy |                          | take     | Returns a `take` effect for an action `destroyModal` with scoped name |

**Example**

```typescript
import { createModal } from 'redux-saga-modal';

const { name, ...effects } = createModal('CONFIRM');

//result: put(showModal('CONFIRM', ({ text: 'Some text' }))
yield effects.show({ text: 'Some text' });

//result: take(action => action.type === clickModal().type && action.meta.name === 'CONFIRM' && payload === 'value'
yield effects.takeClick('value');

//result: take(action => action.type === clickModal().type && action.meta.name === 'CONFIRM' && payload && payload.text === 'Some text'
yield effects.takeClick((payload) => payload && payload.text === 'Some text');
//result: take(action => action.type === clickModal().type && action.meta.name === 'CONFIRM'
yield effects.takeClick();
```

## sagas

Invoke your sagas with a `this` context whenever an action `showModal`
has been dispatched with passed name and **cancelled** on
`destroyModal`.

**Arguments**

- config(Object)(Required)

  - \<\[key: ModalName\], Saga: Generator\>

## sagaModal

Connects a component to Redux store and injects next props:

- modal: { name }
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

- name(String)(Required) the name of a modal

- config(Object)

  - **name** (String)(Required) the name of a modal
  - **getModalsState** (Function) A selector that takes the Redux
    store and returns the slice which corresponds to where the
    redux-saga-modal `reducer` was mounted. By default reducer is
    mounted under the 'modals' key: `state => state.modals`
  - **actions** (Object) Custom actions to bind with redux
    `dispatch`
  - **keepComponentOnHide** (Boolean) Whether keep modal component
    when `isOpen` equals `false` By default equals `false`
  - **destroyOnHide** (Boolean) Whether automatically dispatch
    `destroy` to after `hide`. By default equals `true`

## reducer

The modals reducer keeps state of the all modals. Should be mounted to
redux store under name `modals` or any other but in this case you need
to pass selector `getModalsState` to `sagaModal`, `createModal` and
`createModalHelpers`.

## createModalActions

**Arguments**

- name(String)(Required) the name of a modal

Creates [actions creators](#actions) `show`, `update`, `hide`, `submit`,
`click` and `destroy` bound to the name of the modal.

## createModalEffects

**Arguments**

- name (String)(Required) the name of a modal

Creates [effects](#effects) `show`, `update`, `hide`, `submit`, `click`
and `destroy` bound to the name of the modal.

## createModalPatterns

**Arguments**

- name(String)(Required) the name of a modal

Creates [patterns creators](#patterns) `show`, `update`, `hide`,
`submit`, `click` and `destroy` bound to the name of modal. Every
pattern accepts optional matcher for checking payload.

## License

MIT © [KarimAziev](https://github.com/KarimAziev)

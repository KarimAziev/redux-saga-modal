// @flow
import actionTypes from './actionTypes';
import { Store, Dispatch } from 'redux';
import { modalsStateSelector } from './selectors';
import * as React from 'react';
import type { Saga, PutEffect, SelectEffect, AllEffect } from 'redux-saga';
import type { Pattern } from 'redux-saga';
import isModal from './is';
type Dictionary<K, T> = { [K]: T };
export type ModalName = string;
export type HideParams = {|
  destroy: boolean 
 |};
type ActionMeta = {|
  +name: ModalName,
|};
export type ModalState = {
  isOpen?: boolean,
};

export type ReduxModalState = {
  ...ModalState,
  clicked?: any,
  props: any,
};
export type ModalsState = Dictionary<ModalName, ReduxModalState>;

export type Config = {|
  +name: ModalName,
  getModalsState?: typeof modalsStateSelector,
  initProps?: {},
|};

export type ShowModal = {|
  +type: typeof actionTypes.SHOW_MODAL,
  payload?: any,
  +meta: ActionMeta,
|};
export type HideModal = {
  +type: typeof actionTypes.HIDE_MODAL,
  +meta: {|
    +name: ModalName,
    +destroy: boolean,
  |},
};

export type ClickModal = {
  +type: typeof actionTypes.CLICK_MODAL,
  payload: any,
  +meta: ActionMeta,
};

export type UpdateModal = {
  +type: typeof actionTypes.UPDATE_MODAL,
  payload: any,
  +meta: ActionMeta,
};

export type DestroyModal = {
  +type: typeof actionTypes.DESTROY_MODAL,
  +meta: ActionMeta,
};
type AnyAction = {
  +type: string,
  payload?: any,
  meta?: any,
};
export type Action =
  | AnyAction
  | ShowModal
  | HideModal
  | ClickModal
  | UpdateModal;

export interface ReduxContext {
  store: Store<any>;
}

export type ModalComponentMethods = {
  hide(): Dispatch<HideModal>,
  click(props: any): Dispatch<ClickModal>,
  show(props: any): Dispatch<ShowModal>,
  update(props: any): Dispatch<UpdateModal>,
};
export type ModalOwnProps = {
  displayName?: any,
  ...$ElementType<Config, 'initProps'>,
};

export type ModalComponentProps = {
  ...$Exact<ModalComponentMethods>,
};

export type ConnectModalProps = {
  hideModal: (name: ModalName) => HideModal,
  showModal: (name: ModalName, props?: any) => ShowModal,
  updateModal: (name: ModalName, props: any) => UpdateModal,
  clickModal: (name: ModalName, value: any) => ClickModal,
  destroyModal: (name: ModalName) => DestroyModal,
  modal: ReduxModalState,
};

export type ConnectModalState = {
  isOpen: $ElementType<ModalState, 'isOpen'>,
};
export type InjectedProps = {|
  ...$Exact<ConnectModalState>,
  ...$Exact<ModalComponentMethods>,
  ...$Exact<ConnectModalProps>,
  ...$Exact<ModalOwnProps>,
|};
export interface InjectedWrapperComponent {
  <InjectedProps>(
    component: React.ComponentType<ModalOwnProps>
  ): React.Component<InjectedProps>;
}

export type RootModalSaga = Saga<AllEffect>;
export type CheckPattern = (
  name: ModalName,
  pattern: Pattern,
  action: Action
) => boolean;
export interface is {
  click(): CheckPattern;
  show(): CheckPattern;
  hide(): CheckPattern;
  destroy(): CheckPattern;
}
export interface SagaContext<N: ModalName> {
  name: N;
  show(): PutEffect<ShowModal, null, void>;
  hide(): PutEffect<HideModal, null, void>;
  destroy(): PutEffect<DestroyModal, null, void>;
  update(props: any): PutEffect<UpdateModal, null, void>;
  click(props: any): PutEffect<ClickModal, null, void>;
  select(selector?: Function): SelectEffect<Function, []>;
  is: typeof isModal;
}

export type SagaRootConfig = {
  [key: ModalName]: () => [SagaContext<ModalName>, Generator<void, void, void>],
};

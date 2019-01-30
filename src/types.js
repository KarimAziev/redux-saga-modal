// @flow
import actionTypes from './actionTypes';
import { Store } from 'redux';
import { modalsStateSelector } from './selectors';
import * as React from 'react';
import type { Saga } from 'redux-saga';

type Dictionary<K, T> = {[K]: T};
type ActionMeta = {|
  +name: ModalName,
|};
export type ModalComponentProps = {
  displayName?: any,
};
export type ModalName = string;
export type ModalState = {
  isOpen?: boolean,
};

export type ReduxModalState = {
  ...ModalState,
  clicked?: any,
  props: any,
};
export type ModalsState = Dictionary<ModalName, ReduxModalState>;

export type Config = {
  +name: ModalName,
  getModalsState?: typeof modalsStateSelector,
  initProps?: Object,
};


export type ShowModal = {|
  +type: typeof actionTypes.SHOW_MODAL,
  payload?: any,
  +meta: ActionMeta,
|};
export type HideModal = {
  +type: typeof actionTypes.HIDE_MODAL,
  +meta: ActionMeta,
  payload?: any,
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

type AnyAction = {
  +type: string, 
  payload?: any,
  meta?: any,
};
export type Action = AnyAction | ShowModal | HideModal | ClickModal | UpdateModal;


export interface ReduxContext {
  store: Store<any>;
}


export interface InjectedProps {
  isOpen: $ElementType<ModalState, 'isOpen'>;
  hide: () => void;
  click: (value?: any) => void;
  update: (data: Object) => void;
}

export interface ConnectModalProps {
  hideModal: (name: ModalName) => HideModal;
  showModal: (name: ModalName) => ShowModal;
  updateModal: (name: ModalName, props: any) => UpdateModal;
  clickModal: (name: ModalName, value: any) => ClickModal;
  modal: ReduxModalState;
}

export interface ConnectModalState {
  isOpen: $ElementType<ModalState, 'isOpen'>;
}

export interface InjectedWrapperComponent {
  <InjectedProps>(
    component: React.ComponentType<ModalComponentProps>
  ): React.ComponentType<$Diff<InjectedProps, ModalComponentProps>>;
}


export type SagaConfig = {
  [key: ModalName]: Saga<void>
};

export type RootModalSaga = Saga<void>;
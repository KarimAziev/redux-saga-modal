import { ActionCreatorsMapObject, Action } from 'redux';
import { DefaultRootState } from 'react-redux';
import { TakeEffect } from 'redux-saga/effects';
import { modalsStateSelector, modalSelector } from './selectors';
import * as actionsCreators from './actionsCreators';
import { createModalActions } from './createModalActions';
import createModalPatterns from './createModalPatterns';
import { ModalActionTypes } from './actionTypes';

export interface ICreateModalParams {
  getModalsState: typeof modalsStateSelector;
}

export interface ICreateModalEffectsParams {
  getModalsState?: ICreateModalParams['getModalsState'];
  selector: ReturnType<typeof modalSelector>;
  patterns?: ReturnType<typeof createModalPatterns>;
}

export interface SagaModalCommonAction extends Action<keyof ModalActionTypes> {
  type: keyof ModalActionTypes;
  meta: {
    name: string;
  };
}

export interface ModalAction extends Action {
  meta: {
    name: string;
  };
  payload?: any;
}

export type RenameActionsMap = Record<
  'update' | 'show' | 'hide' | 'destroy' | 'submit' | 'click',
  (...args: any) => ModalAction
>;

export interface SagaModalAction<P> extends SagaModalCommonAction {
  payload: P;
}

export type ModalItemState<P> = {
  props: P;
  isOpen?: boolean;
  isSubmitted?: boolean;
  submitted?: any;
  clicked?: any;
};

export interface ModalsState {
  [name: string]: ModalItemState<any>;
}

export interface State extends DefaultRootState {
  modals: ModalsState;
}

export interface SagaModalConfig {
  name: string;
  getModalsState?: typeof modalsStateSelector;
  destroyOnHide?: boolean;
  initProps?: Record<string, unknown>;
  actions?: ActionCreatorsMapObject;
  keepComponentOnHide?: boolean;
}

export interface SagaModalInjectedProps {
  isOpen: boolean;
  isSubmitted?: boolean;
  modal: {
    name: string;
  };

  show(payload: unknown): void;
  update(payload: unknown): void;
  click(payload?: unknown): void;
  submit(payload?: unknown): void;
  hide(): void;
  destroy(): void;
  showModal(name: string, payload: any): void;
  updateModal(name: string, payload: any): void;
  submitModal(name: string, payload: any): void;
  clickModal(name: string, payload: any): void;
  hideModal(name: string): void;
  destroyModal(name: string): void;
}

export interface ConnectModalState {
  isOpen?: boolean;
}

export interface ConnectModalProps {
  modal: {
    isOpen?: boolean;
    name: string;
    props: any;
  };
  show(payload: unknown): void;
  update(payload: unknown): void;
  click(payload?: unknown): void;
  submit(payload?: unknown): void;
  hide(): void;
  destroy(): void;
  showModal(name: string, payload: any): void;
  updateModal(name: string, payload: any): void;
  submitModal(name: string, payload: any): void;
  clickModal(name: string, payload: any): void;
  hideModal(name: string): void;
  destroyModal(name: string): void;
}

export type ModalActionCreators = typeof actionsCreators[keyof typeof actionsCreators];
export type ModalPatterns = ReturnType<typeof createModalPatterns>;
export type ModalPattern = ModalPatterns[keyof ModalPatterns];

export interface ModalHelpers {
  name: string;
  selector<P>(s: State): ModalItemState<P>;
  patterns: ReturnType<typeof createModalPatterns>;
  actions: ReturnType<typeof createModalActions>;
}
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface IReduxSagaModalInjectedComponent {
  <P extends SagaModalInjectedProps>(
    component: React.ComponentType<P> | React.FC<P>,
  ): React.ComponentClass<P & any>;
}
export interface TakePatterns {
  takeShow: (payloadPattern?: any) => TakeEffect;
  takeUpdate: (payloadPattern?: any) => TakeEffect;
  takeClick: (payloadPattern?: any) => TakeEffect;
  takeDestroy: (payloadPattern?: any) => TakeEffect;
  takeSubmit: (payloadPattern?: any) => TakeEffect;
  takeHide: (payloadPattern?: any) => TakeEffect;
}

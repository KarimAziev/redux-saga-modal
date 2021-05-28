import { ActionCreatorsMapObject, Action } from 'redux';
import { DefaultRootState } from 'react-redux';
import { TakeEffect } from 'redux-saga/effects';
import { modalsStateSelector, modalSelector } from './selectors';
import * as actionsCreators from './actionsCreators';
import { createModalActions } from './createModalActions';
import createModalPatterns from './createModalPatterns';

export interface ICreateModalParams {
  getModalsState: typeof modalsStateSelector;
}

export interface ICreateModalEffectsParams {
  getModalsState?: ICreateModalParams['getModalsState'];
  selector: ReturnType<typeof modalSelector>;
  patterns?: ReturnType<typeof createModalPatterns>;
}

export type Predicate<T> = (arg: T) => boolean;
export type SubPattern<T> = Predicate<T>;
export type Pattern<T> = SubPattern<T> | SubPattern<T>[] | SubPattern<string>;
export interface ModalAction extends Action {
  meta?: {
    name: string;
  };
  payload?: any;
}

export interface ModalItemState {
  isOpen: boolean;
  props: any;
  isSubmitted?: boolean;
  submitted?: any;
  clicked?: any;
}

export interface ModalsState {
  [name: string]: ModalItemState;
}

export interface State extends DefaultRootState {
  modals: ModalsState;
  [key: string]: ModalsState;
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
  selector: (state: State) => ModalItemState;
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

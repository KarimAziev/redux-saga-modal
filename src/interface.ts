import { ActionCreatorsMapObject, Action } from 'redux';
import * as React from 'react';
import { TakeEffect } from 'redux-saga/effects';
import {
  DefaultRootState,
  ConnectedComponent,
  Shared,
  GetProps,
} from 'react-redux';
import { modalsStateSelector } from './selectors';
import * as actionsCreators from './actionsCreators';
import createModalBoundActions, {
  createModalActions,
} from './createModalActions';
import createModalPatterns from './createModalPatterns';
import { ModalActionTypes } from './actionTypes';

export interface ICreateModalParams {
  getModalsState?: typeof modalsStateSelector;
}

export interface ICreateModalEffectsParams {
  getModalsState?: ICreateModalParams['getModalsState'];
  selector?: Function;
  patterns?: ReturnType<typeof createModalPatterns>;
}

export interface SagaModalCommonAction extends Action<string> {
  type: ModalActionTypes;
  meta: {
    name: string;
  };
}

export interface SagaModalAction<InitProps = {}> extends SagaModalCommonAction {
  payload?: InitProps;
}

export type ModalItemState<InitProps> = {
  props: InitProps;
  isOpen?: boolean;
  isSubmitted?: boolean;
  submitted?: any;
  clicked?: any;
};

export interface ModalsState {
  [name: string]: ModalItemState<object>;
}

export interface State extends DefaultRootState {
  modals: { [name: string]: ModalItemState<unknown> };
}

type ModalDispatchActions = ReturnType<typeof createModalBoundActions>;

export interface SagaModalInjectedProps extends ModalDispatchActions {
  isOpen: boolean;
  modal: {
    name: string;
  };
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

export interface ConnectModalProps extends ModalDispatchActions {
  modal: ModalItemState<{}>;
  showModal(name: string, payload: any): void;
  updateModal(name: string, payload: any): void;
  submitModal(name: string, payload: any): void;
  clickModal(name: string, payload: any): void;
  hideModal(name: string): void;
  destroyModal(name: string): void;
}

export type ModalActionCreators = typeof actionsCreators[keyof typeof actionsCreators];
export interface ModalHelpers {
  name: string;
  selector<InitProps>(s: State): ModalItemState<InitProps>;
  patterns: ReturnType<typeof createModalPatterns>;
  actions: ReturnType<typeof createModalActions>;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;

export interface IReduxSagaModalInjectedComponent {
  <C extends React.ComponentType<any>>(component: C): ConnectedComponent<
    C,
    Partial<
      DistributiveOmit<
        GetProps<C>,
        keyof Shared<SagaModalInjectedProps, GetProps<C>>
      >
    >
  >;
}
/**
* Params to connect a component to Redux Store with HOC `sagaModal`.
* @param name - an uniq name of the modal
* @param getModalsState - An optional custom selector that takes the Redux store
and returns the slice with all modals
* @param destroyOnHide - whether to destroy modal on unmount
* @param keepComponentOnHide - whether to force render child components
* @param initProps - initial props for child component
* @param actions - additional actionCreatorsMapObject to pass into child component
*/
export interface SagaModalConfig<InitProps> {
  name: string;
  getModalsState?: typeof modalsStateSelector;
  initProps?: InitProps;
  actions?: ActionCreatorsMapObject;
  destroyOnHide?: boolean;
  keepComponentOnHide?: boolean;
}
/**
 * High order `take` effects creators.
 * The result of every creator is `take` with predicate to match a corresponding modal action.
 * You can also pass payloadPattern to perfoms addiotonal checks for action's payload,
 */
export interface TakePatterns {
  takeShow(payloadPattern?: any): TakeEffect;
  takeUpdate(payloadPattern?: any): TakeEffect;
  takeClick(payloadPattern?: any): TakeEffect;
  takeDestroy(payloadPattern?: any): TakeEffect;
  takeSubmit(payloadPattern?: any): TakeEffect;
  takeHide(payloadPattern?: any): TakeEffect;
}

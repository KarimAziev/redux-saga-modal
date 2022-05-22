import { Action } from 'redux';
import * as React from 'react';
import { ConnectedComponent, Shared, GetProps } from 'react-redux';
import { modalsStateSelector } from './selectors';
import * as actionsCreators from './actionsCreators';
import createModalBoundActions, {
  createModalActions,
} from './createModalActions';
import createModalPatterns from './createModalPatterns';
import { ModalActionTypes } from './actionTypes';

export interface CreateModalParams {
  getModalsState?: typeof modalsStateSelector;
}

export interface CreateModalEffectsParams {
  getModalsState?: CreateModalParams['getModalsState'];
  selector?: Function;
  patterns?: ReturnType<typeof createModalPatterns>;
}

export interface SagaModalCommonAction extends Action<string> {
  type: ModalActionTypes;
  meta: {
    /**
     *  Name of the modal.
     **/
    name: string;
  };
}

export interface SagaModalAction<InitProps = {}> extends SagaModalCommonAction {
  /**
   * Object with props to store in redux store and pass to connected component.
   **/
  payload?: InitProps;
}

export interface ModalItemState<InitProps = {}> {
  props: InitProps;
  isOpen: boolean;
}

export interface ModalsState<PayloadProps = {}> {
  [name: string]: ModalItemState<PayloadProps>;
}

export interface DefaultRootState {}

export type AnyIfEmpty<T extends object> = keyof T extends never ? any : T;
export type RootStateOrAny = AnyIfEmpty<DefaultRootState>;
export interface State extends RootStateOrAny {
  modals: ModalsState;
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

export type Omit<PayloadProps, K extends keyof PayloadProps> = Pick<
  PayloadProps,
  Exclude<keyof PayloadProps, K>
>;
export type DistributiveOmit<
  PayloadProps,
  K extends keyof PayloadProps
> = PayloadProps extends unknown ? Omit<PayloadProps, K> : never;

export interface ReduxSagaModalInjectedComponent {
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

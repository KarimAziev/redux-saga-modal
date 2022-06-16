import { Action } from 'redux';
import * as React from 'react';
import { ConnectedComponent, Shared, GetProps } from 'react-redux';
import { modalsStateSelector } from './selectors';
import * as actionsCreators from './actionsCreators';
import createModalBoundActions from './createModalActions';
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

/**
 * Redux state of single modal item.
 * Action hide toggle isOpen, but keep props.
 * Action show payload replacing stored props of modal if any.
 * Action update merge stored props of modal with payload.
 * Action destroy will totally cleanup of modal item
 **/
export interface ModalItemState<InitProps = {}> {
  props: InitProps;
  isOpen: boolean;
}
/**
 * Redux state of all non-destroyed modals
 * See {@link ModalItemState}
 **/
export interface ModalsState<PayloadProps = {}> {
  [name: string]: ModalItemState<PayloadProps>;
}

export interface DefaultRootState {}

export type AnyIfEmpty<T extends object> = keyof T extends never ? any : T;

export type RootStateOrAny = AnyIfEmpty<DefaultRootState>;

/**
 * Redux state assumes that default modal reducer is mounted under the 'modals' key
 **/
export interface State extends RootStateOrAny {
  modals: ModalsState;
}

type ModalDispatchActions = ReturnType<typeof createModalBoundActions>;

/**
 * SagaModalCommonAction
 */
export type ModalActionCreators = typeof actionsCreators[keyof typeof actionsCreators];

export type DistributiveOmit<
  PayloadProps,
  K extends keyof PayloadProps
> = PayloadProps extends unknown ? Omit<PayloadProps, K> : never;

/**
 * Non-redux state of modal
 *
 */
export interface ConnectModalState {
  isOpen?: boolean;
}

/**
 * Props passed to modal connector ReduxSagaModalInjectedComponent
 *
 */
export interface ConnectModalProps extends ModalDispatchActions {
  modal: ModalItemState<{}>;
  showModal(name: string, payload: any): void;
  updateModal(name: string, payload: any): void;
  submitModal(name: string, payload: any): void;
  clickModal(name: string, payload: any): void;
  hideModal(name: string): void;
  destroyModal(name: string): void;
}

/**
 * Injected props will be passed to decorated component.
 * Methods show, hide, update, destroy, submit, click (See {@link ModalDispatchActions})
 * are already bound to the name, passed to `sagaModal'.
 **/

export interface SagaModalInjectedProps extends ModalDispatchActions {
  isOpen: boolean;
  modal: {
    /**
     *  Name of the modal passed to `sagaModal'.
     **/
    name: string;
  };
  showModal(name: string, payload: any): void;
  updateModal(name: string, payload: any): void;
  submitModal(name: string, payload: any): void;
  clickModal(name: string, payload: any): void;
  hideModal(name: string): void;
  destroyModal(name: string): void;
}

/**
 * A higher-order component that takes a modal component and returns a connected one with injected props
 * required by the decorated component.
 */
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

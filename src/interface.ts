import * as React from 'react';
import type { Action } from 'redux';
import type { ConnectedComponent, Shared, GetProps } from 'react-redux';
import { modalsStateSelector } from './selectors';
import createModalBoundActions from './createModalActions';
import createModalPatterns from './createModalPatterns';
import { ModalActionTypes } from './actionTypes';

/**
 * Params fro creating modal instance
 * You need to pass it only if modals reducer mounted under other key than `modals`
 *
 * `getModalsState` is a selector which accepts state and should return slice with all modals {@link ModalsState}
 */
export interface CreateModalParams {
  /**
   * a selector which accepts state and should return {@link ModalsState}
   */
  getModalsState?: typeof modalsStateSelector;
}

/**
 * Params for create modal effects.
 * You need to pass it only if modals reducer mounted under other key than `modals`
 */
export interface CreateModalEffectsParams {
  /* a selector which accepts state and should return slice with all modals {@link ModalsState} */
  getModalsState?: CreateModalParams['getModalsState'];
  /* a selector which accepts state and should return slice for particular modal  */
  selector?: Function;
  /* an action matchers to use in `take` effects */
  patterns?: ReturnType<typeof createModalPatterns>;
}
/* A flux action with meta (with property name) and type.
 * There are two such modal action creators - {@link hideModal} and {@link destroyModal}
 */
export interface SagaModalCommonAction extends Action<string> {
  type: ModalActionTypes;
  meta: {
    /**
     *  Name of the modal.
     **/
    name: string;
  };
}

/**
 * A flux action with payload, meta (with property name) and type.
 * Payload from actionCreator `showModal` - totally replace stored props of modal if any.
 * Payload from actionCreator `updateModal` - will totally cleanup modal item state from redux
 * Payload from actionCreator `clickModal`  - will *not* be stored in redux and passed to the connected component
 * Payload from actionCreator `submitModal` - will *not* be stored in redux and passed to the connected component
 **/

export interface SagaModalAction<InitProps = {}> extends SagaModalCommonAction {
  /**
   * Object with props to store in redux store and pass to connected component.
   **/
  payload?: InitProps;
}

/**
 * Redux state of single modal item.
 * Action `hideModal` toggle isOpen, but keep props.
 * Action `showModal` payload replacing stored props of modal if any.
 * Action `updateModal` merge stored props of modal with payload.
 * Action `destroyModal` will totally cleanup modal item
 **/
export interface ModalItemState<InitProps = {}> {
  props: InitProps;
  isOpen: boolean;
}
/**
 * Redux state of all non-destroyed modals
 * See {@link ModalItemState}
 **/
export interface ModalsState {
  [name: string]: ModalItemState;
}

/**
 * @privateRemarks
 **/
export interface DefaultRootState {}

/**
 * @privateRemarks
 **/
export type AnyIfEmpty<T extends object> = keyof T extends never ? any : T;

/**
 * @privateRemarks
 **/
export type RootStateOrAny = AnyIfEmpty<DefaultRootState>;

/**
 * @privateRemarks
 * Redux state assumes that default modal reducer is mounted under the 'modals' key
 **/
export interface State extends RootStateOrAny {
  modals: ModalsState;
}
/*
 * An object whose values are partially applied action creators {@link ModalActionCreators}
 * wrapped into a `dispatch` call so they may be invoked directly.
 */
export type ModalDispatchActions = ReturnType<typeof createModalBoundActions>;

/**
 * a common type for action creators with payload and without payload (`hide` and `destroy`)
 */
export type ModalActionCreators =
  | (<P>(name: string, payload: P) => SagaModalAction<P>)
  | ((name: string) => SagaModalCommonAction);

/**
 * Props passed to decorator class
 *
 */
export interface ConnectModalProps<InitProps> extends ModalDispatchActions {
  modal: ModalItemState<InitProps>;
  /* An action creator to show *other* modal */
  showModal(name: string, payload: any): void;
  /* An action creator to update *other* modal */
  updateModal(name: string, payload: any): void;
  /* An action creator to submit *other* modal */
  submitModal(name: string, payload: any): void;
  /* An action creator to click *other* modal */
  clickModal(name: string, payload: any): void;
  /* An action creator to hide *other* modal */
  hideModal(name: string): void;
  /* An action creator to destroy *other* modal */
  destroyModal(name: string): void;
}

/**
 * Injected props will be passed to decorated component.
 * Methods show, hide, update, destroy, submit, click (See {@link ModalDispatchActions})
 * are already bound to the name passed into `sagaModal`.
 **/

export interface SagaModalInjectedProps extends ModalDispatchActions {
  /* whether component should be shown (derivered from redux-store) */
  isOpen: boolean;
  /* an object with just one property - the name of the modal */
  modal: {
    /**
     *  Name of the modal passed to `sagaModal` and `createModal`
     **/
    name: string;
  };
  /* Dispatch (See {@link showModal}) */
  showModal(name: string, payload: any): void;
  /* Dispatch (See {@link updateModal}) */
  updateModal(name: string, payload: any): void;
  /* Dispatch (See {@link submitModal}) */
  submitModal(name: string, payload: any): void;
  /* Dispatch (See {@link clickModal}) */
  clickModal(name: string, payload: any): void;
  /* Dispatch (See {@link hideModal}) */
  hideModal(name: string): void;
  /* Dispatch (See {@link destroyModal}) */
  destroyModal(name: string): void;
}

/**
 * @privateRemarks
 * A distributive version of Omit
 */
export type DistributiveOmit<
  PayloadProps,
  K extends keyof PayloadProps,
> = PayloadProps extends unknown ? Omit<PayloadProps, K> : never;

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

export type SagaModalGetProps<Comp> = Partial<
  DistributiveOmit<
    GetProps<Comp>,
    keyof Shared<SagaModalInjectedProps, GetProps<Comp>>
  >
>;

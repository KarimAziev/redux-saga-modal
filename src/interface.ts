import * as React from 'react';
import { ActionCreatorsMapObject, Action } from 'redux';
import { modalsStateSelector } from './selectors';
import * as actionsCreators from './actionsCreators';
import createModalBoundActions, {
  createModalActions,
} from './createModalActions';
import createModalPatterns from './createModalPatterns';

export interface ICreateModalParams {
  getModalsState: typeof modalsStateSelector;
}

export interface RenameActionsMap {
  showModal: 'show';
  hideModal: 'hide';
  destroyModal: 'destroy';
  updateModal: 'update';
  clickModal: 'click';
  submitModal: 'submit';
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

export interface State {
  modals: Record<string, ModalItemState>;
  [key: string]: any;
}

export interface Actions {
  [key: string]: () => void;
}

export interface SagaModalConfig {
  name: string;
  getModalsState?: (state: State) => State['modals'];
  destroyOnHide?: boolean;
  initProps?: {};
  actions?: ActionCreatorsMapObject;
  keepComponentOnHide?: boolean;
}
export interface ConnectModalHandlers {
  showModal(name: string, payload: any): void;
  updateModal(name: string, payload: any): void;
  submitModal(name: string, payload: any): void;
  clickModal(name: string, payload: any): void;
  hideModal(name: string): void;
  destroyModal(name: string): void;
}

export interface InjectedProps extends ConnectModalHandlers {
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
}

export interface ConnectModalMainProps extends ConnectModalHandlers {
  isSubmitted?: boolean;
  modal: ModalItemState;
}

export type ConnectModalProps = ConnectModalMainProps &
  ReturnType<typeof createModalBoundActions>;

// export interface IReduxSagaModalInjectedProps extends ConnectModalHandlers {
//   isOpen: boolean;
//   isSubmitted?: boolean;
//   modal: {
//     name: string;
//   };
// }
export type Omit<T, K extends keyof any> = T extends any
  ? Pick<T, Exclude<keyof T, K>>
  : never;

/**
 * `T extends ConsistentWith<T, U>` means that where `T` has overlapping properties with
 * `U`, their value types do not conflict.
 *
 * @internal
 */
export type ConsistentWith<DecorationTargetProps, InjectedProps> = {
  [P in keyof DecorationTargetProps]: P extends keyof InjectedProps
    ? InjectedProps[P] extends DecorationTargetProps[P]
      ? DecorationTargetProps[P]
      : InjectedProps[P]
    : DecorationTargetProps[P];
};

export type PropsOf<C> = C extends new (props: infer P) => React.Component
  ? P
  : C extends (props: infer P) => React.ReactElement<any> | null
  ? P
  : C extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[C]
  : never;

/**
 * All standard components exposed by `material-ui` are `StyledComponents` with
 * certain `classes`, on which one can also set a top-level `className` and inline
 * `style`.
 */

/**
 * a function that takes {component} and returns a component that passes along
 * all the props to {component} except the {InjectedProps} and will accept
 * additional {AdditionalProps}
 */
export type PropInjector<InjectedProps, AdditionalProps = {}> = <
  C extends React.ComponentType<ConsistentWith<PropsOf<C>, InjectedProps>>
>(
  component: C,
) => React.ComponentType<
  Omit<JSX.LibraryManagedAttributes<C, PropsOf<C>>, keyof InjectedProps> &
    AdditionalProps
>;

/**
 * Like `T & U`, but using the value types from `U` where their properties overlap.
 *
 * @internal
 */
export type Overwrite<T, U> = Omit<T, keyof U> & U;

export interface IReduxSagaModalInjectedComponent {
  <P extends InjectedProps>(
    component: React.ComponentType<any>,
  ): React.ComponentClass<Omit<P, keyof InjectedProps> & any>;
}

export interface ConnectModalState {
  isOpen?: boolean;
}

export type ModalActionCreators = typeof actionsCreators[keyof typeof actionsCreators];
export interface InjectedWrapperComponent {
  <P extends InjectedProps>(
    component: React.ComponentType<any>,
  ): React.ComponentClass<Omit<P, keyof InjectedProps> & any>;
}

export type ModalPatterns = ReturnType<typeof createModalPatterns>;
export type ModalPattern = ModalPatterns[keyof ModalPatterns];

export interface ModalHelpers {
  name: string;
  selector: (state: State) => ModalItemState;
  patterns: ReturnType<typeof createModalPatterns>;
  actions: ReturnType<typeof createModalActions>;
}

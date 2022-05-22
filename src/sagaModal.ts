import React, { Component } from 'react';
import { ActionCreatorsMapObject } from 'redux';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { modalSelector, modalsStateSelector } from './selectors';
import createModalActions from './createModalActions';
import * as actionsCreators from './actionsCreators';
import { isUndef } from './createModalPatterns';
import {
  ConnectModalProps,
  ConnectModalState,
  ReduxSagaModalInjectedComponent,
  RootStateOrAny,
} from './interface';

function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const hoistStatics = require('hoist-non-react-statics');

/**
 * Params to connect a component to Redux Store with HOC `sagaModal`.
 */
export interface SagaModalConfig<InitProps> {
  /**
   * Name of the modal. It should be the as the passed one to the `createModal`.
   */
  name: string;
  /**
   * Initial props for child component.
   */
  initProps?: InitProps;
  /**
   * Object whose values are custom action creator functions.
   */
  actions?: ActionCreatorsMapObject;
  /**
   * Whether to force render child component
   * @default false
   */
  keepComponentOnHide?: boolean;
  /**
   * Whether to dispach destroy action after hide. `keepComponentOnHide` should be false.
   * @default true
   */
  destroyOnHide?: boolean;
  /**
   * An optional custom selector that takes the Redux store and returns the slice with all modals.
   * By default, the reducer is mounted under the =modals= key.
   * @default (state) => state.modals
   */
  getModalsState?: typeof modalsStateSelector;
}

/**
 * Creates a decorator to connect the modal component to Redux.
 * @param config - See {@link SagaModalConfig} for details.
 *
 * @returns a higher-order component that takes a modal component and returns a connected one with injected props
 *
 * @example
 * const confirmModal = createModal("CONFIRM_MODAL");
 * export const ConfirmModal = sagaModal({
 *   name: confirmModal.name,
 *   initProps: {
 *     title: 'Some default title',
 * },
 *   actions: { loadData },
 * })(ConfirmDialogComponent);

 */
const sagaModal = <InitProps>({
  name,
  initProps,
  destroyOnHide = true,
  keepComponentOnHide = false,
  actions = {},
  getModalsState,
}: SagaModalConfig<InitProps>): ReduxSagaModalInjectedComponent => (
  ModalComponent,
) => {
  const selector = modalSelector(name, getModalsState);
  class ConnectedModal extends Component<ConnectModalProps, ConnectModalState> {
    static displayName = `ConnectedModal(${getDisplayName(ModalComponent)})`;
    state = {
      isOpen: this.props.modal.isOpen,
    };

    componentDidUpdate(prevProps: ConnectModalProps) {
      const { modal } = this.props;
      const { isOpen } = modal;
      const isToggled = isOpen !== prevProps.modal.isOpen;

      if (isToggled) {
        this.setState({ isOpen });
      }

      if (isOpen === false && destroyOnHide && !keepComponentOnHide) {
        this.props.destroy();
      }
    }

    componentWillUnmount() {
      const {
        modal: { isOpen },
      } = this.props;

      if (isOpen) {
        this.props.hide();
      }

      if (isOpen && destroyOnHide) {
        this.props.destroy();
      }
    }

    render() {
      const { isOpen } = this.state;
      const { modal, ...rest } = this.props;
      if (isUndef(isOpen) || (isOpen === false && !keepComponentOnHide)) {
        return null;
      }

      return React.createElement(ModalComponent, {
        ...rest,
        ...modal.props,
        modal: {
          name: name,
        },
        isOpen: isOpen,
      });
    }
  }

  const mapStateToProps = (state: RootStateOrAny) => ({
    ...initProps,
    modal: selector(state) || {},
  });

  const mapDispatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators(actions, dispatch),
    ...bindActionCreators(actionsCreators, dispatch),
    ...createModalActions(name, dispatch),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(hoistStatics(ConnectedModal, ModalComponent) as any);
};

export default sagaModal;

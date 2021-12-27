import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect, RootStateOrAny } from 'react-redux';
import { modalSelector } from './selectors';
import createModalActions from './createModalActions';
import * as actionsCreators from './actionsCreators';
import { isUndef } from './createModalPatterns';
import {
  SagaModalConfig,
  ConnectModalProps,
  ConnectModalState,
  IReduxSagaModalInjectedComponent,
} from './interface';

function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
const hoistStatics = require('hoist-non-react-statics');

/**
* High order component which connects a component to Redux Store.
* @param SagaModalConfig - configuration
* @param SagaModalConfig.name - an uniq name of the modal
* @param SagaModalConfig.initProps - initial props for child component
* @param SagaModalConfig.actions - additional actionCreatorsMapObject to pass into child component
* @param SagaModalConfig.getModalsState - An optional custom selector that takes the Redux store
and returns the slice with all modals
* @param SagaModalConfig.destroyOnHide - whether to destroy modal on unmount. Default value is true
* @param SagaModalConfig.keepComponentOnHide - whether to force render child components. Default value is false
* @returns a function that accepts react component
* @example
```
export const ConfirmModal = sagaModal({
  name: 'CONFIRM_MODAL',
  initProps: {
    title: 'Some default title',
},
  actions: { loadData },
})(ConfirmDialogComponent);
```
*/
const sagaModal = <InitProps>({
  name,
  getModalsState,
  initProps,
  actions = {},
  destroyOnHide = true,
  keepComponentOnHide = false,
}: SagaModalConfig<InitProps>): IReduxSagaModalInjectedComponent => (
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

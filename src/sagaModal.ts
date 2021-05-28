import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { modalsStateSelector } from './selectors';
import createModalActions from './createModalActions';
import * as actionsCreators from './actionsCreators';
import { isUndef } from './createModalPatterns';
import {
  SagaModalConfig,
  ConnectModalProps,
  ConnectModalState,
} from './interface';

const initialState = {};
function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
const hoistStatics = require('hoist-non-react-statics');

const sagaModal = <T extends ConnectModalProps>({
  name,
  getModalsState = modalsStateSelector,
  initProps = initialState,
  actions = {},
  destroyOnHide = true,
  keepComponentOnHide = false,
}: SagaModalConfig) => (ModalComponent: React.ComponentType<T>) => {
  class ConnectedModal extends Component<T, ConnectModalState> {
    static propTypes = {
      modal: PropTypes.object.isRequired,
    };
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

  const mapStateToProps = (state: any) => ({
    ...initProps,
    modal: getModalsState(state)[name] || initialState,
  });

  const mapDispatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators(actions, dispatch),
    ...bindActionCreators(actionsCreators, dispatch),
    ...createModalActions(name, dispatch),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(hoistStatics(ConnectedModal, ModalComponent));
};

export default sagaModal;

import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { modalsStateSelector } from './selectors';
import createModalBoundActions from './createModalActions';
import {
  showModal,
  hideModal,
  clickModal,
  updateModal,
  destroyModal,
  submitModal,
} from './actionsCreators';
import { SagaModalConfig, State, ConnectModalState } from './interface';

const initialState = {};

export const sagaModal = ({
  name,
  getModalsState = modalsStateSelector,
  initProps = initialState,
  actions = {},
  destroyOnHide = true,
  keepComponentOnHide = false,
}: SagaModalConfig) => (WrappedComponent: React.ComponentType) => {
  const hoistNonReactStatics = require('hoist-non-react-statics');
  const mapStateToProps = (state: State) => ({
    ...initProps,
    modal: getModalsState(state)[name] || initialState,
  });

  const mapDispatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators(actions, dispatch),
    ...bindActionCreators(
      {
        showModal,
        hideModal,
        clickModal,
        updateModal,
        destroyModal,
        submitModal,
      },
      dispatch,
    ),
    ...createModalBoundActions(name, dispatch),
  });

  type MapStateToProps = ReturnType<typeof mapStateToProps>;
  type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>;
  type HocProps = MapDispatchToProps & MapStateToProps;

  class ConnectedModal extends React.Component<HocProps, ConnectModalState> {
    static displayName = `ConnectModal(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      name ||
      'Component'})`;

    static propTypes = {
      modal: PropTypes.object.isRequired,
    };

    state = {
      isOpen: this.props.modal.isOpen,
    };

    componentDidUpdate(prevProps: HocProps) {
      const { isOpen } = this.props.modal;
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

      if (isOpen === undefined || (isOpen === false && !keepComponentOnHide)) {
        return null;
      }

      return React.createElement(WrappedComponent, {
        ...rest,
        ...modal.props,
        modal: {
          name: name,
        },
        isOpen: isOpen,
      });
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(hoistNonReactStatics(ConnectedModal, WrappedComponent));
};

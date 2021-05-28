import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
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
import {
  SagaModalConfig,
  State,
  ConnectModalState,
  SagaModalInjectedProps,
} from './interface';

const initialState = {};

const hoistNonReactStatics = require('hoist-non-react-statics');

export default function<T extends SagaModalInjectedProps>({
  name,
  getModalsState = modalsStateSelector,
  initProps = initialState,
  actions = {},
  destroyOnHide = true,
  keepComponentOnHide = false,
}: SagaModalConfig) {
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

  return (WrappedComponent: React.ComponentType<T>) => {
    class ConnectedModal extends React.Component<HocProps, ConnectModalState> {
      static displayName = `ConnectedSagaModal(${WrappedComponent?.displayName ||
        WrappedComponent.name ||
        name ||
        'Component'})`;

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

        if (!isOpen && !keepComponentOnHide) {
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
    )(
      hoistNonReactStatics(
        ConnectedModal,
        WrappedComponent,
      ) as React.ComponentClass<HocProps, ConnectModalState>,
    );
  };
}

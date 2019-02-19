// @flow
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import type { BindActionCreators, Dispatch, Store } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import hoistStatics from 'hoist-non-react-statics';
import { getDisplayName } from './lib';
import { modalSelector } from './selectors';
import type {
  ConnectModalProps,
  ConnectModalState,
  Config,
  ReduxContext,
  ReduxModalState,
  ModalState,
  InjectedProps,
  ModalOwnProps,
  ModalComponentMethods,
} from './flow-types';

const initialState: ModalState = { props: {} };

const sagaModal = ({
  name,
  getModalsState,
  initProps = initialState,
}: Config) => (ModalComponent: React.ComponentType<ModalOwnProps>) => {
  class ConnectedModal extends React.Component<
    ConnectModalProps,
    ConnectModalState
  > {
    static propTypes: {
      modal: ReduxModalState,
      displayName: string,
    } = {
      modal: PropTypes.object.isRequired,
      displayName: PropTypes.string,
    };
    static displayName = `ConnectModal(${getDisplayName(ModalComponent)})`;
    static contextTypes: ReduxContext = {
      store: PropTypes.object.isRequired,
    };

    state: ModalState = {
      isOpen: !!this.props.modal.isOpen,
    };

    componentDidUpdate(prevProps) {
      const { isOpen } = this.props.modal;
      const isToggled = isOpen !== prevProps.modal.isOpen;

      if (isToggled) {
        this.setState({ isOpen });
      }
    }

    hide = () => this.props.hideModal(name);

    click = (value) => this.props.clickModal(name, value);

    update = (newProps) => this.props.updateModal(name, newProps);
    show = (props) => this.props.showModal(name, props);
    destroy = () => this.props.destroyModal(name);
    getCurriedActions = (): ModalComponentMethods => ({
      hide: this.hide.bind(this),
      click: this.click.bind(this),
      update: this.update.bind(this),
      show: this.show.bind(this),
      destroy: this.destroy.bind(this),
    });
    render(): React.Node {
      const { isOpen } = this.state;
      const { modal, ...ownProps } = this.props;
      if (!isOpen) {
        return null;
      }

      const props: InjectedProps = {
        ...ownProps,
        ...modal.props,
        ...this.getCurriedActions(),
        isOpen: isOpen,
        modal: {
          name,
        },
      };

      const modalComp = React.createElement(ModalComponent, props);
      return modalComp;
    }
  }

  const mapStateToProps = (state: Store) => ({
    ...initProps,
    modal: modalSelector(name, getModalsState)(state) || initialState,
  });

  const mapDispatchToProps: BindActionCreators = (dispatch: Dispatch) => ({
    ...bindActionCreators(
      {
        ...actions,
      },
      dispatch
    ),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(hoistStatics(ConnectedModal, ModalComponent));
};

export default sagaModal;

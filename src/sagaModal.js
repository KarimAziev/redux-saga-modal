import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import hoistStatics from 'hoist-non-react-statics';
import { getDisplayName } from './utils';
import { modalsStateSelector } from './selectors';
import createModalActions from './createModalActions';
import renameActionsMap from './renameActionsMap';
import * as is from '@redux-saga/is';

const initialState = {};

const sagaModal = ({
  name,
  getModalsState = modalsStateSelector,
  initProps = initialState,
  actions = {},
  destroyOnHide = true,
  keepComponentOnHide = false,
}) => ModalComponent => {
  class ConnectedModal extends Component {
        static propTypes = {
          modal: PropTypes.object.isRequired,
        };
        static displayName = `ConnectedModal(${getDisplayName(
          ModalComponent,
          name
        )})`;
        static contextTypes = {
          store: PropTypes.object.isRequired,
        };

        state = {
          isOpen: this.props.modal.isOpen,
        };

        componentDidUpdate(prevProps) {
          const { modal } = this.props;
          const { isOpen } = modal;
          const isToggled = isOpen !== prevProps.modal.isOpen;
          if (isToggled) {
            this.setState({ isOpen });
          } 

          if (isOpen === false && destroyOnHide) {
            this.props.destroy();
          }

        }

        render() {
          const { isOpen } = this.state;
          const { modal, ...ownProps } = this.props;

          if (is.undef(isOpen)) {
            return null;
          }


          const props = {
            ...ownProps,
            ...modal.props,
            modal: {
              name: modal.name,
            },
            isOpen: isOpen,
          };

          return React.createElement(ModalComponent, props);
        }
  }

  const mapStateToProps = state => ({
    ...initProps,
    modal: getModalsState(state)[name] || initialState,
  });

  const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators(actions, dispatch),
    ...createModalActions(name, null, dispatch),
    ...createModalActions(name, renameActionsMap, dispatch),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(hoistStatics(ConnectedModal, ModalComponent));
};

export default sagaModal;

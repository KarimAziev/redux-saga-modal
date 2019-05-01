// @flow
import * as React from 'react';
import * as PropTypes from 'prop-types';
import type { BindActionCreators, Dispatch, Store } from 'redux';
import { connect } from 'react-redux';
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
} from './flow-types';
import { bindModalActionCreators } from './utils';
import { actionsCreators } from './actions';

const initialState: ModalState = { props: {} };

const sagaModal = ({
  name,
  getModalsState,
  initProps = initialState,
}) => ModalComponent => {
  const ConnectedModal = ({ modal, ...rest }) =>
    !modal.isOpen
      ? null
      : React.createElement(ModalComponent, {
        ...rest,
        ...modal.props,
        isOpen: modal.isOpen,
        modal: {
          name,
        },
      });
  const mapStateToProps = (state: Store) => ({
    ...initProps,
    modal: modalSelector(name, getModalsState)(state) || initialState,
  });

  const mapDispatchToProps: BindActionCreators = (dispatch: Dispatch) => ({
    ...bindModalActionCreators(
      {
        ...actionsCreators,
      },
      dispatch,
      name
    ),
  });
  ConnectedModal.displayName = `ConnectModal(${getDisplayName(
    ModalComponent
  )})`;

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(hoistStatics(ConnectedModal, ModalComponent));
};

export default sagaModal;

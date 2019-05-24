// @flow
import * as React from 'react';
import * as PropTypes from 'prop-types';
import type { BindActionCreators, Dispatch, Store } from 'redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import hoistStatics from 'hoist-non-react-statics';
import { getDisplayName } from './lib';
import { modalSelector } from './selectors';
import type { ModalState } from './flow-types';
import createModalActions from './helpers/createModalActions';
import * as defaults from './defaults';
import * as is from '@redux-saga/is';

const initialState: ModalState = {
  props: {},
};


const sagaModal = ({
  name,
  getModalsState,
  initProps = initialState,
  actions = {},
  destroyOnHide = true,
  keepComponentOnHide = false,
  renameMap = defaults.renameActionsMap,
}) => ModalComponent => {
  const ConnectedModal = ({ modal, ...rest }) => (
    modal.isOpen || (keepComponentOnHide && is.undef(modal.isOpen))
      ? React.createElement(ModalComponent, {
        ...rest,
        ...modal.props,
        isOpen: modal.isOpen,
        modal: {
          name,
          destroyOnHide,
        },
      })
      : null
  );
  

  const mapStateToProps = (state: Store) => ({
    ...initProps,
    modal: modalSelector(name, getModalsState)(state) || initialState,
  });

  const mapDispatchToProps: BindActionCreators = (dispatch: Dispatch) => ({
    ...bindActionCreators(actions, dispatch),
    ...createModalActions(name, null, dispatch),
    ...createModalActions(name, renameMap, dispatch),
  });
  ConnectedModal.displayName = `ConnectModal(${getDisplayName(
    ModalComponent
  )})`;

  ConnectedModal.propTypes = {
    modal: PropTypes.object.isRequired,
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(hoistStatics(ConnectedModal, ModalComponent));
};

export default sagaModal;

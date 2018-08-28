import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import hoistStatics from 'hoist-non-react-statics';
import { getDisplayName } from './utils';
import { modalsStateSelector } from './selectors';

const initialState = {};

const sagaModal = ({ 
  name, 
  saga, 
  getModalsState = modalsStateSelector, 
  initProps = initialState, 
}) => (
  ModalComponent => {
    class ConnectedModal extends Component {
      static propTypes = {
        modal: PropTypes.object.isRequired,
      };
      static displayName = `ConnectedModal(${getDisplayName(ModalComponent, name)})`;
      static contextTypes = {
        store: PropTypes.object.isRequired,
      };

      state = {
        isOpen: !!this.props.modal.isOpen,
      };

      componentDidMount() {
        const payload = { 
          name, 
          saga, 
          props: this.getProps(), 
          isOpen: this.state.isOpen,
          context: {
            ...this.getCurriedActions(),
            name,
          },
        };
   
        this.props.forkModal(payload);
      }

      componentDidUpdate(prevProps) {
        const { modal } = this.props;
        if (modal.isOpen !== prevProps.modal.isOpen ) {
          this.setState({ isOpen: modal.isOpen });
        }
      }

      hide = () => {
        this.props.hideModal(name);
      };

      show = (payload) => {
        this.props.showModal(name, payload);
      }

      click = (value) => {
        this.props.clickModal(name, value);
      };

      update = (newProps) => {
        this.props.updateModal(name, newProps);
      }

      getProps = () => {
        const { modal, ...ownProps } = this.props;

        return ({
          ...ownProps,
          ...modal.props,
        })
      }

      getCurriedActions() {
        return Object.freeze({
          show: this.show.bind(this),
          hide: this.hide.bind(this),
          click: this.click.bind(this),
          update: this.update.bind(this),
        })
      }

      render() {
        const { isOpen } = this.state;

        if (!isOpen) {
          return null;
        }
        const props = {
          ...this.getProps(),
          ...this.getCurriedActions(),
          isOpen: isOpen,
        }
        const Modal = isOpen
          ? React.createElement(ModalComponent, props)
          : null;

        return Modal;
      }
    }
    
    const mapStateToProps = state => ({
      ...initProps,
      modal: getModalsState(state)[name] || initialState,
    });

    const mapDispatchToProps = dispatch => 
      ({ ...bindActionCreators({ 
        ...actions,
      }, dispatch) })


    return connect(mapStateToProps, mapDispatchToProps)(
      hoistStatics(ConnectedModal, ModalComponent)
    );
  }
)

export default sagaModal;
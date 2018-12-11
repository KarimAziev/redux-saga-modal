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


      componentDidUpdate(prevProps) {
        const { modal } = this.props;
        const { isOpen } = modal;
        const isToggled = isOpen !== prevProps.modal.isOpen;
        if (isToggled ) {
          this.setState({ isOpen });
        }
      }

      hide = () => {
        this.props.hideModal(name);
      };

      click = (value) => this.props.clickModal(name, value);

      update = (newProps) => this.props.updateModal(name, newProps);

      getCurriedActions() {
        return Object.freeze({
          hide: this.hide.bind(this),
          click: this.click.bind(this),
          update: this.update.bind(this),
        })
      }

      render() {
        const { isOpen } = this.state;
        const { modal, ...ownProps } = this.props;
        
        if (!isOpen) {
          return null;
        }

        const props = {
          ...ownProps,
          ...modal,
          ...this.getCurriedActions(),
          isOpen: isOpen,
        }

        return React.createElement(ModalComponent, props);
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
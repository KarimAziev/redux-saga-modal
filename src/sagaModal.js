import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import hoistStatics from 'hoist-non-react-statics';
import { getDisplayName, omitFunctions } from './utils';
import { modalsStateSelector } from './selectors';

const initialState = {};

const sagaModal = ({ 
  name, 
  saga, 
  getModalsState = modalsStateSelector, 
  initProps = initialState, 
  destroyOnUnmount = true,
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
          
          const payload = !modal.saga && isOpen 
            ? this.createSagaProps(modal)
            : null;

          if (payload) {
            this.fork(payload);
          }
          this.setState({ isOpen });
        }
      }
      
      createSagaProps = (modal) => ({ 
        name, 
        ...omitFunctions(this.getProps()), 
        saga: saga ? saga : this.props.saga, 
        isOpen: modal.isOpen,
        context: {
          ...this.getCurriedActions(),
          name,
        },
      });

      fork = payload => this.props.forkModal.bind(this)(name, payload);
      hide = () => {
        this.props.hideModal(name);
        if (destroyOnUnmount) {
          this.props.destroyModal(name);
        }
      };

      show = (payload) => this.props.showModal(name, payload);

      click = (value) => this.props.clickModal(name, value);

      update = (newProps) => this.props.updateModal(name, newProps);

      getProps = () => {
        const { modal, ...ownProps } = this.props;

        return ({
          ...ownProps,
          ...modal,
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
          saga: saga ? saga : this.props.saga,
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
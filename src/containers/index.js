import React, { Component } from 'react';
import ModalWrapper from 'react-modal';
import defaultStyles from './styles';
import * as actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { 
  inizializeModal,
 } from '../actions';
import { 
  modalsKeysSelector,
  modalsReducerSelector,
  isModalsInittedSelector,
  modalDataSelector,
 } from '../selectors';

const mapStateToProps = (state, props) => ({
  modalsKeys: modalsKeysSelector(state),
  modalsData: modalsReducerSelector(state),
  isInitted: isModalsInittedSelector(state, props),
  modalSelector: modalDataSelector(state, props),
});


const mapDispatchToProps = dispatch => bindActionCreators(
  {
    inizializeModal,
    dispatch,
  }, dispatch
);


class ModalsInvoker extends Component {
  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
    this.renderChild = this.renderChild.bind(this);
  }
  
  componentDidMount() {
    React.Children.forEach(this.props.children, ({ key, props }) => {
      const saga = props.saga;
      this.props.inizializeModal(key, saga);
    });
  }

  render() {
    const {
      isInitted,
      style,
    } = this.props;

    const children = isInitted ? this.renderChildren() : null;
    const mainChild = isInitted && children[0];

    return (
      <ModalWrapper
        contentLabel={mainChild ? mainChild.key : 'empty'}
        style={style || defaultStyles}
        isOpen={!!mainChild} >
        {children}
      </ModalWrapper>
    );
  }
  
  renderChildren() {
    const { 
      children, 
      modalSelector,
     } = this.props;
     
    return React.Children.map(children, child => {
      const { key } = child;
      const reducer = modalSelector(key);
      const error = !React.isValidElement(child) 
        ? 'Invalid child. Modals-Saga children must be React element' 
        : !key 
        ? `Each child of Modals-Saga should have an unique "key" prop`
        : null;
        
      if (error) {
        throw new Error(error);
      }  

      const data = Object.assign(
        { isOpen: reducer.isOpen},
        child.props,
        reducer.props,
      )

      return data.isOpen ? this.renderChild(child, data) : null;

    });
  }
  
  renderChild(child, data) {
    const { dispatch, showModal } = this.props;
    const { key: modalKey } = child;
    
    const props = Object.assign({ showModal }, data)
    
    const bindModalKey = actionKey => {
      const action = actions[actionKey];
      props[actionKey] = (payload) => dispatch(action(modalKey, payload));
    };
    
    Object.keys(actions)
      .filter(actionKey => !props[actionKey])
      .forEach(bindModalKey);
      
    const component = React.cloneElement(child, Object.assign({
      isOpen: true,
      key: modalKey }, props
    ));

    return React.isValidElement(component) ? component : null;
  }
}

export default ModalsInvoker;


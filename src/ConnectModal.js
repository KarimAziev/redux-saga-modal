import React, { Component } from 'react';
import ModalWrapper from 'react-modal';
import defaultStyles from './styles';
import * as actions from './actions';

class ModalsInvoker extends Component {
  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
  }
  
  componentDidMount() {
    const { 
      dispatch, 
      children, 
      reducer,
    } = this.props;
    
    React.Children.forEach(children, ({ key, props }) => {
      const saga = props.saga;
      
      if (saga && !reducer[key]) {
        dispatch(actions.inizializeModal(key, saga));
      }
    });
  }
  
  renderChildren(children) {
    const { 
      reducer,
      dispatch,
      wrapperStyle,
    } = this.props;
     
    const modalReducerSelector = key => reducer[key] || {};
    
    return React.Children.map(children, child => {
      const { key } = child;
      
      const modalProps = modalReducerSelector(key);

      if (!React.isValidElement(child) ) {
        return null;
      }  
      
      const updatedProps = {
        ...child.props, 
        ...modalProps, 
        showModal: (newKey, payload) => dispatch(actions.showModal(newKey, payload)),
      };
      
      const bindModalKey = actionKey => {
        const action = actions[actionKey];
        updatedProps[actionKey] = (payload) => dispatch(action(key, payload));
      };
      
      Object.keys(actions)
        .filter(actionKey => !updatedProps[actionKey])
        .forEach(bindModalKey);
      
      const Modal = React.cloneElement(child, 
        { ...updatedProps, key })

      return (
        <ModalWrapper
          contentLabel={Modal.props.key}
          style={wrapperStyle || defaultStyles}
          ariaHideApp={false}
          isOpen={Modal.props.isOpen} >
          { Modal }
        </ModalWrapper>
      )
    });
  }
  

  render() {
    const { children } = this.props;

    return (
      <span>
        {this.renderChildren(children)}
      </span>
    );
  }
}

export default ModalsInvoker;



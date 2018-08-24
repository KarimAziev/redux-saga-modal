import React, { Component } from 'react';
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
    
    React.Children.forEach(children, ({ props }) => {
      const { saga, name } = props;

      if (saga && !reducer[name]) {
        dispatch(actions.inizializeModal(name, saga, props));
      }
    });
  }
  
  renderChildren(children) {
    const { 
      reducer,
      dispatch,
    } = this.props;
     
    const modalReducerSelector = name => reducer[name] || {};
    
    return React.Children.map(children, child => {
      const { name } = child.props;
      
      const modalProps = modalReducerSelector(name);

      if (!React.isValidElement(child) ) {
        return null;
      }  
      
      const updatedProps = {
        ...child.props, 
        ...modalProps.props, 
        isOpen: modalProps.isOpen,
        showModal: (newKey, payload) => dispatch(actions.showModal(newKey, payload)),
        clickModal: (value) => dispatch(actions.clickModal(name, value)),
      };
      
      const bindModalKey = actionName => {
        const action = actions[actionName];
        updatedProps[actionName] = (payload) => dispatch(action(name, payload));
      };

      Object.keys(actions)
        .filter(actionName => !updatedProps[actionName])
        .forEach(bindModalKey);
      
      const modal = React.cloneElement(child, updatedProps)
      
      return modal;
    });
  }
  

  render() {
    const children = this.renderChildren(this.props.children);
    return children;
  }
}

export default ModalsInvoker;



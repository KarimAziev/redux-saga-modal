import React, { Component } from 'react';
import ModalWrapper from 'react-modal';
import defaultStyles from './styles';
import * as actions from '../actions';
import { 
  showModal,
  inizializeModal,
 } from '../actions';


class ModalsInvoker extends Component {

  componentDidMount() {
    const { dispatch } = this.props;

/*     React.Children.forEach(this.props.children, ({ key, props }) => {
      const saga = props.saga;
      this.props.inizializeModal(key, saga);
    }); */
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
        { isOpen: reducer.isOpen },
        child.props,
        reducer.props,
      )

      return data.isOpen ? this.renderChild(child, data) : null;

    });
  }
  
  renderChild(child, data) {
    const { dispatch } = this.props;
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
      key: modalKey, 
    }, props
    ));

    return React.isValidElement(component) ? component : null;
  }

  render() {
    const {
      isInitted = true,
      style,
    } = this.props;
    console.log('ModalsInvoker props', this.props);
    const { children } = this.props;
  
    return (
      <ModalWrapper
        contentLabel={'empty'}
        style={defaultStyles}
        isOpen={true} >
        {this.props.children}
      </ModalWrapper>
    );
  }
  

}


export default ModalsInvoker;



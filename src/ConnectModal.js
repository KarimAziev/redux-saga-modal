import React, { Component } from 'react';
import ModalWrapper from 'react-modal';
import defaultStyles from './styles';
import * as actions from './actions';
import { 
  showModal,
  inizializeModal,
 } from './actions';
import ReactDOM from 'react-dom';

class ModalsInvoker extends Component {
  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);

    this.state = {
      isInitted: false,
      isOpen: false,
    }
  }
  
  componentDidMount() {
    const { dispatch, children } = this.props;
    const { isInitted } = this.state;
    
    React.Children.forEach(children, ({ key, props }) => {
      const saga = props.saga;
      if (saga && !this[key] && !isInitted) {
        dispatch(inizializeModal(key, saga));
        this[key] = ({ ...props, key });
        
      }
    });

    this.setState({ 
      isInitted: true, 
    })
    
  }
  
  renderChildren() {
    const { 
      children, 
      reducer,
      dispatch,
     } = this.props;
    const modalSelector = key => reducer && reducer[key] || {};
    return React.Children.map(children, child => {
      const { key } = child;
      const reducerData = modalSelector(key);

      if (!React.isValidElement(child) ) {
        return null;
      }  
      const newProps = reducerData && reducerData.props ? reducerData.props : {};
      
      const data = {
        ...child.props, 
        ...newProps,
        ...showModal,
        isOpen: reducerData.isOpen, 
      };
      
      const bindModalKey = actionKey => {
        const action = actions[actionKey];
        data[actionKey] = (payload) => dispatch(action(key, payload));
      };
      
      Object.keys(actions)
        .filter(actionKey => !data[actionKey])
        .forEach(bindModalKey);
        
      const element = React.cloneElement(child, { ...data, key });

      return !element.props.wrapper 
        ? <ModalWrapper
            contentLabel={element.props.key}
            style={defaultStyles}
            ariaHideApp={false}
            isOpen={data.isOpen} >
            {element}
          </ModalWrapper>
        : element
    });
  }
  

  render() {
    const {
 
    } = this.props;
    console.log('this.props', this.props);
    const { isInitted } = this.state;
    const children = isInitted ? this.renderChildren() : null;

    return (
      <span>
      { children }
      </span>
    );
  }
}


export default ModalsInvoker;



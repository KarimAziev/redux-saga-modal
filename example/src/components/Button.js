import * as React from 'react';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';

const Button = (props) => {
  const {
    onClick,
    children,
    ...rest
  } = props;
 
  return (
    <AwesomeButton 
      size="medium"
      action={onClick}
      {...rest}>
      {children}
    </AwesomeButton>
  )
}

Button.displayName = 'Button';

export default Button;
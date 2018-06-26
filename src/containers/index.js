import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import view from './view';
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


const Modals = connect(mapStateToProps, mapDispatchToProps)(view);

export default Modals;

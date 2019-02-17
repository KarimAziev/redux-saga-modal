import React, { Component } from 'react';
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { showModal } from 'redux-saga-modal';
import { Button } from './components';
import { Confirm } from './components/Modals';
class App extends Component {

  render() {

    return (
      <div className="App">
        <header className="App-header" />
        <Button onClick={() => this.props.showModal('confirmModal')}>
          Confirm Modal
        </Button>
        <Confirm />
      </div>
    );
  }
}

const mapStateToProps = state => ({ modals: state.modals });

const mapDispatchToProps = dispatch => bindActionCreators(
  { 
    showModal,
  }, dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
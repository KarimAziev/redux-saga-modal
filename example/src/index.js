import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';
import DevTools from './devTools';
import { createLogger } from 'redux-logger';
import reducer from './reducer';
import rootSaga from './saga';

const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();

const connectReducer = compose(
  applyMiddleware(logger, sagaMiddleware),
  DevTools.instrument()
)(createStore);

const store = {
  ...connectReducer(reducer),
  runSaga: sagaMiddleware.run(rootSaga),
};

const render = (RootApp) =>
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <App />
        <DevTools />
      </div>
    </Provider>,
    document.getElementById('root')
  );

render(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

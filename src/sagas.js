
import { fork, put, all, takeLatest } from 'redux-saga/effects';
import actionTypes from './actionTypes';
import * as actions from './actions';
import { checkActionType, checkModalName, takeModalClick } from './lib';

export default function* rootModalSaga(config = {}) {
  const names = Object.keys(config);

  try {
    yield all(names.map(name => {
      const saga = config[name];
      
      const filters = action => 
        checkActionType([actionTypes.SHOW_MODAL, actionTypes.HIDE_MODAL])(action) && 
        checkModalName(name)(action);

      
    
      return takeLatest(filters, function* forker (action) {
        const { type, payload } = action;
        if (type === actionTypes.HIDE_MODAL) {
          return;
        }

        const context = {
          name,
          update: (props) => put(actions.updateModal(name, props)),
          hide: () => put(actions.hideModal(name)),
          takeClick: (value) => takeModalClick(name, value),
        };
        
        yield fork([context, saga], payload);
      })
      
    }))
  } catch (error) {
    console.error('ERROR IN @@REDUX-SAGA-MODAL', error)
  }
}


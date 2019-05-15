import { put, select } from 'redux-saga/effects';
import { modalSelector, modalsStateSelector } from './selectors';
import { getBoundModalActions } from './utils';
import * as defaults from './defaults';



export default function createModalEffects(modalName, params) {  
    const config = {
      getModalsState: modalsStateSelector,
      renameMap: defaults.renameActionsMap,
      ...params,
    };
    
    const selector = config.selector || modalSelector(modalName, config.getModalsState);
    const effects = getBoundModalActions(modalName, put, config.renameMap);
    effects.select = () => select(selector);
    
    return effects;
  }
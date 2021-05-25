import { put, select } from 'redux-saga/effects';
import { modalSelector, modalsStateSelector } from './selectors';
import createBoundModalActions from './createModalActions';
import createModalPatterns, { createTakePatterns } from './createModalPatterns';
import { ICreateModalParams } from './interface';

export interface ICreateModalEffectsParams {
  getModalsState?: ICreateModalParams['getModalsState'];
  selector: ReturnType<typeof modalSelector>;
  patterns: ReturnType<typeof createModalPatterns>;
}

export function createPutEffects(modalName: string) {
  return createBoundModalActions(modalName, put as Function);
}

export default function createModalEffects(
  modalName: string,
  params: ICreateModalEffectsParams,
) {
  const config = {
    getModalsState: modalsStateSelector,
    ...params,
  };

  const selector =
    config.selector || modalSelector(modalName, config.getModalsState);

  const takeEffects = createTakePatterns(modalName);
  return {
    ...takeEffects,
    ...createPutEffects(modalName),
    select: () => select(selector),
  };
}

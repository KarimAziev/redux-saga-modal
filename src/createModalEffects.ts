import { put, select, take } from 'redux-saga/effects';
import { Action } from 'redux';
import { modalSelector, modalsStateSelector } from './selectors';
import createBoundModalActions from './createModalActions';
import createModalPatterns, { renameActionsMap } from './createModalPatterns';
import { ICreateModalEffectsParams, TakePatterns } from './interface';

export function createTakeEffects(
  modalName: string,
  mappedPatterns?: Record<keyof typeof renameActionsMap, (a?: any) => any>,
) {
  const patterns = mappedPatterns || createModalPatterns(modalName);
  const takePatterns = {
    takeShow: patterns.show,
    takeUpdate: patterns.update,
    takeClick: patterns.click,
    takeDestroy: patterns.destroy,
    takeSubmit: patterns.submit,
    takeHide: patterns.hide,
  };
  return Object.keys(takePatterns).reduce((acc, key) => {
    const pattern = takePatterns[key];
    const effect = (payloadPattern?: any) =>
      take((action: Action) => {
        if (payloadPattern) {
          return pattern(payloadPattern)(action);
        }
        return pattern(action);
      });

    acc[key] = effect;
    return acc;
  }, {} as TakePatterns);
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

  const takeEffects = createTakeEffects(
    modalName,
    config.patterns as Record<keyof typeof renameActionsMap, (p?: any) => any>,
  );
  return {
    ...takeEffects,
    ...createPutEffects(modalName),
    select: () => select(selector),
  };
}

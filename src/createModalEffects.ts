import { put, select, take, PutEffect } from 'redux-saga/effects';
import { Action } from 'redux';
import { modalSelector, modalsStateSelector } from './selectors';
import * as actionsCreators from './actionsCreators';
import {
  ICreateModalEffectsParams,
  TakePatterns,
  ModalActionCreators,
  SagaModalAction,
  SagaModalCommonAction,
} from './interface';
import createModalPatterns, { renameActionsMap } from './createModalPatterns';

const {
  showModal,
  hideModal,
  clickModal,
  updateModal,
  destroyModal,
  submitModal,
} = actionsCreators;

/**
 * Creates high order `take` effects creators.
 * The result of every creator is `take` with predicate to match a corresponding modal action.
 * You can also pass payloadPattern to perfoms addiotonal checks for action's payload,
 */
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

export function bindPutEffect<A extends ModalActionCreators>(
  actionCreator: A,
  name: string,
) {
  return function<P = {}>(payload: P): PutEffect<SagaModalAction<P>> {
    return put(actionCreator.apply(undefined, [name, payload]));
  };
}

export function bindPutEffectWithoutPayload<A extends ModalActionCreators>(
  actionCreator: A,
  name: string,
) {
  return function(): PutEffect<SagaModalCommonAction> {
    return put(actionCreator.apply(undefined, [name]));
  };
}
/**
 * Creates high order `put` effects creators.
 * The result of every creator is `put` with one of the modal action.
 * @param name - name of the modal
 * @returns an object with properties `show`, `update`, `click`, `submit`, `hide` and `destroy`.
 */
export function createPutEffects(name: string) {
  return {
    show: bindPutEffect(showModal, name),
    update: bindPutEffect(updateModal, name),
    submit: bindPutEffect(submitModal, name),
    click: bindPutEffect(clickModal, name),
    hide: bindPutEffectWithoutPayload(hideModal, name),
    destroy: bindPutEffectWithoutPayload(destroyModal, name),
  };
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
    select: () => select(selector as (state: any) => any),
  };
}

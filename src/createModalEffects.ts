import { put, select, take, TakeEffect, PutEffect } from 'redux-saga/effects';
import { Action } from 'redux';
import { modalSelector, modalsStateSelector } from './selectors';
import * as actionsCreators from './actionsCreators';
import {
  CreateModalEffectsParams,
  ModalActionCreators,
  SagaModalAction,
  SagaModalCommonAction,
} from './interface';
import createModalPatterns, { reduceObjWith } from './createModalPatterns';

/**
 * High order `take` effects creators.
 * The result of every creator is `take` with a corresponding modal action.
 * You can also pass payloadPattern to perfoms addiotonal checks for payload
 */
export interface ModalTakeEffects {
  /**
   * Create redux-saga `take` effect
   * ```ts
   * const modal = createModal('myModal');
   * yield modal.takeShow(); // without payload predicate
   * yield modal.takeShow((payload) => payload.myTitle === "my title"); // with payload predicate
   *  ```
   */
  takeShow(payloadPattern?: unknown): TakeEffect;
  /**
   * Create redux-saga `take` effect
   * ```ts
   * const modal = createModal('myModal');
   * yield modal.takeUpdate(); // without payload predicate
   * yield modal.takeUpdate((payload) => payload.myTitle === "my title"); // with payload predicate
   *  ```
   */
  takeUpdate(payloadPattern?: unknown): TakeEffect;
  /**
   * Create redux-saga `take` effect
   * ```ts
   * const modal = createModal('myModal');
   * yield modal.takeClick(); // without payload predicate
   * yield modal.takeClick((payload) => payload.myTitle === "my title"); // with payload predicate
   *  ```
   */
  takeClick(payloadPattern?: unknown): TakeEffect;
  /**
   * Create redux-saga `take` effect
   * ```ts
   * const modal = createModal('myModal');
   * yield modal.takeDestroy()
   *  ```
   */
  takeDestroy(payloadPattern?: unknown): TakeEffect;
  /**
   * Create redux-saga `take` effect
   * ```ts
   * const modal = createModal('myModal');
   * yield modal.takeSubmit(); // without payload predicate
   * yield modal.takeSubmit((payload) => payload.myTitle === "my title"); // with payload predicate
   *  ```
   */
  takeSubmit(payloadPattern?: unknown): TakeEffect;
  /**
   * Create redux-saga `take` effect
   * ```ts
   * const modal = createModal('myModal');
   * yield modal.takeHide();
   *  ```
   */
  takeHide(payloadPattern?: unknown): TakeEffect;
}

/**
 * Creates high order `take` effects creators.
 * The result of every creator is `take` with predicate to match a corresponding modal action.
 * You can also pass payloadPattern to perfoms addiotonal checks for action's payload,
 */
export function createTakeEffects(
  modalName: string,
  mappedPatterns?: ReturnType<typeof createModalPatterns>,
): ModalTakeEffects {
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
  }, {} as ModalTakeEffects);
}

export interface ModalPutEffects {
  /**
   * Create redux-saga `put` effect
   * ```ts
   * yield modal.show({ myTitle: 'my title' });
   * ```
   */
  show<P>(payload: P): PutEffect<SagaModalAction<P>>;
  /**
   * Create redux-saga `put` effect
   * ```ts
   * yield modal.update({ myTitle: 'my title' });
   * ```
   */
  update<P>(payload: P): PutEffect<SagaModalAction<P>>;
  /**
   * Create redux-saga `put` effect
   * ```ts
   * yield modal.submit({ myTitle: 'new title' });
   * ```
   */
  submit<P>(payload: P): PutEffect<SagaModalAction<P>>;
  /**
   * Create redux-saga `put` effect
   * ```ts
   * yield modal.click();
   * ```
   */
  click<P>(payload: P): PutEffect<SagaModalAction<P>>;
  /**
   * Create redux-saga `put` effect
   * ```ts
   * yield modal.hide();
   * ```
   */
  hide(): PutEffect;
  /**
   * Create redux-saga `put` effect
   * ```ts
   * yield modal.destroy();
   * ```
   */
  destroy(): PutEffect;
}

export function bindPutEffect<A extends ModalActionCreators>(
  actionCreator: A,
  name: string,
) {
  return function <P = {}>(payload: P): PutEffect<SagaModalAction<P>> {
    return put(actionCreator.apply(undefined, [name, payload]));
  };
}

export function bindPutEffectWithoutPayload<A extends ModalActionCreators>(
  actionCreator: A,
  name: string,
) {
  return function (): PutEffect<SagaModalCommonAction> {
    return put(actionCreator.apply(undefined, [name]));
  };
}
/**
 * Creates high order `put` effects creators.
 * The result of every creator is `put` with one of the modal action.
 * @param name - name of the modal
 * @returns an object with properties `show`, `update`, `click`, `submit`, `hide` and `destroy`.
 */
export function createPutEffects(name: string): ModalPutEffects {
  return {
    ...reduceObjWith((a) => bindPutEffect(a, name), {
      show: actionsCreators.showModal,
      update: actionsCreators.updateModal,
      click: actionsCreators.clickModal,
      submit: actionsCreators.submitModal,
    }),
    ...reduceObjWith((a) => bindPutEffectWithoutPayload(a, name), {
      hide: actionsCreators.hideModal,
      destroy: actionsCreators.destroyModal,
    }),
  };
}

/**
 *
 * @param modalName - name of the modal
 * @param params - ICreateModalEffectsParams
 * @returns ICreateModalEffectsParams
 */
export default function createModalEffects(
  modalName: string,
  params: CreateModalEffectsParams,
) {
  const config = {
    getModalsState: modalsStateSelector,
    ...params,
  };

  const selector =
    config.selector || modalSelector(modalName, config.getModalsState);

  const takeEffects = createTakeEffects(modalName, config.patterns);
  return {
    ...takeEffects,
    ...createPutEffects(modalName),
    /**
     * Redux saga `select` effect creator.
     * ```ts
     * yield modal.show({ title: 'My title' });
     * const { isOpen, props } = yield modal.select();
     * ```
     */
    select: () => select(selector as (state: any) => any),
  };
}

import { SelectEffect } from 'redux-saga/effects';
import { modalSelector, modalsStateSelector } from './selectors';
import { createModalActions, ModalActions } from './createModalActions';
import createModalPatterns, { ModalPatterns } from './createModalPatterns';
import createModalEffects, {
  ModalTakeEffects,
  ModalPutEffects,
} from './createModalEffects';
import { CreateModalParams, ModalItemState, State } from './interface';

/**
 *
 * A modal instance without high level effects of redux-saga.
 * All methods already bounds to the modal's name so you don't need manually pass it.
 **/

export interface ModalHelpers {
  /**
   * Name of the modal.
   */
  name: string;
  /**
   * Scoped action matchers of the modal.
   * See {@link ModalPatterns}
   */
  patterns: ModalPatterns;
  /**
   * Scoped action creators
   * See {@link ModalActions}
   */
  actions: ModalActions;
  /**
   * Redux modal selector
   */
  selector<InitProps>(s: State): ModalItemState<InitProps>;
}

/**
 * Creates a modal instance without redux-saga effects
 *
 * @public
 *
 * @param modalName - name of the modal
 * @param params - see {@link CreateModalParams}
 *
 * @returns see {@link ModalHelpers}
 * @example
 * ```ts
 * const modal = createModalHelpers('confirm');
 *
 * const confirmModal = function* (initProps) {
 *  yield put(modal.actions.show(initProps));
 *
 *   const [submit]: boolean[] = yield race([
 *     take(modal.patterns.submit()),
 *     take(modal.patterns.hide()),
 *   ]);
 *
 *   yield put(modal.actions.hide());
 *
 *   return !!submit;
 * };
 * ```
 */
export function createModalHelpers(
  modalName: string,
  params?: CreateModalParams,
): ModalHelpers {
  const config = {
    getModalsState: modalsStateSelector,
    ...params,
  };

  return {
    name: modalName,
    selector: modalSelector(modalName, config.getModalsState),
    patterns: createModalPatterns(modalName),
    actions: createModalActions(modalName),
  };
}

/**
 *
 * Include put effects (see {@link ModalPutEffects}),
 * take effects (see {@link ModalTakeEffects}) and select effect.
 *
 * All methods already bounds to the modal's name so you don't need manually pass it.
 **/

export type ModalEffects = ModalPutEffects &
  ModalTakeEffects & { select(): SelectEffect };
/**
 *
 * A modal instance.
 * All methods already bounds to the modal's name so you don't need manually pass it.
 **/

export type SagaModalInstance = ModalHelpers & ModalEffects;

/**
 * Creates a modal instance.
 * All methods already bounds to the modal's name so you don't need manually pass it.
 *
 * @public
 *
 * @param modalName - name of the modal
 * @param params - see {@link CreateModalParams}
 *
 * @returns see {@link ModalHelpers}
 * @example
 * ```ts
 * import { race } from 'redux-saga/effects';
 * import { createModal } from 'redux-saga-modal';
 *
 * const modal = createModal('confirm');
 *
 * const confirmModal = function* <T>(initProps: T) {
 *   yield modal.show(initProps);
 *
 *   const [submit]: boolean[] = yield race([
 *     modal.takeSubmit(),
 *     modal.takeHide(),
 *   ]);
 *
 *   yield modal.hide();
 *
 *   return !!submit;
 *
 * };
 * ```
 */
export default function createModal(
  modalName: string,
  params?: CreateModalParams,
): SagaModalInstance {
  const helpers = createModalHelpers(modalName, params);

  return {
    ...helpers,
    ...createModalEffects(modalName, {
      selector: helpers.selector,
      patterns: helpers.patterns,
    }),
  };
}

import { Dispatch } from 'redux';
import {
  showModal,
  hideModal,
  clickModal,
  updateModal,
  destroyModal,
  submitModal,
} from './actionsCreators';
import {
  SagaModalCommonAction,
  ModalActionCreators,
  SagaModalAction,
} from './interface';

/**
 * Partially applied `actionCreators`.
 */
export interface ModalActions {
  /**
   *  Partially applied `showModal' action creator.
   *  @param payload - will be stored in redux and *override* any existing
   */
  show<P>(payload: P): SagaModalAction<P>;
  /**
   *  Partially applied `updateModal' action creator.
   *  @param payload - will be stored in redux by *merging* with existing
   */
  update<P>(payload: P): SagaModalAction<P>;
  /**
   *  Partially applied `hideModal' action creator.
   *  Modal reducer handle this action by setting isOpen to false. Existing props will be preserved
   */
  hide(): SagaModalCommonAction;
  /**
   * Partially applied `destroyModal' action creator.
   * Modal reducer handle this action by clearing all existing modal props
   */
  destroy(): SagaModalCommonAction;

  /**
   *  Partially applied `submitModal' action creator.
   *  Dispatching this action will not rerender your component
   *  @param payload - will not be stored in redux store but can be accessed via sagas
   */
  submit<P>(payload: P): SagaModalAction<P>;
  /**
   * Partially applied `clickModal' action creator.
   * Dispatching this action will not re-render your component and payload
   *  @param payload - will not be stored in redux store but can be accessed via sagas
   */
  click<P>(payload: P): SagaModalAction<P>;
}

/**
 *  Create partially applied action creators
 *  @param name - the name of the modal
 *  @returns The object with methods show, hide, destroy, update, click, submit.
 */
export function createModalActions(name: string): ModalActions {
  return {
    /**
     *  Partially applied `showModal' action creator.
     *  @param payload - will be stored in redux and *override* any existing
     */
    show<P>(payload: P) {
      return showModal<P>(name, payload);
    },
    /**
     *  Partially applied `updateModal' action creator.
     *  @param payload - will be stored in redux by *merging* with existing
     */
    update<P>(payload: P) {
      return updateModal<P>(name, payload);
    },
    /**
     * Partially applied `clickModal' action creator.
     * Dispatching this action will not rerender your component and payload
     *  @param payload - will not be stored in redux store but can be accessed via sagas
     */
    submit<P>(payload: P) {
      return submitModal<P>(name, payload);
    },
    /**
     * Partially applied `clickModal' action creator.
     * Dispatching this action will not rerender your component and payload
     *  @param payload - will not be stored in redux store but can be accessed via sagas
     */
    click<P>(payload: P) {
      return clickModal<P>(name, payload);
    },
    /**
     *  Partially applied `hideModal' action creator.
     *  Modal reducer handle this action by setting isOpen to false. Existing props will be preserved
     */
    hide() {
      return hideModal(name);
    },
    /**
     * Partially applied `destroyModal' action creator.
     * Modal reducer handle this action by clearing all existing modal props
     */
    destroy() {
      return destroyModal(name);
    },
  };
}

/**
 * Return an object whose values are partially applied action creators,
 * wrapped into a `dispatch` call so they may be invoked directly.
 *
 *
 * @param actionCreator - a modal action creator
 * @param name - the name of the modal to bind modal action creators
 * @param effect. The `dispatch` function available on your Redux store.
 *
 * @returns a function that accepts payload and then apply actionCreator
 * with name and payload.
 *
 */
export function bindActionEffect<E extends Function>(
  actionCreator: ModalActionCreators,
  name: string,
  effect: E,
) {
  return function <P = {}>(payload?: P): Dispatch<SagaModalAction<P>> {
    const action: SagaModalAction<P> = actionCreator.apply(undefined, [
      name,
      payload,
    ]);

    return effect(action);
  };
}

/**
 * Return an object whose values are partially applied action creators {@link ModalActionCreators}
 * wrapped into a `dispatch` call so they may be invoked directly.
 *
 *
 * @param name - the name of the modal to bind modal action creators
 * @param dispatch The `dispatch` function available on your Redux store.
 *
 * @returns The object with methods show, update, hide, click, update, destroy,
 * wrapped into the `dispatch` call and bound to the name.
 *
 */
export default function createModalBoundActions(
  name: string,
  dispatch: Function,
) {
  return {
    show: bindActionEffect(showModal, name, dispatch),
    update: bindActionEffect(updateModal, name, dispatch),
    submit: bindActionEffect(submitModal, name, dispatch),
    click: bindActionEffect(clickModal, name, dispatch),
    hide: bindActionEffect(hideModal, name, dispatch),
    destroy: bindActionEffect(destroyModal, name, dispatch),
  };
}

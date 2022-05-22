import { PutEffect, put } from 'redux-saga/effects';
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
   *  @param _args - ignored
   */
  hide(): SagaModalCommonAction;
  /**
   * Partially applied `destroyModal' action creator.
   * Modal reducer handle this action by clearing all existing modal props
   *  @param _args - ignored
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
   * Dispatching this action will not rerender your component and payload
   *  @param payload - will not be stored in redux store but can be accessed via sagas
   */
  click<P>(payload: P): SagaModalAction<P>;
}

export function createModalActions(name: string): ModalActions {
  return {
    show<P>(payload: P) {
      return showModal<P>(name, payload);
    },
    update<P>(payload: P) {
      return updateModal<P>(name, payload);
    },
    submit<P>(payload: P) {
      return submitModal<P>(name, payload);
    },
    click<P>(payload: P) {
      return clickModal<P>(name, payload);
    },
    hide() {
      return hideModal(name);
    },
    destroy() {
      return destroyModal(name);
    },
  };
}

export function bindActionEffect<E extends Function>(
  actionCreator: ModalActionCreators,
  name: string,
  effect: E,
) {
  return function<P = {}>(payload?: P): Dispatch<SagaModalAction<P>> {
    const action: SagaModalAction<P> = actionCreator.apply(undefined, [
      name,
      payload,
    ]);

    return effect(action);
  };
}

export function bindPutEffect<A extends ModalActionCreators>(
  actionCreator: A,
  name: string,
) {
  return function<P = {}>(payload?: P): PutEffect<SagaModalAction<P>> {
    return put(actionCreator.apply(undefined, [name, payload]));
  };
}

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

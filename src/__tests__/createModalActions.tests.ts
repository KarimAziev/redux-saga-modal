import createModalBoundActions from '../createModalActions';
import { ModalActionTypes } from '../actionTypes';

let actions: ReturnType<typeof createModalBoundActions>;

describe('Testing createModalBoundActions', () => {
  beforeEach(() => {
    actions = createModalBoundActions('A', (a: unknown) => a);
  });
  it('Show modal', () => {
    expect(actions.show({ b: 10 })).toEqual({
      type: ModalActionTypes.SHOW_MODAL,
      meta: { name: 'A' },
      payload: { b: 10 },
    });
  });
  it('Update modal', () => {
    expect(actions.update({ b: 10 })).toEqual({
      type: ModalActionTypes.UPDATE_MODAL,
      meta: { name: 'A' },
      payload: { b: 10 },
    });
  });

  it('Click modal', () => {
    expect(actions.click({ b: 10 })).toEqual({
      type: ModalActionTypes.CLICK_MODAL,
      meta: { name: 'A' },
      payload: { b: 10 },
    });
  });

  it('Submit modal', () => {
    expect(actions.submit({ b: 10 })).toEqual({
      type: ModalActionTypes.SUBMIT_MODAL,
      meta: { name: 'A' },
      payload: { b: 10 },
    });
  });

  it('Hide modal', () => {
    expect(actions.hide()).toEqual({
      type: ModalActionTypes.HIDE_MODAL,
      meta: { name: 'A' },
    });
  });

  it('Hide modal should ignore payload', () => {
    expect(actions.hide({ b: 10 })).toEqual({
      type: ModalActionTypes.HIDE_MODAL,
      meta: { name: 'A' },
    });
  });

  it('Destroy modal', () => {
    expect(actions.destroy()).toEqual({
      type: ModalActionTypes.DESTROY_MODAL,
      meta: { name: 'A' },
    });
  });
  it('Destroy modal should ignore payload', () => {
    expect(actions.destroy({ b: 10 })).toEqual({
      type: ModalActionTypes.DESTROY_MODAL,
      meta: { name: 'A' },
    });
  });
});

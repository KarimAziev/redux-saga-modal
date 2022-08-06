import createModalPatterns, { ModalPatterns } from '../createModalPatterns';
import * as actionsCreators from '../actionsCreators';
import { SagaModalAction } from '../interface';

let MODAL_NAME_A: string;
let MODAL_NAME_B: string;

let patternsA: ModalPatterns;

let actionA: SagaModalAction;
let actionB: SagaModalAction;
let actionOtherA: SagaModalAction;

describe('Testing modal show patterns', () => {
  beforeEach(() => {
    MODAL_NAME_A = 'A';
    MODAL_NAME_B = 'B';
    patternsA = createModalPatterns(MODAL_NAME_A);
    actionA = actionsCreators.showModal(MODAL_NAME_A, { id: 193, text: 'ff' });
    actionB = actionsCreators.showModal(MODAL_NAME_B, { id: 193 });
    actionOtherA = actionsCreators.updateModal(MODAL_NAME_A, { text: 'ff' });
  });

  it('Should work if first call was with own action', () => {
    expect(patternsA.show(actionA)).toEqual(true);
    expect(patternsA.show(actionOtherA)).toEqual(false);
    expect(patternsA.update(actionA)).toEqual(false);
    expect(patternsA.hide(actionA)).toEqual(false);
    expect(patternsA.click(actionA)).toEqual(false);
    expect(patternsA.submit(actionA)).toEqual(false);
    expect(patternsA.destroy(actionA)).toEqual(false);
  });

  it('Should be false if first call was with external action', () => {
    expect(patternsA.show(actionB)).toEqual(false);
    expect(patternsA.update(actionB)).toEqual(false);
    expect(patternsA.hide(actionB)).toEqual(false);
    expect(patternsA.click(actionB)).toEqual(false);
    expect(patternsA.submit(actionB)).toEqual(false);
    expect(patternsA.destroy(actionB)).toEqual(false);
  });

  it('handle own actions without predicate', () => {
    expect(patternsA.show()(actionA)).toEqual(true);
    expect(patternsA.show()(actionOtherA)).toEqual(false);
    expect(patternsA.update()(actionA)).toEqual(false);
    expect(patternsA.hide()(actionA)).toEqual(false);
    expect(patternsA.click()(actionA)).toEqual(false);
    expect(patternsA.destroy()(actionA)).toEqual(false);
    expect(patternsA.submit()(actionA)).toEqual(false);
  });

  it('handle handle external modal actions without predicate', () => {
    expect(patternsA.show()(actionB)).toEqual(false);
    expect(patternsA.update()(actionB)).toEqual(false);
    expect(patternsA.hide()(actionB)).toEqual(false);
    expect(patternsA.click()(actionB)).toEqual(false);
    expect(patternsA.submit()(actionB)).toEqual(false);
    expect(patternsA.destroy()(actionB)).toEqual(false);
  });

  it('Should be false if payload predicate return nil', () => {
    expect(patternsA.show(() => false)(actionA)).toEqual(false);
  });
  it('Should be true if payload predicate return true', () => {
    expect(patternsA.show(() => true)(actionA)).toEqual(true);
  });

  it('Should pass payload to predicate', () => {
    const pred = (payload: { id: number }) => payload.id === 193;
    expect(patternsA.show(pred)(actionA)).toEqual(true);
  });

  it('Should ignore payload predicates from other actions', () => {
    expect(patternsA.show(() => true)(actionOtherA)).toEqual(false);
    expect(patternsA.show(() => true)(actionB)).toEqual(false);
  });
});

describe('Testing modal update patterns', () => {
  beforeEach(() => {
    MODAL_NAME_A = 'A';
    MODAL_NAME_B = 'B';
    patternsA = createModalPatterns(MODAL_NAME_A);
    actionA = actionsCreators.updateModal(MODAL_NAME_A, {
      id: 193,
      text: 'ff',
    });
    actionB = actionsCreators.updateModal(MODAL_NAME_B, { id: 193 });
    actionOtherA = actionsCreators.showModal(MODAL_NAME_A, { text: 'ff' });
  });

  it('Should work if first call was with own action', () => {
    expect(patternsA.update(actionA)).toEqual(true);
    expect(patternsA.update(actionOtherA)).toEqual(false);
    expect(patternsA.show(actionA)).toEqual(false);
    expect(patternsA.hide(actionA)).toEqual(false);
    expect(patternsA.click(actionA)).toEqual(false);
    expect(patternsA.submit(actionA)).toEqual(false);
    expect(patternsA.destroy(actionA)).toEqual(false);
  });

  it('Should be false if first call was with external action', () => {
    expect(patternsA.update(actionB)).toEqual(false);
    expect(patternsA.show(actionB)).toEqual(false);
    expect(patternsA.hide(actionB)).toEqual(false);
    expect(patternsA.click(actionB)).toEqual(false);
    expect(patternsA.submit(actionB)).toEqual(false);
    expect(patternsA.destroy(actionB)).toEqual(false);
  });

  it('handle own actions without predicate', () => {
    expect(patternsA.update()(actionA)).toEqual(true);
    expect(patternsA.update()(actionOtherA)).toEqual(false);
    expect(patternsA.show()(actionA)).toEqual(false);
    expect(patternsA.hide()(actionA)).toEqual(false);
    expect(patternsA.click()(actionA)).toEqual(false);
    expect(patternsA.destroy()(actionA)).toEqual(false);
    expect(patternsA.submit()(actionA)).toEqual(false);
  });

  it('handle handle external modal actions without predicate', () => {
    expect(patternsA.update()(actionB)).toEqual(false);
    expect(patternsA.show()(actionB)).toEqual(false);
    expect(patternsA.hide()(actionB)).toEqual(false);
    expect(patternsA.click()(actionB)).toEqual(false);
    expect(patternsA.submit()(actionB)).toEqual(false);
    expect(patternsA.destroy()(actionB)).toEqual(false);
  });

  it('Should be false if payload predicate return nil', () => {
    expect(patternsA.update(() => false)(actionA)).toEqual(false);
  });
  it('Should be true if payload predicate return true', () => {
    expect(patternsA.update(() => true)(actionA)).toEqual(true);
  });

  it('Should pass payload to predicate', () => {
    const pred = (payload: { id: number }) => payload.id === 193;
    expect(patternsA.update(pred)(actionA)).toEqual(true);
  });

  it('Should ignore payload predicates from other actions', () => {
    expect(patternsA.update(() => true)(actionOtherA)).toEqual(false);
    expect(patternsA.update(() => true)(actionB)).toEqual(false);
  });
});

describe('Testing modal click patterns', () => {
  beforeEach(() => {
    MODAL_NAME_A = 'A';
    MODAL_NAME_B = 'B';
    patternsA = createModalPatterns(MODAL_NAME_A);
    actionA = actionsCreators.clickModal(MODAL_NAME_A, 'f');
    actionB = actionsCreators.clickModal(MODAL_NAME_B, { id: 193 });
    actionOtherA = actionsCreators.hideModal(MODAL_NAME_A);
  });

  it('Modal click patterns work if first call was with own action', () => {
    expect(patternsA.click(actionA)).toEqual(true);
    expect(patternsA.click(actionOtherA)).toEqual(false);
    expect(patternsA.show(actionA)).toEqual(false);
    expect(patternsA.hide(actionA)).toEqual(false);
    expect(patternsA.update(actionA)).toEqual(false);
    expect(patternsA.submit(actionA)).toEqual(false);
    expect(patternsA.destroy(actionA)).toEqual(false);
  });

  it('Modal click patterns should be false if first call was with external action', () => {
    expect(patternsA.click(actionB)).toEqual(false);
    expect(patternsA.show(actionB)).toEqual(false);
    expect(patternsA.hide(actionB)).toEqual(false);
    expect(patternsA.update(actionB)).toEqual(false);
    expect(patternsA.submit(actionB)).toEqual(false);
    expect(patternsA.destroy(actionB)).toEqual(false);
  });

  it('Modal click patterns handle own actions without predicate', () => {
    expect(patternsA.click()(actionA)).toEqual(true);
    expect(patternsA.click()(actionOtherA)).toEqual(false);
    expect(patternsA.show()(actionA)).toEqual(false);
    expect(patternsA.hide()(actionA)).toEqual(false);
    expect(patternsA.update()(actionA)).toEqual(false);
    expect(patternsA.destroy()(actionA)).toEqual(false);
    expect(patternsA.submit()(actionA)).toEqual(false);
  });

  it('Modal click patterns handle handle external modal actions without predicate', () => {
    expect(patternsA.click()(actionB)).toEqual(false);
    expect(patternsA.show()(actionB)).toEqual(false);
    expect(patternsA.hide()(actionB)).toEqual(false);
    expect(patternsA.update()(actionB)).toEqual(false);
    expect(patternsA.submit()(actionB)).toEqual(false);
    expect(patternsA.destroy()(actionB)).toEqual(false);
  });

  it('Modal click patterns should be false if payload predicate return nil', () => {
    expect(patternsA.click(() => false)(actionA)).toEqual(false);
  });
  it('Modal click patterns should be true if payload predicate return true', () => {
    expect(patternsA.click(() => true)(actionA)).toEqual(true);
  });

  it('Modal click patterns should pass payload to predicate', () => {
    expect(
      patternsA.click((payload: string) => payload == 'f')(actionA),
    ).toEqual(true);
  });

  it('Modal click patterns should ignore payload predicates from other actions', () => {
    expect(patternsA.click(() => true)(actionOtherA)).toEqual(false);
    expect(patternsA.click(() => true)(actionB)).toEqual(false);
  });
});

describe('Testing modal submit patterns', () => {
  beforeEach(() => {
    MODAL_NAME_A = 'A';
    MODAL_NAME_B = 'B';
    patternsA = createModalPatterns(MODAL_NAME_A);
    actionA = actionsCreators.submitModal(MODAL_NAME_A, {
      id: 193,
      text: 'ff',
    });
    actionB = actionsCreators.submitModal(MODAL_NAME_B, { id: 193 });
    actionOtherA = actionsCreators.showModal(MODAL_NAME_A, { text: 'ff' });
  });

  it('Should work if first call was with own action', () => {
    expect(patternsA.submit(actionA)).toEqual(true);
    expect(patternsA.submit(actionOtherA)).toEqual(false);
    expect(patternsA.show(actionA)).toEqual(false);
    expect(patternsA.hide(actionA)).toEqual(false);
    expect(patternsA.click(actionA)).toEqual(false);
    expect(patternsA.update(actionA)).toEqual(false);
    expect(patternsA.destroy(actionA)).toEqual(false);
  });

  it('Should be false if first call was with external action', () => {
    expect(patternsA.submit(actionB)).toEqual(false);
    expect(patternsA.show(actionB)).toEqual(false);
    expect(patternsA.hide(actionB)).toEqual(false);
    expect(patternsA.click(actionB)).toEqual(false);
    expect(patternsA.update(actionB)).toEqual(false);
    expect(patternsA.destroy(actionB)).toEqual(false);
  });

  it('handle own actions without predicate', () => {
    expect(patternsA.submit()(actionA)).toEqual(true);
    expect(patternsA.submit()(actionOtherA)).toEqual(false);
    expect(patternsA.show()(actionA)).toEqual(false);
    expect(patternsA.hide()(actionA)).toEqual(false);
    expect(patternsA.click()(actionA)).toEqual(false);
    expect(patternsA.destroy()(actionA)).toEqual(false);
    expect(patternsA.update()(actionA)).toEqual(false);
  });

  it('handle handle external modal actions without predicate', () => {
    expect(patternsA.submit()(actionB)).toEqual(false);
    expect(patternsA.show()(actionB)).toEqual(false);
    expect(patternsA.hide()(actionB)).toEqual(false);
    expect(patternsA.click()(actionB)).toEqual(false);
    expect(patternsA.update()(actionB)).toEqual(false);
    expect(patternsA.destroy()(actionB)).toEqual(false);
  });

  it('Should be false if payload predicate return nil', () => {
    expect(patternsA.submit(() => false)(actionA)).toEqual(false);
  });
  it('Should be true if payload predicate return true', () => {
    expect(patternsA.submit(() => true)(actionA)).toEqual(true);
  });

  it('Should pass payload to predicate', () => {
    const pred = (payload: { id: number }) => payload.id === 193;
    expect(patternsA.submit(pred)(actionA)).toEqual(true);
  });

  it('Should ignore payload predicates from other actions', () => {
    expect(patternsA.submit(() => true)(actionOtherA)).toEqual(false);
    expect(patternsA.submit(() => true)(actionB)).toEqual(false);
  });
});

describe('Testing modal hide patterns', () => {
  beforeEach(() => {
    MODAL_NAME_A = 'A';
    MODAL_NAME_B = 'B';
    patternsA = createModalPatterns(MODAL_NAME_A);
    actionA = actionsCreators.hideModal(MODAL_NAME_A);
    actionB = actionsCreators.hideModal(MODAL_NAME_B);
    actionOtherA = actionsCreators.showModal(MODAL_NAME_A, { text: 'ff' });
  });

  it('Should work if first call was with own action', () => {
    expect(patternsA.hide(actionA)).toEqual(true);
    expect(patternsA.hide(actionOtherA)).toEqual(false);
    expect(patternsA.show(actionA)).toEqual(false);
    expect(patternsA.submit(actionA)).toEqual(false);
    expect(patternsA.click(actionA)).toEqual(false);
    expect(patternsA.update(actionA)).toEqual(false);
    expect(patternsA.destroy(actionA)).toEqual(false);
  });

  it('Should be false if first call was with external action', () => {
    expect(patternsA.hide(actionB)).toEqual(false);
    expect(patternsA.show(actionB)).toEqual(false);
    expect(patternsA.submit(actionB)).toEqual(false);
    expect(patternsA.click(actionB)).toEqual(false);
    expect(patternsA.update(actionB)).toEqual(false);
    expect(patternsA.destroy(actionB)).toEqual(false);
  });

  it('handle own actions without predicate', () => {
    expect(patternsA.hide()(actionA)).toEqual(true);
    expect(patternsA.hide()(actionOtherA)).toEqual(false);
    expect(patternsA.show()(actionA)).toEqual(false);
    expect(patternsA.submit()(actionA)).toEqual(false);
    expect(patternsA.click()(actionA)).toEqual(false);
    expect(patternsA.destroy()(actionA)).toEqual(false);
    expect(patternsA.update()(actionA)).toEqual(false);
  });

  it('handle handle external modal actions without predicate', () => {
    expect(patternsA.hide()(actionB)).toEqual(false);
    expect(patternsA.show()(actionB)).toEqual(false);
    expect(patternsA.submit()(actionB)).toEqual(false);
    expect(patternsA.click()(actionB)).toEqual(false);
    expect(patternsA.update()(actionB)).toEqual(false);
    expect(patternsA.destroy()(actionB)).toEqual(false);
  });

  it('Should be false if payload predicate return nil', () => {
    expect(patternsA.hide(() => false)(actionA)).toEqual(false);
  });
  it('Should be true if payload predicate return true', () => {
    expect(patternsA.hide(() => true)(actionA)).toEqual(true);
  });
  it('Should ignore payload predicates from other actions', () => {
    expect(patternsA.hide(() => true)(actionOtherA)).toEqual(false);
    expect(patternsA.hide(() => true)(actionB)).toEqual(false);
  });
});

describe('Testing modal destroy patterns', () => {
  beforeEach(() => {
    MODAL_NAME_A = 'A';
    MODAL_NAME_B = 'B';
    patternsA = createModalPatterns(MODAL_NAME_A);
    actionA = actionsCreators.destroyModal(MODAL_NAME_A);
    actionB = actionsCreators.destroyModal(MODAL_NAME_B);
    actionOtherA = actionsCreators.showModal(MODAL_NAME_A, { text: 'ff' });
  });

  it('Should work if first call was with own action', () => {
    expect(patternsA.destroy(actionA)).toEqual(true);
    expect(patternsA.destroy(actionOtherA)).toEqual(false);
    expect(patternsA.show(actionA)).toEqual(false);
    expect(patternsA.submit(actionA)).toEqual(false);
    expect(patternsA.click(actionA)).toEqual(false);
    expect(patternsA.update(actionA)).toEqual(false);
    expect(patternsA.hide(actionA)).toEqual(false);
  });

  it('Should be false if first call was with external action', () => {
    expect(patternsA.destroy(actionB)).toEqual(false);
    expect(patternsA.show(actionB)).toEqual(false);
    expect(patternsA.submit(actionB)).toEqual(false);
    expect(patternsA.click(actionB)).toEqual(false);
    expect(patternsA.update(actionB)).toEqual(false);
    expect(patternsA.hide(actionB)).toEqual(false);
  });

  it('handle own actions without predicate', () => {
    expect(patternsA.destroy()(actionA)).toEqual(true);
    expect(patternsA.destroy()(actionOtherA)).toEqual(false);
    expect(patternsA.show()(actionA)).toEqual(false);
    expect(patternsA.submit()(actionA)).toEqual(false);
    expect(patternsA.click()(actionA)).toEqual(false);
    expect(patternsA.hide()(actionA)).toEqual(false);
    expect(patternsA.update()(actionA)).toEqual(false);
  });

  it('handle handle external modal actions without predicate', () => {
    expect(patternsA.destroy()(actionB)).toEqual(false);
    expect(patternsA.show()(actionB)).toEqual(false);
    expect(patternsA.submit()(actionB)).toEqual(false);
    expect(patternsA.click()(actionB)).toEqual(false);
    expect(patternsA.update()(actionB)).toEqual(false);
    expect(patternsA.hide()(actionB)).toEqual(false);
  });

  it('Should be false if payload predicate return nil', () => {
    expect(patternsA.destroy(() => false)(actionA)).toEqual(false);
  });
  it('Should be true if payload predicate return true', () => {
    expect(patternsA.destroy(() => true)(actionA)).toEqual(true);
  });

  it('Should ignore payload predicates from other actions', () => {
    expect(patternsA.destroy(() => true)(actionOtherA)).toEqual(false);
    expect(patternsA.destroy(() => true)(actionB)).toEqual(false);
  });
});

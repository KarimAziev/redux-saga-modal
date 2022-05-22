import createModalPatterns from '../createModalPatterns';
import { showModal } from '../actionsCreators';

let MODAL_NAME_A: string;
let MODAL_NAME_B: string;

describe('Modal patterns', () => {
  beforeEach(() => {
    MODAL_NAME_A = 'A';
  });

  it('handle own actionA without predicate', () => {
    const actionA = showModal(MODAL_NAME_A, {});
    const patterns = createModalPatterns(MODAL_NAME_A);
    expect(patterns.show()(actionA)).toEqual(true);
    expect(patterns.update()(actionA)).toEqual(false);
    expect(patterns.hide(actionA)).toEqual(false);
    expect(patterns.click()(actionA)).toEqual(false);
    expect(patterns.destroy()(actionA)).toEqual(false);
    expect(patterns.submit()(actionA)).toEqual(false);
  });

  it('handle own actionA', () => {
    const actionA = showModal(MODAL_NAME_A, {});
    const patterns = createModalPatterns(MODAL_NAME_A);
    expect(patterns.show(actionA)).toEqual(true);
    expect(patterns.update(actionA)).toEqual(false);
    expect(patterns.hide(actionA)).toEqual(false);
    expect(patterns.click(actionA)).toEqual(false);
    expect(patterns.destroy(actionA)).toEqual(false);
    expect(patterns.submit(actionA)).toEqual(false);
  });

  it('handle own actionA with predicate', () => {
    const actionA = showModal(MODAL_NAME_B, {});
    const patterns = createModalPatterns(MODAL_NAME_A);
    expect(patterns.show()(actionA)).toEqual(false);
    expect(patterns.update()(actionA)).toEqual(false);
    expect(patterns.hide(actionA)).toEqual(false);
    expect(patterns.click()(actionA)).toEqual(false);
    expect(patterns.destroy()(actionA)).toEqual(false);
    expect(patterns.submit()(actionA)).toEqual(false);
  });
});

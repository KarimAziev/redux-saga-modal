import reducer from '../reducer';
import {
  showModal,
  updateModal,
  clickModal,
  submitModal,
  hideModal,
  destroyModal,
} from '../actionsCreators';

let MODAL_NAME: string;
let PAYLOAD: {};

describe('Saga modals reducer', () => {
  beforeEach(() => {
    MODAL_NAME = 'myModal';
    PAYLOAD = { message: 'Hello world' };
  });
  it('return the initial state', () => {
    expect(reducer()).toEqual({});
  });

  it('should handle show action', () => {
    const action = showModal(MODAL_NAME, PAYLOAD);

    expect(reducer(undefined, action)).toEqual({
      [MODAL_NAME]: {
        isOpen: true,
        props: PAYLOAD,
      },
    });
  });

  it('should add new props', () => {
    const action = updateModal(MODAL_NAME, { newProp: 23 });
    const initialState = {
      myModal: {
        isOpen: true,
        props: PAYLOAD,
      },
    };

    expect(reducer(initialState, action)).toEqual({
      [MODAL_NAME]: {
        isOpen: true,
        props: { newProp: 23, message: 'Hello world' },
      },
    });
  });

  it('should override old props', () => {
    const action = updateModal(MODAL_NAME, { message: 'New message' });
    const initialState = {
      [MODAL_NAME]: {
        isOpen: true,
        props: { message: 'Old message' },
      },
    };

    expect(reducer(initialState, action)).toEqual({
      [MODAL_NAME]: {
        isOpen: true,
        props: { message: 'New message' },
      },
    });
  });

  it('should handle hide action', () => {
    const initialState = {
      [MODAL_NAME]: {
        isOpen: true,
        props: PAYLOAD,
      },
    };

    const action = hideModal(MODAL_NAME);

    expect(reducer(initialState, action)).toEqual({
      [MODAL_NAME]: {
        isOpen: false,
        props: PAYLOAD,
      },
    });
  });
  it('should handle click action', () => {
    const initialState = {
      [MODAL_NAME]: {
        isOpen: true,
        props: PAYLOAD,
      },
    };

    const action = clickModal(MODAL_NAME, 'SOME_VALUE');

    expect(reducer(initialState, action)).toEqual({
      [MODAL_NAME]: {
        isOpen: true,
        props: PAYLOAD,
        clicked: 'SOME_VALUE',
      },
    });
  });

  it('should handle destroy action', () => {
    const initialState = {
      [MODAL_NAME]: {
        isOpen: true,
        props: PAYLOAD,
      },
    };

    const action = destroyModal(MODAL_NAME);

    expect(reducer(initialState, action)).toEqual({});
  });

  it('should handle submit action', () => {
    const initialState = {
      [MODAL_NAME]: {
        isOpen: true,
        props: PAYLOAD,
      },
    };

    const action = submitModal(MODAL_NAME, 'SOME_VALUE');

    expect(reducer(initialState, action)).toEqual({
      [MODAL_NAME]: {
        isOpen: true,
        props: PAYLOAD,
        isSubmitted: true,
        submitted: 'SOME_VALUE',
      },
    });
  });
});

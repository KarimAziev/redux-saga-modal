/* eslint-disable no-unused-expressions */
import { describe, it } from 'mocha';
import { expect, assert } from 'chai';
import { createModal, createModalPatterns } from '../src';
import { take } from 'redux-saga/effects';
import { cloneableGenerator } from '@redux-saga/testing-utils';

const MODAL_NAME = 'TARGET_MODAL'; 
const ALIEN_MODAL_NAME = 'ALIEN_MODAL';

const modal = createModal(MODAL_NAME);
const alienModal = createModal(ALIEN_MODAL_NAME);

function* takeShowModal() {
    const action = yield take(modal.pattern.show);
  }

describe('createModal', () => {
  it('should be a function', () => {
    expect(createModal).to.be.a('function');
  });

  const gen = cloneableGenerator(takeShowModal)();
  it('should take action', () => {
    const clone = gen.clone();
    console.log('clone', clone.next());
    console.log('clone.next()', clone.next())
    assert.deepEqual(
        clone.next(modal.action.show()).done,
        true,
        'it should be done',
      );
  })
});
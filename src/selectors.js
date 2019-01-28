// @flow
import type { ModalsState } from './types';
import { Store } from 'redux';
export const modalsStateSelector = (state: Store): ModalsState => state.modals;

import 'core-js/shim';
import 'regenerator-runtime/runtime';
import reducer from './reducer';
import types from './types';
import * as actions from './actions';
import ConnectModal from './ConnectModal';
import sagas from './sagas';

export default {
  ConnectModal,
  reducer,
  types,
  sagas,
  ...actions,
};

if (global._babelPolyfill && typeof console !== 'undefined' && console.warn) {
  console.warn(
    '@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended ' +
      'and may have consequences if different versions of the polyfills are applied sequentially. ' +
      'If you do need to load the polyfill more than once, use @babel/polyfill/noConflict ' +
      'instead to bypass the warning.',
  );
} 

global._babelPolyfill = true;



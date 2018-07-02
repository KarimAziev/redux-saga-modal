import 'core-js/shim';
import 'regenerator-runtime/runtime';
import { takeEvery, setContext } from 'redux-saga/effects';
import { isModalShow } from './utils';
import { inizializeModal } from './actions';

if (global._babelPolyfill && typeof console !== 'undefined' && console.warn) {
  console.warn(
    '@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended ' +
      'and may have consequences if different versions of the polyfills are applied sequentially. ' +
      'If you do need to load the polyfill more than once, use @babel/polyfill/noConflict ' +
      'instead to bypass the warning.',
  );
} 

global._babelPolyfill = true;

export default function* sagasInvoker() {
  yield takeEvery(inizializeModal().type, function* ({ payload: { key, saga } }) {
    yield setContext({ key })
    return yield takeEvery(isModalShow(key), saga);
  });
}


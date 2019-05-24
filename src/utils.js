export const konst = v => () => v;
export const kTrue = konst(true);
export const kFalse = konst(false);
export const noop = () => {};
export const identity = v => v;

const hasSymbol = typeof Symbol === 'function';
export const asyncIteratorSymbol =
    hasSymbol && Symbol.asyncIterator
      ? Symbol.asyncIterator
      : '@@asyncIterator';

export function check(value, predicate, error) {
  if (!predicate(value) && process.env.NODE_ENV !== 'production') {
    throw new Error(error);
  }
}

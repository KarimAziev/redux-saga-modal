export function getDisplayName(WrappedComponent, name) {
  return (
    WrappedComponent.displayName ||
        WrappedComponent.name ||
        name ||
        'Component'
  );
}
export const toArrayMaybe = item => (Array.isArray(item) ? item : [item]);
export const omitProps = (keys, obj) => {
  const data = {};

  Object.keys(obj)
    .filter(key => !keys.includes(key))
    .forEach(key => (data[key] = obj[key]));

  return data;
};

export function isFunction(val) {
  return Object.prototype.toString.call(val) === '[object Function]';
}

export const konst = v => () => v;
export const kTrue = konst(true);
export const kFalse = konst(false);
export const noop = () => {};
export const identity = v => v;

export const capitalize = v => v.charAt(0).toUpperCase() + v.slice(1);
export function check(value, predicate, error) {
  if (!predicate(value) && process.env.NODE_ENV !== 'production') {
    throw new Error(error);
  }
}

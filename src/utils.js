export function getDisplayName(WrappedComponent, name) {
  return (
    WrappedComponent.displayName ||
        WrappedComponent.name ||
        name ||
        'Component'
  );
}
export const omitProps = (keys, obj) => 
  Object.keys(obj)
    .filter(key => !keys.includes(key))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});


export const isDev = process.env.NODE_ENV !== 'production';

export const konst = v => () => v;
export const kTrue = konst(true);
export const kFalse = konst(false);
export const noop = () => {};
export const identity = v => v;

export const capitalize = v => v.charAt(0).toUpperCase() + v.slice(1);
export function check(value, predicate, error) {
  if (!predicate(value) && isDev) {
    throw new Error(error);
  }
}

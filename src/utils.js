export function getDisplayName(WrappedComponent, name) {
  return WrappedComponent.displayName || WrappedComponent.name || name || 'Component';
}
export const toArrayMaybe = item => Array.isArray(item) ? item : [item];
export const omitProps = (keys, obj) => {
  const data = {};
  
  Object.keys(obj)
    .filter(key => !keys.includes(key))
    .forEach(key => data[key] = obj[key]);

  return data;
};

export function isFunction(val) {
  return Object.prototype.toString.call(val) === '[object Function]';
}
export function getDisplayName(WrappedComponent, name) {
  return WrappedComponent.displayName || WrappedComponent.name || name || 'Component';
}
export const toArrayMaybe = item => Array.isArray(item) ? item : [item];
export function isObject(val) {
  return val === Object(val);
}
export function isFunction(val) {
  return Object.prototype.toString.call(val) === '[object Function]';
}

export function isArray(val) {
  return Array.isArray(val);
}

export function isString(val) {
  return typeof val === 'string' || val instanceof String;
}

export function isObjLiteral(val) {
  return isObject(val) && 
         !isArray(val) && 
         !isFunction(val) && 
         !isString(val);
}

export function omitFunctions(data) {
  const propsKeys = Object.keys(data)
    .filter(key => !isFunction(data[key]));
  
  const result = {};

  propsKeys.forEach(key => {
    result[key] = data[key]
  });

  return result;
}

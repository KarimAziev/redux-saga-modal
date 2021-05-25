import React from 'react';
import { Predicate } from './interface';

export function getDisplayName(
  WrappedComponent: React.ComponentType<any>,
  name: string,
): string {
  return (
    WrappedComponent.displayName || WrappedComponent.name || name || 'Component'
  );
}

export const isDev: boolean = process.env.NODE_ENV !== 'production';

export const konst = <T>(v: T): (() => T) => () => v;
export const kTrue = konst(true);

export const identity = <T>(v: T): T => v;

export const capitalize = (v: string): Capitalize<string> =>
  v.charAt(0).toUpperCase() + v.slice(1);

export function check<T, P extends Predicate<T>, E extends string>(
  value: T,
  predicate: P,
  error?: E,
) {
  if (isDev && !predicate(value)) {
    throw new Error(error);
  }
}

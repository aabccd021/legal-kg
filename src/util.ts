import { writeFileSync } from 'fs';
import { reduce, isUndefined, join } from 'lodash';

export function bothFilter<T>(
  arr: T[],
  callback: (el: T, arr: T[]) => boolean
): BothFilterResult<T> {
  return reduce<T, BothFilterResult<T>>(
    arr,
    (acc, el) => {
      const isRight = callback(el, arr);
      const left = isRight ? acc.left : [...acc.left, el];
      const right = isRight ? [...acc.right, el] : acc.right;
      return { left, right };
    },
    { left: [], right: [] }
  );
}

type BothFilterResult<T> = {
  left: T[];
  right: T[];
};

export type UnindexedSpan = {
  xL: number;
  y: number;
  xR: number;
  pageNum: number;
  str: string;
};

export type Span = UnindexedSpan & {
  id: number;
};

export function neverNum(x?: string | number): number {
  throw Error(x?.toString());
}
export function neverString(x?: string): string {
  throw Error(x);
}

export function neverUndefined<T>(x: T | undefined, msg?: unknown): T {
  if (!isUndefined(x)) return x;
  throw Error(JSON.stringify(msg));
}

export function lastOf<T>(arr: T[]): T | undefined {
  return arr.slice(-1)[0];
}

export function toValue<T, K extends keyof T>(key: K): (obj: T) => T[K] {
  return function mapper(obj: T): T[K] {
    return obj[key];
  };
}

export function writeFile(path: string) {
  return function write(content: string): void {
    return writeFileSync(path, content);
  };
}

export function joinWith(joiner: string) {
  return function _join(strArr: string[]): string {
    return join(strArr, joiner);
  };
}

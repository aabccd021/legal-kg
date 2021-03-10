import { curry, reduce } from 'lodash';

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

export function neverNum(x?: string): number {
  throw Error(x);
}
export function neverString(x?: string): string {
  throw Error(x);
}

export type Accumulator<T extends string> = { spans: SpanOf<T>; flag: T };
export type SpanOf<T extends string> = { [P in T]: Span[] };

export const toSpansWith = curry(toSpans);

function toSpans<T extends string>(
  reduceFlag: (oldFlag: T, span: Span) => T,
  acc: Accumulator<T>,
  span: Span
): Accumulator<T> {
  const { flag, spans } = acc;
  const newFlag = reduceFlag(flag, span);
  const newSpanArr = [...spans[newFlag], span];
  const newSpanArrs = { ...spans, [newFlag]: newSpanArr };
  return { ...acc, flag: newFlag, spans: newSpanArrs };
}

export function lastOf<T>(arr: T[]): T | undefined {
  return arr.slice(-1)[0];
}

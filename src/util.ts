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

export type Span = {
  xL: number;
  y: number;
  xR: number;
  pageNum: number;
  str: string;
};

export function neverNum(): number {
  throw Error();
}

export type Accumulator<T extends string> = { spans: { [P in T]?: Span[] }; flag: T };

export const toSpansWith = curry(toSpans);

function toSpans<T extends string>(
  reduceFlag: (oldFlag: T, span: Span) => T,
  acc: Accumulator<T>,
  span: Span
): Accumulator<T> {
  const { flag, spans } = acc;
  const newFlag = reduceFlag(flag, span);
  const newSpan = [...(spans[newFlag] ?? []), span];
  const newSpans = { ...spans, [newFlag]: newSpan };
  return { ...acc, flag: newFlag, spans: newSpans };
}

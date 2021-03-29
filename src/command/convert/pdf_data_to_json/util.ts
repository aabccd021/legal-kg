import { Component } from '../../../legal/component/index';
import { chain, curry, isUndefined, min } from 'lodash';
import { Span, neverNum, lastOf } from '../../../util';
import { SpanIdKeyMap } from './scan';
import { Context, KeySpans } from './key_ids_to_babs';

type Acc = {
  spansOfKey: SpansOfKey;
  preKeySpans: Span[];
  currentKey?: number;
};

type SpansOfKey = { [key: number]: Span[] };
type ToStructureWith<T extends Component> = (context: Context, keySpans: KeySpans) => T;
type StructureUtil<U> = {
  spanIdKeyMap: SpanIdKeyMap<number>;
  toStructure: (keySpans: KeySpans[]) => U;
};

export function spanIdKeyMapOf<A extends Component, B extends Component, T, U>(
  map1: [SpanIdKeyMap<number>, ToStructureWith<A>, (a: A[]) => T],
  map2: [SpanIdKeyMap<number>, ToStructureWith<B>, (a: B[]) => U],
  spans: Span[],
  context: Context
): StructureUtil<T> | StructureUtil<U> {
  return (min(spansInRange(map1[0], spans)) ?? Infinity) <
    (min(spansInRange(map2[0], spans)) ?? Infinity)
    ? transform(map1, context)
    : transform(map2, context);
}

function transform<T extends Component, U>(
  map1: [SpanIdKeyMap<number>, ToStructureWith<T>, (a: T[]) => U],
  context: Context
): StructureUtil<U> {
  return {
    spanIdKeyMap: map1[0],
    toStructure: (keySpans: KeySpans[]) => {
      return map1[2](keySpans.map(curry(map1[1])(context)));
    },
  };
}

export function spansInRange<T>(map: SpanIdKeyMap<T>, spans: Span[]): number[] {
  return chain(map)
    .keys()
    .map((key) => parseInt(key))
    .filter((id) => id >= (spans[0]?.id ?? neverNum()))
    .filter((id) => id <= (lastOf(spans)?.id ?? neverNum()))
    .value();
}

export const toSpansWith = curry(_toSpansWith);
function _toSpansWith(keyOfId: SpanIdKeyMap<number>, spans: Span[]): Acc {
  return spans.reduce(toSpans(keyOfId), { spansOfKey: {}, preKeySpans: [] });
}

const toSpans = curry(_toSpans);
function _toSpans(keyOfId: SpanIdKeyMap<number>, acc: Acc, span: Span): Acc {
  const { spansOfKey, currentKey, preKeySpans } = acc;
  const newKey = keyOfId[span.id];

  if (isUndefined(currentKey)) {
    if (isUndefined(newKey)) return { ...acc, preKeySpans: [...preKeySpans, span] };
    return { ...acc, currentKey: newKey, spansOfKey: { ...spansOfKey, [newKey]: [span] } };
  }

  if (!isUndefined(newKey)) {
    return { ...acc, currentKey: newKey, spansOfKey: { ...spansOfKey, [newKey]: [span] } };
  }

  const currentSpans = spansOfKey[currentKey];
  if (isUndefined(currentSpans)) throw Error();

  const newCurrentSpans = [...currentSpans, span];
  const newSpansOfKey = { ...spansOfKey, [currentKey]: newCurrentSpans };
  return { ...acc, spansOfKey: newSpansOfKey };
}

import { Component } from '../../../legal/component';
import { chain, curry, isUndefined, min } from 'lodash';
import { Span, neverNum, lastOf } from '../../../util';
import { SpanIdToComponentKeyMap } from './scan';
import { Context, KeySpans } from './spans_to_component';

type SpansExtractResult = {
  keyToSpanMap: KeyToSpanMap;
  preKeySpans: Span[];
  currentKey?: number;
};

type KeyToSpanMap = { [key: number]: Span[] };
type ToStructureWith<T extends Component> = (context: Context, keySpans: KeySpans) => T;
type StructureUtil<U extends Component> = {
  spanIdMap: SpanIdToComponentKeyMap<number>;
  keySpansToComponent: (keySpans: KeySpans[]) => U;
};

export function spanIdKeyMapOf<
  A extends Component,
  B extends Component,
  T extends Component,
  U extends Component
>(
  map1: [SpanIdToComponentKeyMap<number>, ToStructureWith<A>, (a: A[]) => T],
  map2: [SpanIdToComponentKeyMap<number>, ToStructureWith<B>, (a: B[]) => U],
  spans: Span[],
  context: Context
): StructureUtil<T> | StructureUtil<U> {
  return (min(spansInRange(map1[0], spans)) ?? Infinity) <
    (min(spansInRange(map2[0], spans)) ?? Infinity)
    ? transform(map1, context)
    : transform(map2, context);
}

function transform<T extends Component, U extends Component>(
  map1: [SpanIdToComponentKeyMap<number>, ToStructureWith<T>, (a: T[]) => U],
  context: Context
): StructureUtil<U> {
  return {
    spanIdMap: map1[0],
    keySpansToComponent: (keySpansTupleArr: KeySpans[]) => {
      return map1[2](keySpansTupleArr.map(curry(map1[1])(context)));
    },
  };
}

export function spansInRange<T>(map: SpanIdToComponentKeyMap<T>, spans: Span[]): number[] {
  return chain(map)
    .keys()
    .map((key) => parseInt(key))
    .filter((id) => id >= (spans[0]?.id ?? neverNum()))
    .filter((id) => id <= (lastOf(spans)?.id ?? neverNum()))
    .value();
}

export const extractSpansWith = curry(extractSpans);
export function extractSpans(
  keyOfId: SpanIdToComponentKeyMap<number>,
  spans: Span[]
): SpansExtractResult {
  return spans.reduce(toSpans(keyOfId), { keyToSpanMap: {}, preKeySpans: [] });
}

const toSpans = curry(_toSpans);
function _toSpans(
  keyOfId: SpanIdToComponentKeyMap<number>,
  acc: SpansExtractResult,
  span: Span
): SpansExtractResult {
  const { keyToSpanMap: spansOfKey, currentKey, preKeySpans } = acc;
  const newKey = keyOfId[span.id];

  if (isUndefined(currentKey)) {
    if (isUndefined(newKey)) return { ...acc, preKeySpans: [...preKeySpans, span] };
    return { ...acc, currentKey: newKey, keyToSpanMap: { ...spansOfKey, [newKey]: [span] } };
  }

  if (!isUndefined(newKey)) {
    return { ...acc, currentKey: newKey, keyToSpanMap: { ...spansOfKey, [newKey]: [span] } };
  }

  const currentSpans = spansOfKey[currentKey];
  if (isUndefined(currentSpans)) throw Error();

  const newCurrentSpans = [...currentSpans, span];
  const newSpansOfKey = { ...spansOfKey, [currentKey]: newCurrentSpans };
  return { ...acc, keyToSpanMap: newSpansOfKey };
}

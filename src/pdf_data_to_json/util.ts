import { chain, curry, isUndefined } from 'lodash';
import { Span, neverNum } from '../util';
import { SpanIdKeyMap } from './babs_spans_to_key_ids';

type Acc = {
  spansOfKey: SpansOfKey;
  preKeySpans: Span[];
  currentKey?: number;
};

type SpansOfKey = { [key: number]: Span[] };

export function spanIdKeyMapOf<A extends string, B extends string>(
  map1: [A, SpanIdKeyMap],
  map2: [B, SpanIdKeyMap],
  spans: Span[]
): A | B {
  return (getMinInRange(map1[1], spans) ?? Infinity) < (getMinInRange(map2[1], spans) ?? Infinity)
    ? map1[0]
    : map2[0];
}

function getMinInRange(map: SpanIdKeyMap, spans: Span[]): number | undefined {
  const firstId = spans[0]?.id ?? neverNum();
  const lastId = spans.slice(-1)[0]?.id ?? neverNum();
  const res = chain(map)
    .keys()
    .map((key) => parseInt(key))
    .filter((id) => firstId <= id && id <= lastId)
    .min()
    .value();
  return res;
}

export const toSpansWith = curry(_toSpansWith);

function _toSpansWith(keyOfId: SpanIdKeyMap, spans: Span[]): Acc {
  const initialSpans: Acc = { spansOfKey: {}, preKeySpans: [] };
  return spans.reduce(toSpans(keyOfId), initialSpans);
}

const toSpans = curry(_toSpans);

function _toSpans(keyOfId: SpanIdKeyMap, acc: Acc, span: Span): Acc {
  const { spansOfKey, currentKey, preKeySpans } = acc;
  const newKey = keyOfId[span.id];

  if (isUndefined(currentKey)) {
    if (isUndefined(newKey)) return { ...acc, preKeySpans: [...preKeySpans, span] };
    return { ...acc, currentKey: newKey, spansOfKey: { ...spansOfKey, [newKey]: [] } };
  }

  if (!isUndefined(newKey)) {
    return { ...acc, currentKey: newKey, spansOfKey: { ...spansOfKey, [newKey]: [] } };
  }

  const currentSpans = spansOfKey[currentKey];
  if (isUndefined(currentSpans)) throw Error();

  const newCurrentSpans = [...currentSpans, span];
  const newSpansOfKey = { ...spansOfKey, [currentKey]: newCurrentSpans };
  return { ...acc, spansOfKey: newSpansOfKey };
}

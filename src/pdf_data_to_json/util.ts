import { Structure } from './../legal/structure/index';
import { chain, curry, isUndefined } from 'lodash';
import { Span, neverNum } from '../util';
import { SpanIdKeyMap } from './babs_spans_to_key_ids';
import { Context } from './key_ids_to_babs';

type Acc = {
  spansOfKey: SpansOfKey;
  preKeySpans: Span[];
  currentKey?: number;
};

type SpansOfKey = { [key: number]: Span[] };
type ToStructureWith<T extends Structure> = (context: Context, keySpans: [string, Span[]]) => T;
type StructureUtil<T extends Structure> = {
  spanIdKeyMap: SpanIdKeyMap;
  toStructure: (keySpans: [string, Span[]][]) => T[];
};

export function spanIdKeyMapOf<A extends Structure, B extends Structure>(
  map1: [SpanIdKeyMap, ToStructureWith<A>],
  map2: [SpanIdKeyMap, ToStructureWith<B>],
  spans: Span[],
  context: Context
): StructureUtil<A> | StructureUtil<B> {
  return (getMinInRange(map1[0], spans) ?? Infinity) < (getMinInRange(map2[0], spans) ?? Infinity)
    ? transform(map1, context)
    : transform(map2, context);
}

function transform<T extends Structure>(
  map1: [SpanIdKeyMap, ToStructureWith<T>],
  context: Context
): StructureUtil<T> {
  return {
    spanIdKeyMap: map1[0],
    toStructure: (keySpans: [string, Span[]][]) => keySpans.map(curry(map1[1])(context)),
  };
}

function getMinInRange(map: SpanIdKeyMap, spans: Span[]): number | undefined {
  return chain(map)
    .keys()
    .map((key) => parseInt(key))
    .filter((id) => id >= (spans[0]?.id ?? neverNum()))
    .filter((id) => id <= (spans.slice(-1)[0]?.id ?? neverNum()))
    .min()
    .value();
}

export const toSpansWith = curry(_toSpansWith);

function _toSpansWith(keyOfId: SpanIdKeyMap, spans: Span[]): Acc {
  return spans.reduce(toSpans(keyOfId), { spansOfKey: {}, preKeySpans: [] });
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

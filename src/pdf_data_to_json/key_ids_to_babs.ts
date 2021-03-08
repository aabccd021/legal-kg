import { chain, curry, isUndefined } from 'lodash';
import { Bab } from '../legal/structure/bab';
import { neverNum, Span } from '../util';
import { BabKeySpanIds, SpanIdKeyMap } from './babs_spans_to_key_ids';

export function babsOfKeyIds(spanKeyIds: BabKeySpanIds, spans: Span[]): Bab[] {
  return chain(spans)
    .reduce(toSpansWith(spanKeyIds.babKeyOfid), initialSpans)
    .thru(({ spansOfKey }) => spansOfKey)
    .toPairs()
    .map(spansToBabWith(spanKeyIds))
    .value();
}

type Acc = {
  spansOfKey: SpansOfKey;
  preKeySpans: Span[];
  currentKey?: number;
};

type SpansOfKey = { [key: number]: Span[] };

const spansToBabWith = curry(spansToBab);
function spansToBab(keySpanIds: BabKeySpanIds, keySpans: [string, Span[]]): Bab {
  const { bagianKeyOfId, pasalKeyOfId } = keySpanIds;
  const [key, spans] = keySpans;
  const spanIdKeyMap = spanIdKeyMapOf(bagianKeyOfId, pasalKeyOfId, spans);
  const { preKeySpans, spansOfKey: _ } = spans.reduce(toSpansWith(spanIdKeyMap), initialSpans);
  return {
    _type: 'bab',
    _key: parseInt(key),
    _judul: preKeySpans.map(({ str }) => str).join(' '),
    isi: [],
    text: '',
  };
}

function spanIdKeyMapOf(map1: SpanIdKeyMap, map2: SpanIdKeyMap, spans: Span[]): SpanIdKeyMap {
  return (getMinInRange(map1, spans) ?? Infinity) < (getMinInRange(map2, spans) ?? Infinity)
    ? map1
    : map2;
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

const initialSpans: Acc = { spansOfKey: {}, preKeySpans: [] };
const toSpansWith = curry(toSpans);
export function toSpans(keyOfId: SpanIdKeyMap, acc: Acc, span: Span): Acc {
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

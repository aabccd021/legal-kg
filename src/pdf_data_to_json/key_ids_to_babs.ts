import { chain, curry, isUndefined } from 'lodash';
import { Span } from '../util';
import { BabKeySpanIds } from './babs_spans_to_key_ids';

export function babsOfKeyIds(spanKeyIds: BabKeySpanIds, spans: Span[]): SpansOfKey {
  const initial: Acc = { spansOfKey: {} };
  return chain(spans)
    .reduce(toBabsSpansWith(spanKeyIds), initial)
    .thru(({ spansOfKey }) => spansOfKey)
    .value();
  // .toPairs();
}

type Acc = {
  spansOfKey: SpansOfKey;
  currentKey?: number;
};

type SpansOfKey = { [key: number]: Span[] };

const toBabsSpansWith = curry(toBabsSpans);

export function toBabsSpans(keySpanIds: BabKeySpanIds, acc: Acc, span: Span): Acc {
  const { spansOfKey, currentKey } = acc;
  const { babKeyOfid } = keySpanIds;
  const newKey = babKeyOfid[span.id];

  if (isUndefined(currentKey)) {
    if (newKey !== 1) throw Error('impossible');
    // first
    const newSpansOfKey = { [newKey]: [] };
    return { ...acc, currentKey: newKey, spansOfKey: newSpansOfKey };
  }

  if (!isUndefined(newKey)) {
    const newSpansOfKey = { ...spansOfKey, [newKey]: [] };
    return { ...acc, currentKey: newKey, spansOfKey: newSpansOfKey };
  }

  const currentSpans = spansOfKey[currentKey];
  if (isUndefined(currentSpans)) throw Error(JSON.stringify(acc));

  const newCurrentSpans = [...currentSpans, span];
  const newSpansOfKey = { ...spansOfKey, [currentKey]: newCurrentSpans };
  return { ...acc, spansOfKey: newSpansOfKey };
}

// function babOfSpans(spans: Span[]): Bab[] {}

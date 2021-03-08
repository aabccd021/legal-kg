import { chain, curry, isUndefined } from 'lodash';
import { Span } from '../util';
import { BabKeySpanIds, SpanIdKeyMap } from './babs_spans_to_key_ids';

export function babsOfKeyIds(spanKeyIds: BabKeySpanIds, spans: Span[]): Acc {
  const initial: Acc = { spansOfKey: {}, preKeySpans: [] };
  return (
    chain(spans)
      .reduce(toBabsSpansWith(spanKeyIds.babKeyOfid), initial)
      // .thru(({ spansOfKey }) => spansOfKey)
      .value()
  );
  // .toPairs()
  // .map(spansToBabWith(spanKeyIds))
  // .value();
}

type Acc = {
  spansOfKey: SpansOfKey;
  preKeySpans: Span[];
  currentKey?: number;
};

type SpansOfKey = { [key: number]: Span[] };

const toBabsSpansWith = curry(toBabsSpans);

export function toBabsSpans(keyOfId: SpanIdKeyMap, acc: Acc, span: Span): Acc {
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

// const spansToBabWith = curry(spansToBab);

// function spansToBab(_keySpanIds: BabKeySpanIds, keySpans: [string, Span[]]): Bab {
//   const [key] = keySpans;
// const pasalSpans = ;
// return { _type: 'bab', _key: parseInt(key), _judul: '', isi: [], text: '' };
// }

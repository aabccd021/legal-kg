import { chain, curry } from 'lodash';
import { Bab } from '../legal/structure/bab';
import { Span } from '../util';
import { BabKeySpanIds } from './babs_spans_to_key_ids';
import { spanIdKeyMapOf, toSpansWith } from './util';

export function babsOfKeyIds(spanKeyIds: BabKeySpanIds, spans: Span[]): Bab[] {
  return chain(spans)
    .thru(toSpansWith(spanKeyIds.babKeyOfid))
    .thru(({ spansOfKey }) => spansOfKey)
    .toPairs()
    .map(spansToBabWith(spanKeyIds))
    .value();
}

const spansToBabWith = curry(spansToBab);
function spansToBab(keySpanIds: BabKeySpanIds, keySpans: [string, Span[]]): Bab {
  const { bagianKeyOfId, pasalKeyOfId } = keySpanIds;
  const [key, spans] = keySpans;
  const childStructure = spanIdKeyMapOf(['bagian', bagianKeyOfId], ['pasal', pasalKeyOfId], spans);
  const spanIdKeyMap = childStructure === 'bagian' ? bagianKeyOfId : pasalKeyOfId;
  const { preKeySpans, spansOfKey } = toSpansWith(spanIdKeyMap, spans);
  const _judul = preKeySpans.map(({ str }) => str).join(' ');
  const _key = parseInt(key);
  const text = chain(spansOfKey)
    .values()
    .flatMap((span) => span.map(({ str }) => str))
    .join('\n')
    .value();
  return { _type: 'bab', _key, _judul, isi: [], text };
}

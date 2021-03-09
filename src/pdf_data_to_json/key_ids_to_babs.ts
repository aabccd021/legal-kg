import { Paragraf } from './../legal/structure/paragraf';
import { chain, curry } from 'lodash';
import { ReferenceText } from '../legal/reference';
import { Bab } from '../legal/structure/bab';
import { Bagian } from '../legal/structure/bagian';
import { Pasal } from '../legal/structure/pasal';
import { Span } from '../util';
import { KeyIds } from './babs_spans_to_key_ids';
import { spanIdKeyMapOf, toSpansWith } from './util';

export function babsOfKeyIds(spanKeyIds: KeyIds, spans: Span[]): Bab[] {
  return chain(spans)
    .thru(toSpansWith(spanKeyIds.babKeyOfid))
    .thru(({ spansOfKey }) => spansOfKey)
    .toPairs()
    .map(spansToBabWith(spanKeyIds))
    .value();
}

const spansToBabWith = curry(spansToBab);
function spansToBab(keyIds: KeyIds, keySpans: [string, Span[]]): Bab {
  const { bagianKeyOfId, pasalKeyOfId } = keyIds;
  const [key, spans] = keySpans;
  const { spanIdKeyMap, toStructure } = spanIdKeyMapOf(
    [bagianKeyOfId, spansToBagian],
    [pasalKeyOfId, spansToPasal],
    spans,
    keyIds
  );
  const { preKeySpans, spansOfKey } = toSpansWith(spanIdKeyMap, spans);
  const isi = chain(spansOfKey).toPairs().thru<Bagian[] | Pasal[]>(toStructure).value();
  const _judul = preKeySpans.map(({ str }) => str).join(' ');
  const _key = parseInt(key);
  return { _type: 'bab', _key, _judul, isi };
}

function spansToBagian(keyIds: KeyIds, keySpans: [string, Span[]]): Bagian {
  const { paragrafKeyOfId, pasalKeyOfId } = keyIds;
  const [key, spans] = keySpans;
  const { spanIdKeyMap, toStructure } = spanIdKeyMapOf(
    [paragrafKeyOfId, spansToParagraf],
    [pasalKeyOfId, spansToPasal],
    spans,
    keyIds
  );
  const { preKeySpans, spansOfKey } = toSpansWith(spanIdKeyMap, spans);
  const isi = chain(spansOfKey).toPairs().thru<Paragraf[] | Pasal[]>(toStructure).value();
  const _judul = preKeySpans.map(({ str }) => str).join(' ');
  const _key = parseInt(key);
  return { _type: 'bagian', _key, _judul, isi };
}

function spansToParagraf(keyIds: KeyIds, keySpans: [string, Span[]]): Paragraf {
  const { pasalKeyOfId } = keyIds;
  const [key, spans] = keySpans;
  const { preKeySpans, spansOfKey } = toSpansWith(pasalKeyOfId, spans);
  const isi = chain(spansOfKey).toPairs().map<Pasal>(curry(spansToPasal)(keyIds)).value();
  const _judul = preKeySpans.map(({ str }) => str).join(' ');
  const _key = parseInt(key);
  return { _type: 'paragraf', _key, _judul, isi };
}

function spansToPasal(_: KeyIds, keySpans: [string, Span[]]): Pasal {
  // const { paragrafKeyOfId, pasalKeyOfId } = keyIds;
  const [key, spans] = keySpans;
  // const childStructure = spanIdKeyMapOf(
  //   ['paragraf', paragrafKeyOfId],
  //   ['pasal', pasalKeyOfId],
  //   spans
  // );
  // const spanIdKeyMap = childStructure === 'paragraf' ? paragrafKeyOfId : pasalKeyOfId;
  // const { spansOfKey } = toSpansWith(spanIdKeyMap, spans);
  const _key = parseInt(key);
  const text = chain(spans)
    .map(({ str }) => str)
    .join(' ')
    .thru(stringToEmptyReference)
    .value();
  return { _type: 'pasal', _key, isi: [], text };
}

function stringToEmptyReference(text: string): ReferenceText {
  return { _type: 'referenceText', references: [], text };
}

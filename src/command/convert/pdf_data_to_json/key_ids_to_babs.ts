import {
  AmendDeletePasalPoint,
  AmendedPoint,
  AmendInsertPasalPoint,
  AmendUpdatePasalPoint,
} from '../../../legal/structure/amend';
import { Paragraf, Paragrafs } from '../../../legal/structure/paragraf';
import { chain, curry, isEmpty, isUndefined } from 'lodash';
import { ReferenceText } from '../../../legal/reference';
import { Bab } from '../../../legal/structure/bab';
import { Bagian, Bagians } from '../../../legal/structure/bagian';
import { IsiPasal, Pasal, Pasals } from '../../../legal/structure/pasal';
import { Span } from '../../../util';
import { KeyIds } from './babs_spans_to_key_ids';
import { spansInRange, spanIdKeyMapOf, toSpansWith } from './util';
import { AmendPoints } from '../../../legal/structure/amend';
import { Ayat, Ayats } from '../../../legal/structure/ayat';

export type Context = {
  hasAmendPasal: boolean;
  keyIds: KeyIds;
};

export function babsOfKeyIds(context: Context, spans: Span[]): Bab[] {
  return chain(spans)
    .thru(toSpansWith(context.keyIds.babKeyOfid))
    .thru(({ spansOfKey }) => spansOfKey)
    .toPairs()
    .map(spansToBabWith(context))
    .value();
}

const spansToBabWith = curry(spansToBab);
function spansToBab(context: Context, keySpans: [string, Span[]]): Bab {
  const { bagianKeyOfId, pasalKeyOfId } = context.keyIds;
  const [key, spans] = keySpans;
  const { spanIdKeyMap, toStructure } = spanIdKeyMapOf<Bagian, Pasal, Bagians, Pasals>(
    [bagianKeyOfId, spansToBagian, (bagians) => ({ _type: 'bagians', bagians })],
    [pasalKeyOfId, spansToPasal, (pasals) => ({ _type: 'pasals', pasals })],
    spans,
    context
  );
  const { preKeySpans, spansOfKey } = toSpansWith(spanIdKeyMap, spans);
  const isi = chain(spansOfKey).toPairs().thru<Bagians | Pasals>(toStructure).value();
  const _judul = preKeySpans.map(({ str }) => str).join(' ');
  const _key = parseInt(key);
  return { _type: 'bab', _key, _judul, isi };
}

function spansToBagian(context: Context, keySpans: [string, Span[]]): Bagian {
  const { paragrafKeyOfId, pasalKeyOfId } = context.keyIds;
  const [key, spans] = keySpans;
  const { spanIdKeyMap, toStructure } = spanIdKeyMapOf<Paragraf, Pasal, Paragrafs, Pasals>(
    [paragrafKeyOfId, spansToParagraf, (paragrafs) => ({ _type: 'paragrafs', paragrafs })],
    [pasalKeyOfId, spansToPasal, (pasals) => ({ _type: 'pasals', pasals })],
    spans,
    context
  );
  const { preKeySpans, spansOfKey } = toSpansWith(spanIdKeyMap, spans);
  const isi = chain(spansOfKey).toPairs().thru<Paragrafs | Pasals>(toStructure).value();
  const _judul = preKeySpans.map(({ str }) => str).join(' ');
  const _key = parseInt(key);
  return { _type: 'bagian', _key, _judul, isi };
}

function spansToParagraf(context: Context, keySpans: [string, Span[]]): Paragraf {
  const { pasalKeyOfId } = context.keyIds;
  const [key, spans] = keySpans;
  const { preKeySpans, spansOfKey } = toSpansWith(pasalKeyOfId, spans);
  const pasals = chain(spansOfKey).toPairs().map(spansToPasalWith(context)).value();
  const isi: Pasals = { _type: 'pasals', pasals };
  const _judul = preKeySpans.map(({ str }) => str).join(' ');
  const _key = parseInt(key);
  return { _type: 'paragraf', _key, _judul, isi };
}

const spansToPasalWith = curry(spansToPasal);
function spansToPasal(context: Context, keySpans: [string, Span[]]): Pasal {
  const [key, spans] = keySpans;
  const isi = isiPasalOf(context, spans);
  const _key = parseInt(key);
  return { _type: 'pasal', _key, isi };
}

function isiPasalOf(context: Context, spans: Span[]): IsiPasal {
  const { keyIds, hasAmendPasal } = context;
  const { amendNomorKeyOfId } = keyIds;
  if (hasAmendPasal && !isEmpty(spansInRange(amendNomorKeyOfId, spans))) {
    return amendPointsOf(context, spans);
  }
  return ayatsOf(context, spans) ?? emptyReferenceOf(spans);
}

function ayatsOf(context: Context, spans: Span[]): Ayats | undefined {
  const { ayatKeyOfId } = context.keyIds;
  const { spansOfKey } = toSpansWith(ayatKeyOfId, spans);
  if (isEmpty(spansOfKey)) return undefined;
  const ayats = chain(spansOfKey).toPairs().map(spanToAyatWith(context)).value();
  return { _type: 'ayats', ayats };
}

const spanToAyatWith = curry(spanToAyat);
function spanToAyat(_: Context, keySpans: [string, Span[]]): Ayat {
  const [key, spans] = keySpans;
  const _key = parseInt(key);
  // const linesWithoutKey = removeKeyFromLines(lines, ayatRegexp);
  // const isi = getPoints(linesWithoutKey);
  // const text = stringToEmptyReference(linesWithoutKey.join(' '));

  return { _type: 'ayat', _key, isi: emptyReferenceOf(spans) };
}

function amendPointsOf(context: Context, spans: Span[]): AmendPoints {
  const { keyIds } = context;
  const { amendNomorKeyOfId } = keyIds;
  const { preKeySpans, spansOfKey } = toSpansWith(amendNomorKeyOfId, spans);
  const isi = chain(spansOfKey).toPairs().map(spansToAmendedPointWith(context)).compact().value();
  const description = emptyReferenceOf(preKeySpans);
  return { _type: 'amendPoints', description, isi: isi };
}

const spansToAmendedPointWith = curry(spansToAmendedPoint);
function spansToAmendedPoint(
  context: Context,
  keySpans: [string, Span[]]
): AmendedPoint | undefined {
  const res =
    spansToAmendDeletePasalPoint(context, keySpans) ??
    spansToAmendUpdatePasalPoint(context, keySpans) ??
    spansToAmendInsertPasalPoint(context, keySpans);
  if (isUndefined(res)) {
    const firstSpan = keySpans[1][0];
    console.log(
      `Unparsed amend: id:${firstSpan?.id}, pageNum:${firstSpan?.pageNum}, str:${firstSpan?.str}`
    );
  }
  return res;
}

function spansToAmendDeletePasalPoint(
  context: Context,
  keySpans: [string, Span[]]
): AmendDeletePasalPoint | undefined {
  const [nomorKey, spans] = keySpans;
  const _nomorKey = parseInt(nomorKey);
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const _pasalKey = context.keyIds.amendDeletePasalKeyOfId[firstSpanId];
  if (isUndefined(_pasalKey)) return undefined;
  const isi = emptyReferenceOf(spans);
  return { _type: 'amendPoint', _nomorKey, _operation: 'delete', _pasalKey, isi };
}

function spansToAmendUpdatePasalPoint(
  context: Context,
  keySpans: [string, Span[]]
): AmendUpdatePasalPoint | undefined {
  const [nomorKey, spans] = keySpans;
  const _nomorKey = parseInt(nomorKey);
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const _pasalKey = context.keyIds.amendUpdatePasalKeyOfId[firstSpanId];
  if (isUndefined(_pasalKey)) return undefined;
  const isi = emptyReferenceOf(spans);
  return { _type: 'amendPoint', _operation: 'update', _nomorKey, _pasalKey, isi };
}

function spansToAmendInsertPasalPoint(
  context: Context,
  keySpans: [string, Span[]]
): AmendInsertPasalPoint | undefined {
  const [nomorKey, spans] = keySpans;
  const _nomorKey = parseInt(nomorKey);
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const _pasalKeys = context.keyIds.amendInsertPasalKeyOfId[firstSpanId];
  if (isUndefined(_pasalKeys)) return undefined;
  const isi = emptyReferenceOf(spans);
  return { _type: 'amendPoint', _operation: 'insert', _nomorKey, _pasalKeys, isi };
}

function emptyReferenceOf(spans: Span[]): ReferenceText {
  return chain(spans)
    .map(({ str }) => str)
    .join(' ')
    .thru<ReferenceText>((text) => ({ _type: 'referenceText', references: [], text }))
    .value();
}

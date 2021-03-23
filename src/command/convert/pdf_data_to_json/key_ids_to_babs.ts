import { IsiAmendPasal } from './../../../legal/structure/amend';
import {
  AmendDeletePasalPoint,
  AmendedPoint,
  AmendInsertPasalPoint,
  AmendUpdatePasalPoint,
} from '../../../legal/structure/amend';
import { Paragraf, Paragrafs } from '../../../legal/structure/paragraf';
import { chain, curry, isEmpty, isUndefined, keys, mapValues, reduce } from 'lodash';
import { ReferenceText } from '../../../legal/reference';
import { Bab } from '../../../legal/structure/bab';
import { Bagian, Bagians } from '../../../legal/structure/bagian';
import { IsiPasal, Pasal, Pasals } from '../../../legal/structure/pasal';
import { lastOf, neverUndefined, Span } from '../../../util';
import { KeyIds } from './scan';
import { spansInRange, spanIdKeyMapOf, toSpansWith } from './util';
import { AmendPoints } from '../../../legal/structure/amend';
import { Ayat, Ayats } from '../../../legal/structure/ayat';
import {
  hurufKeyOfSpan,
  nomorKeyOfSpan,
  removeAyatKey,
  removeHurufKey,
  removeNomorKey,
  safeParseInt,
} from './parse_key_from_spans';
import { Point, Points } from '../../../legal/structure/point';
import assertNever from 'assert-never';
import { DocumentNode } from '../../../legal/document';

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

export type KeySpans = [string, Span[]];

const spansToBabWith = curry(spansToBab);
function spansToBab(context: Context, keySpans: KeySpans): Bab {
  const { bagianKeyOfId, pasalKeyOfId } = context.keyIds;
  const [key, spans] = keySpans;
  const { spanIdKeyMap, toStructure } = spanIdKeyMapOf<Bagian, Pasal, Bagians, Pasals>(
    [bagianKeyOfId, spansToBagian, (bagians) => ({ _type: 'bagians', bagians })],
    [pasalKeyOfId, spansToPasal, (pasals) => ({ _type: 'pasals', pasals })],
    spans,
    context
  );
  const { preKeySpans, spansOfKey } = toSpansWith(spanIdKeyMap, spans.slice(1));
  const isi = chain(spansOfKey).toPairs().thru<Bagians | Pasals>(toStructure).value();
  const _judul = preKeySpans.map(({ str }) => str).join(' ');
  const _key = parseInt(key);
  return { _type: 'bab', _key, _judul, isi };
}

function spansToBagian(context: Context, keySpans: KeySpans): Bagian {
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

function spansToParagraf(context: Context, keySpans: KeySpans): Paragraf {
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
function spansToPasal(context: Context, keySpans: KeySpans): Pasal {
  const [key, spans] = keySpans;
  const isi = isiPasalOf(context, spans.slice(1));
  const _key = parseInt(key);
  return { _type: 'pasal', _key, isi };
}

function isiPasalOf(context: Context, spans: Span[]): IsiPasal {
  const { keyIds, hasAmendPasal } = context;
  const { amendNomorKeyOfId } = keyIds;
  if (hasAmendPasal && !isEmpty(spansInRange(amendNomorKeyOfId, spans))) {
    return amendPointsOf(context, spans);
  }
  return ayatsOf(context, spans) ?? pointsOf(context, spans) ?? toEmptyReference(spans);
}

function ayatsOf(context: Context, spans: Span[]): Ayats | undefined {
  const { ayatKeyOfId } = context.keyIds;
  const { spansOfKey } = toSpansWith(ayatKeyOfId, spans);
  if (isEmpty(spansOfKey)) return undefined;
  const ayats = chain(spansOfKey).toPairs().map(spanToAyatWith(context)).value();
  return { _type: 'ayats', ayats };
}

function amendAyatsOf(context: Context, spans: Span[]): Ayats | undefined {
  const { amendAyatKeyOfId } = context.keyIds;
  const { spansOfKey } = toSpansWith(amendAyatKeyOfId, spans);
  if (isEmpty(spansOfKey)) return undefined;
  const ayats = chain(spansOfKey).toPairs().map(spanToAyatWith(context)).value();
  return { _type: 'ayats', ayats };
}

function pointsOf(context: Context, spans: Span[]): Points | undefined {
  for (const [spanIdx, span] of spans.entries()) {
    if (nomorKeyOfSpan(span) === 1) {
      return _getPoints(context, 'numPoint', spans, spanIdx);
    }

    if (hurufKeyOfSpan(span) === 'a'.charCodeAt(0)) {
      return _getPoints(context, 'alphaPoint', spans, spanIdx);
    }
  }

  return undefined;
}

type PointType = 'numPoint' | 'alphaPoint';

function _getPoints(context: Context, _type: PointType, spans: Span[], spanIdx: number): Points {
  const isi = chain(spans)
    .slice(spanIdx)
    .reduce<Acc>(toKeySpansWith(context, _type), { keySpans: [] })
    .thru(({ keySpans }) => keySpans)
    .map(toPointWith(context, _type))
    .value();
  const _description = toEmptyReference(spans.slice(0, spanIdx));
  return { _type: 'points', _description, isi };
}

const toPointWith = curry(toPoint);
function toPoint(context: Context, _type: PointType, keySpans: KeySpans): Point {
  const [_key, spans] = keySpans;
  const isi = pointsOf(context, spans) ?? toEmptyReference(spans);
  const point: Point = { _type, _key, isi };

  return point;
}

type Acc = {
  keySpans: KeySpans[];
  lastKey?: number;
};

const toKeySpansWith = curry(toKeySpans);
function toKeySpans(context: Context, _type: PointType, acc: Acc, span: Span): Acc {
  const { lastKey, keySpans } = acc;
  const newKey = keyOfSpanOf(context, _type)(span);
  if (!isUndefined(newKey) && (isUndefined(lastKey) || newKey === lastKey + 1)) {
    const cleanedSpan = removeKeyOf(_type)(span);
    const strKey = strOfKeyInt(_type)(newKey);
    const newKeySpans: KeySpans[] = [...keySpans, [strKey, [cleanedSpan]]];
    return { ...acc, keySpans: newKeySpans, lastKey: newKey };
  }
  const firsts = keySpans.slice(0, -1);
  const last = lastOf(keySpans);
  if (isUndefined(last)) throw Error();
  const lastSpans = last[1];
  const newLastSpans: Span[] = [...lastSpans, span];
  const newLast: KeySpans = [last[0], newLastSpans];
  const newKeySpans: KeySpans[] = [...firsts, newLast];
  return { ...acc, keySpans: newKeySpans };
}

function removeKeyOf(_type: PointType): (span: Span) => Span {
  if (_type === 'alphaPoint') return removeHurufKey;
  if (_type === 'numPoint') return removeNomorKey;
  assertNever(_type);
}

function keyOfSpanOf(context: Context, _type: PointType): (span: Span) => number | undefined {
  if (_type === 'alphaPoint') return hurufKeyOfSpan;
  if (_type === 'numPoint')
    return (span) => context.keyIds.nomorKeyOfId[span.id] ?? nomorKeyOfSpan(span);
  assertNever(_type);
}

function strOfKeyInt(_type: PointType): (number: number) => string {
  if (_type === 'numPoint') return (number) => number.toString();
  if (_type === 'alphaPoint') return (number) => String.fromCharCode(number);
  assertNever(_type);
}

const spanToAyatWith = curry(spanToAyat);
function spanToAyat(context: Context, keySpans: KeySpans): Ayat {
  const [key, spans] = keySpans;
  const _key = parseInt(key);
  const spansWithoutKey = removeAyatKey(spans);
  const isi = pointsOf(context, spansWithoutKey) ?? toEmptyReference(spansWithoutKey);
  return { _type: 'ayat', _key, isi };
}

function amendPointsOf(context: Context, spans: Span[]): AmendPoints {
  const { keyIds } = context;
  const { amendNomorKeyOfId } = keyIds;
  const { preKeySpans, spansOfKey } = toSpansWith(amendNomorKeyOfId, spans);
  const isi = chain(spansOfKey).toPairs().map(spansToAmendedPointWith(context)).compact().value();
  const description = toEmptyReference(preKeySpans);
  const documentNode = getAmendedDocumentNode(preKeySpans);
  return { _type: 'amendPoints', description, isi, documentNode };
}

function getAmendedDocumentNode(spans: Span[]): DocumentNode {
  const str = spans.map(toStr).join(' ');
  const [, _nomor, , _tahun] =
    str
      .replace('Undang- Undang', 'Undang-Undang')
      .replaceAll('Nomor ', '')
      ?.match(/Undang-Undang [0-9]+ Tahun [0-9]+/)?.[0]
      ?.split(' ') ?? [];
  const nomor = safeParseInt(_nomor);
  const tahun = safeParseInt(_tahun);
  if (!isUndefined(nomor) && !isUndefined(tahun)) return { _documentType: 'uu', nomor, tahun };
  throw Error(`Legal Not Detected ${str}`);
}

const spansToAmendedPointWith = curry(spansToAmendedPoint);
function spansToAmendedPoint(context: Context, keySpans: KeySpans): AmendedPoint | undefined {
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
  keySpans: KeySpans
): AmendDeletePasalPoint | undefined {
  const [nomorKey, spans] = keySpans;
  const _nomorKey = parseInt(nomorKey);
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const _pasalKey = context.keyIds.amendDeletePasalKeyOfId[firstSpanId];
  if (isUndefined(_pasalKey)) return undefined;
  const isi = toEmptyReference(spans);
  return { _type: 'amendPoint', _nomorKey, _operation: 'delete', _pasalKey, isi };
}

function spansToAmendUpdatePasalPoint(
  context: Context,
  keySpans: KeySpans
): AmendUpdatePasalPoint | undefined {
  const { amendUpdatePasalKeyOfId, selfAmendPasalKeyOfId } = context.keyIds;
  const [nomorKey, spans] = keySpans;
  const _nomorKey = parseInt(nomorKey);
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const _pasalKey = amendUpdatePasalKeyOfId[firstSpanId];
  if (isUndefined(_pasalKey)) return undefined;
  const pasalTitleIdx =
    chain(spans)
      .toPairs()
      .filter(([, span]) => selfAmendPasalKeyOfId.includes(span.id))
      .map(([idx]) => parseInt(idx))
      .first()
      .value() ?? 0;
  if (pasalTitleIdx === 0) console.log('UND', spans[0]);
  const _descSpans = spans.slice(0, pasalTitleIdx);
  const [descFirst, ...descRest] = _descSpans;
  const descSpans = !isUndefined(descFirst) ? [removeNomorKey(descFirst), ...descRest] : _descSpans;
  const description = toEmptyReference(descSpans);
  const isiSpans = spans.slice(pasalTitleIdx + 1);
  const isi = spansToIsiAmendPasal(context, isiSpans);
  return { _type: 'amendPoint', _operation: 'update', _nomorKey, _pasalKey, isi, description };
}

function spansToIsiAmendPasal(context: Context, spans: Span[]): IsiAmendPasal {
  return amendAyatsOf(context, spans) ?? pointsOf(context, spans) ?? toEmptyReference(spans);
}

function spansToAmendInsertPasalPoint(
  context: Context,
  keySpans: KeySpans
): AmendInsertPasalPoint | undefined {
  const [nomorKey, spans] = keySpans;
  const _nomorKey = parseInt(nomorKey);
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const pasalData = context.keyIds.amendInsertPasalKeyOfId[firstSpanId];
  if (isUndefined(pasalData)) return undefined;
  if (isEmpty(pasalData)) {
    const description = toEmptyReference(spans);
    console.log('Insert not detected', { pasalData }, { nomorKey, spans });
    return { _type: 'amendPoint', _operation: 'insert', _nomorKey, description, isi: {} };
  }
  const pasalDataKeys = keys(pasalData).map((t) => parseInt(t));
  const firstPasalTitleIdx =
    chain(spans)
      .toPairs()
      .filter(([, span]) => pasalDataKeys.includes(span.id))
      .map(([idx]) => parseInt(idx))
      .first()
      .value() ?? 0;
  if (firstPasalTitleIdx === 0) console.log('UNDI', spans[0]);
  const _descSpans = spans.slice(0, firstPasalTitleIdx);
  const [descFirst, ...descRest] = _descSpans;
  const descSpans = !isUndefined(descFirst) ? [removeNomorKey(descFirst), ...descRest] : _descSpans;
  const description = toEmptyReference(descSpans);
  const isiSpans = spans.slice(firstPasalTitleIdx);
  const reducedIsiSpans = reduce<Span, { record: Record<string, Span[]>; lastPasalKey?: string }>(
    isiSpans,
    (acc, span) => {
      const { record, lastPasalKey } = acc;
      const newPasalKey = pasalData[span.id];
      if (!isUndefined(newPasalKey)) return { ...acc, lastPasalKey: newPasalKey };
      const pasalKey = neverUndefined(lastPasalKey);
      const pasalStrArr = record[pasalKey] ?? [];
      const newRecord = { ...record, [pasalKey]: [...pasalStrArr, span] };
      return { ...acc, record: newRecord };
    },
    { record: {} }
  );
  const isi = mapValues(reducedIsiSpans.record, (spans) => spansToIsiAmendPasal(context, spans));
  return { _type: 'amendPoint', _operation: 'insert', _nomorKey, description, isi };
}

function toEmptyReference(spans: Span[]): ReferenceText {
  return chain(spans)
    .map(({ str }) => str)
    .join(' ')
    .thru<ReferenceText>((text) => ({ _type: 'referenceText', references: [], text }))
    .value();
}

export function toStr(span: Span): string {
  return span.str;
}

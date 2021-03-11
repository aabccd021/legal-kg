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
import { lastOf, Span } from '../../../util';
import { KeyIds } from './babs_spans_to_key_ids';
import { spansInRange, spanIdKeyMapOf, toSpansWith } from './util';
import { AmendPoints } from '../../../legal/structure/amend';
import { Ayat, Ayats } from '../../../legal/structure/ayat';
import {
  hurufKeyOfSpan,
  nomorKeyOfSpan,
  removeAyatKey,
  removeHurufKey,
  removeNomorKey,
} from './parse_key_from_spans';
import { Point, Points } from '../../../legal/structure/point';
import assertNever from 'assert-never';

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
  return ayatsOf(context, spans) ?? pointsOf(spans) ?? emptyReferenceOf(spans);
}

function ayatsOf(context: Context, spans: Span[]): Ayats | undefined {
  const { ayatKeyOfId } = context.keyIds;
  const { spansOfKey } = toSpansWith(ayatKeyOfId, spans);
  if (isEmpty(spansOfKey)) return undefined;
  const ayats = chain(spansOfKey).toPairs().map(spanToAyat).value();
  return { _type: 'ayats', ayats };
}

function pointsOf(spans: Span[]): Points | undefined {
  for (const [spanIdx, span] of spans.entries()) {
    if (nomorKeyOfSpan(span) === 1) {
      return _getPoints('numPoint', spans, spanIdx);
    }

    if (hurufKeyOfSpan(span) === 'a'.charCodeAt(0)) {
      return _getPoints('alphaPoint', spans, spanIdx);
    }
  }

  return undefined;
}

type PointType = 'numPoint' | 'alphaPoint';

function _getPoints(_type: PointType, spans: Span[], spanIdx: number): Points {
  const isi = chain(spans)
    .slice(spanIdx)
    .reduce<Acc>(toKeySpansWith(_type), { keySpans: [] })
    .thru(({ keySpans }) => keySpans)
    .map(toPointWith(_type))
    .value();
  const _description = emptyReferenceOf(spans.slice(0, spanIdx));
  return { _type: 'points', _description, isi };
}

const toPointWith = curry(toPoint);
function toPoint(_type: PointType, keySpans: KeySpans): Point {
  const [_key, spans] = keySpans;
  const isi = pointsOf(spans) ?? emptyReferenceOf(spans);
  const point: Point = { _type, _key, isi };

  return point;
}

type Acc = {
  keySpans: KeySpans[];
  lastKey?: number;
};

const toKeySpansWith = curry(toKeySpans);
function toKeySpans(_type: PointType, acc: Acc, span: Span): Acc {
  const { lastKey, keySpans } = acc;
  const newKey = keyOfSpanOf(_type)(span);
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

function keyOfSpanOf(_type: PointType): (span: Span) => number | undefined {
  if (_type === 'alphaPoint') return hurufKeyOfSpan;
  if (_type === 'numPoint') return nomorKeyOfSpan;
  assertNever(_type);
}

function strOfKeyInt(_type: PointType): (number: number) => string {
  if (_type === 'numPoint') return (number) => number.toString();
  if (_type === 'alphaPoint') return (number) => String.fromCharCode(number);
  assertNever(_type);
}

function spanToAyat(keySpans: KeySpans): Ayat {
  const [key, spans] = keySpans;
  const _key = parseInt(key);
  const spansWithoutKey = removeAyatKey(spans);
  const isi = pointsOf(spansWithoutKey) ?? emptyReferenceOf(spansWithoutKey);
  return { _type: 'ayat', _key, isi };
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
  const isi = emptyReferenceOf(spans);
  return { _type: 'amendPoint', _nomorKey, _operation: 'delete', _pasalKey, isi };
}

function spansToAmendUpdatePasalPoint(
  context: Context,
  keySpans: KeySpans
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
  keySpans: KeySpans
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

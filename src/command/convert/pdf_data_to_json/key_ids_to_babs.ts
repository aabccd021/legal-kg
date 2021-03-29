import { AmendedPasal } from '../../../legal/component/amend';
import {
  AmenderDeletePoint,
  AmendedPoint,
  AmenderInsertPoint,
  AmenderUpdatePoint,
} from '../../../legal/component/amend';
import { Paragraf, Paragrafs } from '../../../legal/component/paragraf';
import { chain, curry, isEmpty, isUndefined, keys, reduce } from 'lodash';
import { ReferenceText } from '../../../legal/reference';
import { Bab } from '../../../legal/component/bab';
import { Bagian, Bagians } from '../../../legal/component/bagian';
import { PasalContent, Pasal, PasalNode, Pasals } from '../../../legal/component/pasal';
import { lastOf, neverUndefined, Span } from '../../../util';
import { KeyIds } from './scan';
import { spansInRange, spanIdKeyMapOf, toSpansWith } from './util';
import { AmenderPoints } from '../../../legal/component/amend';
import { Ayat, Ayats } from '../../../legal/component/ayat';
import {
  hurufKeyOfSpan,
  nomorKeyOfSpan,
  removeAyatKey,
  removeHurufKey,
  removeNomorKey,
  safeParseInt,
} from './parse_key_from_spans';
import { Point, Points } from '../../../legal/component/point';
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
function spansToBab(context: Context, [key, spans]: KeySpans): Bab {
  const { bagianKeyOfId, pasalKeyOfId } = context.keyIds;
  const { spanIdKeyMap, toStructure } = spanIdKeyMapOf<Bagian, Pasal, Bagians, Pasals>(
    [bagianKeyOfId, spansToBagian, (bagians) => ({ type: 'bagians', bagianArr: bagians })],
    [pasalKeyOfId, spansToPasal, (pasals) => ({ type: 'pasals', pasalArr: pasals })],
    spans,
    context
  );
  const { preKeySpans, spansOfKey } = toSpansWith(spanIdKeyMap, spans.slice(1));
  return {
    type: 'bab',
    key: parseInt(key),
    title: preKeySpans.map(spanToStr).join(' '),
    content: chain(spansOfKey).toPairs().thru<Bagians | Pasals>(toStructure).value(),
  };
}

function spansToBagian(context: Context, [key, spans]: KeySpans): Bagian {
  const { paragrafKeyOfId, pasalKeyOfId } = context.keyIds;
  const { spanIdKeyMap, toStructure } = spanIdKeyMapOf<Paragraf, Pasal, Paragrafs, Pasals>(
    [
      paragrafKeyOfId,
      spansToParagraf,
      (paragrafs) => ({ type: 'paragrafs', paragrafArr: paragrafs }),
    ],
    [pasalKeyOfId, spansToPasal, (pasals) => ({ type: 'pasals', pasalArr: pasals })],
    spans,
    context
  );
  const { preKeySpans, spansOfKey } = toSpansWith(spanIdKeyMap, spans);
  return {
    type: 'bagian',
    key: parseInt(key),
    title: preKeySpans.map(spanToStr).join(' '),
    content: chain(spansOfKey).toPairs().thru<Paragrafs | Pasals>(toStructure).value(),
  };
}

function spansToParagraf(context: Context, [key, spans]: KeySpans): Paragraf {
  const { preKeySpans, spansOfKey } = toSpansWith(context.keyIds.pasalKeyOfId, spans);
  return {
    type: 'paragraf',
    key: parseInt(key),
    title: preKeySpans.map(({ str }) => str).join(' '),
    content: {
      type: 'pasals',
      pasalArr: chain(spansOfKey).toPairs().map(spansToPasalWith(context)).value(),
    },
  };
}

const spansToPasalWith = curry(spansToPasal);
function spansToPasal(context: Context, keySpans: KeySpans): Pasal {
  const [key, spans] = keySpans;
  const isi = isiPasalOf(context, spans.slice(1));
  const _key = parseInt(key);
  return { type: 'pasal', key: _key, content: isi };
}

function isiPasalOf(context: Context, spans: Span[]): PasalContent {
  const { keyIds, hasAmendPasal } = context;
  const { amendNomorKeyOfId } = keyIds;
  if (hasAmendPasal && !isEmpty(spansInRange(amendNomorKeyOfId, spans))) {
    return amenderPointsOf(context, spans);
  }
  return ayatsOf(context, spans) ?? pointsOf(context, spans) ?? toEmptyReference(spans);
}

function ayatsOf(context: Context, spans: Span[]): Ayats | undefined {
  const { ayatKeyOfId } = context.keyIds;
  const { spansOfKey } = toSpansWith(ayatKeyOfId, spans);
  if (isEmpty(spansOfKey)) return undefined;
  const ayats = chain(spansOfKey).toPairs().map(spanToAyatWith(context)).value();
  return { type: 'ayats', ayatArr: ayats };
}

function amendAyatsOf(context: Context, spans: Span[]): Ayats | undefined {
  const { amendAyatKeyOfId } = context.keyIds;
  const { spansOfKey } = toSpansWith(amendAyatKeyOfId, spans);
  if (isEmpty(spansOfKey)) return undefined;
  const ayats = chain(spansOfKey).toPairs().map(spanToAyatWith(context)).value();
  return { type: 'ayats', ayatArr: ayats };
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
  return { type: 'points', description: _description, content: isi };
}

const toPointWith = curry(toPoint);
function toPoint(context: Context, _type: PointType, keySpans: KeySpans): Point {
  const [_key, spans] = keySpans;
  const isi = pointsOf(context, spans) ?? toEmptyReference(spans);
  const point: Point = { type: _type, key: _key, content: isi };

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
  const spansWithoutKey = removeAyatKey(spans);
  return {
    type: 'ayat',
    key: parseInt(key),
    content: pointsOf(context, spansWithoutKey) ?? toEmptyReference(spansWithoutKey),
  };
}

function amenderPointsOf(context: Context, spans: Span[]): AmenderPoints {
  const { keyIds } = context;
  const { amendNomorKeyOfId } = keyIds;
  const { preKeySpans, spansOfKey } = toSpansWith(amendNomorKeyOfId, spans);
  const amendedDocument = getAmendedDocumentNode(preKeySpans);
  const amendedContext: AmendedContext = { context, amendedDocument };
  const isi = chain(spansOfKey)
    .toPairs()
    .map(spansToAmendedPointWith(amendedContext))
    .compact()
    .value();
  const description = toEmptyReference(preKeySpans);
  return {
    type: 'amenderPoints',
    description: description,
    amendedPointArr: isi,
    parent: amendedDocument,
  };
}

function getAmendedDocumentNode(spans: Span[]): DocumentNode {
  const str = spans.map(spanToStr).join(' ');
  const [, _nomor, , _tahun] =
    str
      .replace('Undang- Undang', 'Undang-Undang')
      .replaceAll('Nomor ', '')
      ?.match(/Undang-Undang [0-9]+ Tahun [0-9]+/)?.[0]
      ?.split(' ') ?? [];
  const nomor = safeParseInt(_nomor);
  const tahun = safeParseInt(_tahun);
  if (!isUndefined(nomor) && !isUndefined(tahun))
    return { nodeType: 'document', docType: 'uu', nomor, tahun };
  throw Error(`Legal Not Detected ${str}`);
}

type AmendedContext = { context: Context; amendedDocument: DocumentNode };
const spansToAmendedPointWith = curry(spansToAmendedPoint);
function spansToAmendedPoint(
  context: AmendedContext,
  keySpans: KeySpans
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
  amendedContext: AmendedContext,
  keySpans: KeySpans
): AmenderDeletePoint | undefined {
  const { context, amendedDocument } = amendedContext;
  const [nomorKey, spans] = keySpans;
  const _nomorKey = parseInt(nomorKey);
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const _pasalKey = context.keyIds.amendDeletePasalKeyOfId[firstSpanId];
  if (isUndefined(_pasalKey)) return undefined;
  const deletedPasal: PasalNode = {
    nodeType: 'pasal',
    key: _pasalKey,
    parentDoc: amendedDocument,
  };
  return { type: 'amenderPoint', key: _nomorKey, operation: 'delete', deletedNode: deletedPasal };
}

function spansToAmendUpdatePasalPoint(
  amendedContext: AmendedContext,
  keySpans: KeySpans
): AmenderUpdatePoint | undefined {
  const { context } = amendedContext;
  const { amendUpdatePasalKeyOfId, selfAmendPasalKeyOfId } = context.keyIds;
  const [nomorKey, spans] = keySpans;
  const _nomorKey = parseInt(nomorKey);
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const pasalKey = amendUpdatePasalKeyOfId[firstSpanId];
  if (isUndefined(pasalKey)) return undefined;
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
  const isi = spansToIsiAmendPasal(amendedContext, pasalKey, isiSpans);
  return {
    type: 'amenderPoint',
    operation: 'update',
    key: _nomorKey,
    updatedPasal: isi,
    description,
  };
}

function spansToIsiAmendPasal(
  amendedContext: AmendedContext,
  pasalKey: string,
  spans: Span[]
): AmendedPasal {
  const { context } = amendedContext;
  return {
    componentType: 'amendedPasal',
    content: amendAyatsOf(context, spans) ?? pointsOf(context, spans) ?? toEmptyReference(spans),
    key: pasalKey,
  };
}

function spansToAmendInsertPasalPoint(
  amendedContext: AmendedContext,
  keySpans: KeySpans
): AmenderInsertPoint | undefined {
  const { context } = amendedContext;
  const [nomorKey, spans] = keySpans;
  const _nomorKey = parseInt(nomorKey);
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const pasalData = context.keyIds.amendInsertPasalKeyOfId[firstSpanId];
  if (isUndefined(pasalData)) return undefined;
  if (isEmpty(pasalData)) {
    const description = toEmptyReference(spans);
    console.log('Insert not detected', { pasalData }, { nomorKey, spans });
    return {
      type: 'amenderPoint',
      operation: 'insert',
      key: _nomorKey,
      description,
      amendedPasalArr: [],
    };
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
  const amendedPasals = chain(reducedIsiSpans.record)
    .toPairs()
    .map(([pasalKey, spans]) => spansToIsiAmendPasal(amendedContext, pasalKey, spans))
    .value();
  return {
    type: 'amenderPoint',
    operation: 'insert',
    key: _nomorKey,
    description,
    amendedPasalArr: amendedPasals,
  };
}

function toEmptyReference(spans: Span[]): ReferenceText {
  return chain(spans)
    .map(({ str }) => str)
    .join(' ')
    .thru<ReferenceText>((text) => ({ type: 'referenceText', references: [], text }))
    .value();
}

export function spanToStr(span: Span): string {
  return span.str;
}

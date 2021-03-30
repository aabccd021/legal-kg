import assertNever from 'assert-never';
import { chain, curry, isEmpty, isUndefined, keys, parseInt } from 'lodash';
import {
  Bab,
  Bagian,
  Pasal,
  BagianSet,
  PasalSet,
  Paragraf,
  ParagrafSet,
  AyatSet,
  PointSet,
  Point,
  Ayat,
  Text,
  PasalVersionNode,
  BabSet,
  BabNode,
  BagianNode,
  ParagrafNode,
  PasalNode,
  BabSetNode,
  PasalInsertAmenderPoint,
  AyatNode,
  PasalDeleteAmenderPoint,
  PasalUpdateAmenderPoint,
  PointNode,
  PointSetNode,
  AyatSetNode,
  PasalVersion,
} from '../../../legal/component';
import { Document, DocumentNode } from '../../../legal/document';
import { Span, lastOf, neverUndefined } from '../../../util';
import {
  nomorKeyOfSpan,
  hurufKeyOfSpan,
  removeHurufKey,
  removeNomorKey,
  removeAyatKey,
  safeParseInt,
} from './parse_key_from_spans';
import { KeyIds } from './scan';
import { extractSpans, extractSpansWith, spanIdKeyMapOf } from './util';

export type Context = {
  documentNode: DocumentNode;
  hasAmendPasal: boolean;
  keyIds: KeyIds;
};

export function spansToDocument(context: Context, spans: Span[]): Document {
  return { node: context.documentNode, babSet: spansToBabSet(context, spans) };
}

function spansToBabSet(context: Context, spans: Span[]): BabSet {
  const babSetNode: BabSetNode = { nodeType: 'babSet', parentDocumentNode: context.documentNode };
  return {
    type: 'babSet',
    node: babSetNode,
    elements: chain(spans)
      .thru(extractSpansWith(context.keyIds.spanIdToBabKeyMap))
      .thru(({ keyToSpanMap }) => keyToSpanMap)
      .toPairs()
      .map(spansToBabWith(context, babSetNode))
      .value(),
  };
}

export type KeySpans = [string, Span[]];

const pasalArrToPasalSetWith = curry(pasalArrToPasalSet);
function pasalArrToPasalSet(
  parentNode: BabNode | BagianNode | ParagrafNode,
  elements: Pasal[]
): PasalSet {
  return { type: 'pasalSet', node: { nodeType: 'pasalSet', parentNode }, elements };
}

const bagianArrToBagianSetWith = curry(bagianArrToBagianSet);
function bagianArrToBagianSet(parentBabNode: BabNode, elements: Bagian[]): BagianSet {
  return { type: 'bagianSet', node: { nodeType: 'bagianSet', parentBabNode }, elements };
}

const paragrafArrToParagrafSetWith = curry(paragrafArrToParagrafSet);
function paragrafArrToParagrafSet(parentBagianNode: BagianNode, elements: Paragraf[]): ParagrafSet {
  return { type: 'paragrafSet', node: { nodeType: 'paragrafSet', parentBagianNode }, elements };
}

const spansToBabWith = curry(spansToBab);
function spansToBab(context: Context, parentBabSetNode: BabSetNode, [key, spans]: KeySpans): Bab {
  // TODO use safe parse int
  const babNode: BabNode = { nodeType: 'bab', key: parseInt(key), parentBabSetNode };
  const { spanIdMap, keySpansToComponent } = spanIdKeyMapOf<Bagian, Pasal, BagianSet, PasalSet>(
    [
      context.keyIds.spanIdToBagianKeyMap,
      spansToBagianWith(babNode),
      bagianArrToBagianSetWith(babNode),
    ],
    [context.keyIds.spanIdToPasalKeyMap, spansToPasal, pasalArrToPasalSetWith(babNode)],
    spans,
    context
  );
  const { preKeySpans, keyToSpanMap } = extractSpans(spanIdMap, spans.slice(1));
  return {
    type: 'bab',
    node: babNode,
    title: preKeySpans.map(spanToStr).join(' '),
    content: chain(keyToSpanMap).toPairs().thru<BagianSet | PasalSet>(keySpansToComponent).value(),
  };
}

const spansToBagianWith = curry(spansToBagian);
function spansToBagian(parentBabNode: BabNode, context: Context, [key, spans]: KeySpans): Bagian {
  const bagianNode: BagianNode = {
    nodeType: 'bagian',
    key: parseInt(key),
    parentBagianSetNode: { nodeType: 'bagianSet', parentBabNode },
  };
  const { spanIdMap, keySpansToComponent } = spanIdKeyMapOf<Paragraf, Pasal, ParagrafSet, PasalSet>(
    [
      context.keyIds.spanIdToParagrafKeyMap,
      spansToParagrafWith(bagianNode),
      paragrafArrToParagrafSetWith(bagianNode),
    ],
    [context.keyIds.spanIdToPasalKeyMap, spansToPasal, pasalArrToPasalSetWith(bagianNode)],
    spans,
    context
  );
  const { preKeySpans, keyToSpanMap } = extractSpans(spanIdMap, spans);
  return {
    type: 'bagian',
    node: bagianNode,
    title: preKeySpans.map(spanToStr).join(' '),
    content: chain(keyToSpanMap)
      .toPairs()
      .thru<ParagrafSet | PasalSet>(keySpansToComponent)
      .value(),
  };
}

const spansToParagrafWith = curry(spansToParagraf);
function spansToParagraf(
  parentBagianNode: BagianNode,
  context: Context,
  [key, spans]: KeySpans
): Paragraf {
  const paragrafNode: ParagrafNode = {
    nodeType: 'paragraf',
    key: parseInt(key),
    parentParagrafSetNode: { nodeType: 'paragrafSet', parentBagianNode },
  };
  const { preKeySpans, keyToSpanMap } = extractSpans(context.keyIds.spanIdToPasalKeyMap, spans);
  return {
    type: 'paragraf',
    node: paragrafNode,
    title: preKeySpans.map(spanToStr).join(' '),
    pasalSet: {
      type: 'pasalSet',
      node: { nodeType: 'pasalSet', parentNode: paragrafNode },
      elements: chain(keyToSpanMap).toPairs().map(spansToPasalWith(context)).value(),
    },
  };
}

const spansToPasalWith = curry(spansToPasal);
function spansToPasal(context: Context, keySpans: KeySpans): Pasal {
  const [key] = keySpans;
  const pasalNode: PasalNode = {
    nodeType: 'pasal',
    key: parseInt(key),
    parentNode: context.documentNode,
  };
  return {
    type: 'pasal',
    node: pasalNode,
    version: keySpansToPasalVersion(
      { parentDocumentNode: context.documentNode },
      context,
      keySpans
    ),
  };
}

function spansToAyatSet(
  parentPasalVersionNode: PasalVersionNode,
  context: Context,
  spans: Span[]
): AyatSet | undefined {
  const { keyToSpanMap } = extractSpansWith(context.keyIds.spanIdToAyatKeyMap, spans);
  if (isEmpty(keyToSpanMap)) return undefined;
  const ayatSetNode: AyatSetNode = { nodeType: 'ayatSet', parentPasalVersionNode };
  const ayats = chain(keyToSpanMap).toPairs().map(spanToAyatWith(ayatSetNode, context)).value();
  return {
    type: 'ayatSet',
    node: ayatSetNode,
    elements: ayats,
  };
}

function spansToPointSet(
  parentNode: PointNode | AyatNode | PasalVersionNode,
  context: Context,
  spans: Span[]
): PointSet | undefined {
  for (const [spanIdx, span] of spans.entries()) {
    if (nomorKeyOfSpan(span) === 1)
      return _spansToPointSet(parentNode, context, 'numPoint', spans, spanIdx);
    if (hurufKeyOfSpan(span) === 'a'.charCodeAt(0))
      return _spansToPointSet(parentNode, context, 'charPoint', spans, spanIdx);
  }
  return undefined;
}

function _spansToPointSet(
  parentNode: PointNode | AyatNode | PasalVersionNode,
  context: Context,
  pointType: 'numPoint' | 'charPoint',
  spans: Span[],
  spanIdx: number
): PointSet {
  const pointSetNode: PointSetNode = { nodeType: 'pointSet', parentNode };
  return {
    type: 'pointSet',
    node: pointSetNode,
    description: spansToText(pointSetNode, 'description', spans.slice(0, spanIdx)),
    elements: chain(spans)
      .slice(spanIdx)
      .reduce(toKeySpansWith(context, pointType), { keySpans: [] })
      .thru(({ keySpans }) => keySpans)
      .map(spansToPointWith(pointSetNode, context))
      .value(),
  };
}

const spansToPointWith = curry(spansToPoint);
function spansToPoint(
  parentPointSetNode: PointSetNode,
  context: Context,
  keySpans: KeySpans
): Point {
  const [key] = keySpans;
  const pointNode: PointNode = { nodeType: 'point', key, parentPointSetNode };
  return {
    type: 'point',
    node: pointNode,
    content: spansToPointContent(pointNode, context, keySpans),
  };
}

type AmendedContext = {
  context: Context;
  amendedDocumentNode: DocumentNode;
  parentNode: PointNode | AyatNode | PasalVersionNode;
};

function spansToPointContent(
  pointNode: PointNode,
  context: Context,
  keySpans: KeySpans
): PointSet | PasalDeleteAmenderPoint | PasalUpdateAmenderPoint | PasalInsertAmenderPoint | Text {
  const [, spans] = keySpans;
  const pointSet = spansToPointSet(pointNode, context, spans);
  if (!isUndefined(pointSet)) return pointSet;
  const [, _nomor, , _tahun] =
    spans
      .map(spanToStr)
      .join(' ')
      .replace('Undang- Undang', 'Undang-Undang')
      .replaceAll('Nomor ', '')
      ?.match(/Undang-Undang [0-9]+ Tahun [0-9]+/)?.[0]
      ?.split(' ') ?? [];
  const nomor = safeParseInt(_nomor);
  const tahun = safeParseInt(_tahun);
  if (isUndefined(nomor) || isUndefined(tahun)) return spansToText(pointNode, 'text', spans);
  const amendedContext: AmendedContext = {
    context,
    amendedDocumentNode: { nodeType: 'document', docType: 'uu', nomor, tahun },
    parentNode: pointNode,
  };
  return (
    spansToAmendDeletePasalPoint(amendedContext, keySpans) ??
    spansToAmendUpdatePasalPoint(amendedContext, keySpans) ??
    spansToAmendInsertPasalPoint(amendedContext, keySpans) ??
    spansToText(pointNode, 'text', spans)
  );
}

type SpansExtractResult = {
  keySpans: KeySpans[];
  lastKey?: number;
};

const toKeySpansWith = curry(toKeySpans);
function toKeySpans(
  context: Context,
  pointType: 'numPoint' | 'charPoint',
  extractResult: SpansExtractResult,
  span: Span
): SpansExtractResult {
  const newKey = spanToKeyInt(context, pointType)(span);
  if (
    !isUndefined(newKey) &&
    (isUndefined(extractResult.lastKey) || newKey === extractResult.lastKey + 1)
  ) {
    const cleanedSpan = keyRemovedOfSpan(pointType)(span);
    const strKey = keyIntToStr(pointType)(newKey);
    const newKeySpans: KeySpans[] = [...extractResult.keySpans, [strKey, [cleanedSpan]]];
    return { ...extractResult, keySpans: newKeySpans, lastKey: newKey };
  }
  const firsts = extractResult.keySpans.slice(0, -1);
  const last = lastOf(extractResult.keySpans);
  if (isUndefined(last)) throw Error();
  const newLastSpans: Span[] = [...last[1], span];
  const newLast: KeySpans = [last[0], newLastSpans];
  const newKeySpans: KeySpans[] = [...firsts, newLast];
  return { ...extractResult, keySpans: newKeySpans };
}

function keyRemovedOfSpan(pointType: 'numPoint' | 'charPoint'): (span: Span) => Span {
  if (pointType === 'charPoint') return removeHurufKey;
  if (pointType === 'numPoint') return removeNomorKey;
  assertNever(pointType);
}

function spanToKeyInt(
  context: Context,
  pointType: 'numPoint' | 'charPoint'
): (span: Span) => number | undefined {
  if (pointType === 'charPoint') return hurufKeyOfSpan;
  if (pointType === 'numPoint')
    return (span) => context.keyIds.spanIdToNomorKeyMap[span.id] ?? nomorKeyOfSpan(span);
  assertNever(pointType);
}

function keyIntToStr(pointType: 'numPoint' | 'charPoint'): (number: number) => string {
  if (pointType === 'numPoint') return (number) => number.toString();
  if (pointType === 'charPoint') return (number) => String.fromCharCode(number);
  assertNever(pointType);
}

const spanToAyatWith = curry(spanToAyat);
function spanToAyat(parentAyatSetNode: AyatSetNode, context: Context, keySpans: KeySpans): Ayat {
  const [keyStr, spans] = keySpans;
  const spansWithoutKey = removeAyatKey(spans);
  const ayatNode: AyatNode = { nodeType: 'ayat', key: parseInt(keyStr), parentAyatSetNode };
  return {
    type: 'ayat',
    node: ayatNode,
    content:
      spansToPointSet(ayatNode, context, spansWithoutKey) ??
      spansToText(ayatNode, 'text', spansWithoutKey),
  };
}

function spansToAmendDeletePasalPoint(
  amendedContext: AmendedContext,
  [pointKeyStr, spans]: KeySpans
): PasalDeleteAmenderPoint | undefined {
  const { context, amendedDocumentNode, parentNode } = amendedContext;
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const pasalKey = context.keyIds.spanIdToDeletePasalKeyMap[firstSpanId];
  if (isUndefined(pasalKey)) return undefined;
  return {
    type: 'pasalDeleteAmenderPoint',
    node: {
      nodeType: 'point',
      parentPointSetNode: { nodeType: 'pointSet', parentNode },
      key: parseInt(pointKeyStr),
    },
    deletedPasalVersionNode: {
      nodeType: 'pasalVersion',
      timeCreatedEpoch: Date.now(),
      state: 'deleted',
      parentPasalNode: {
        nodeType: 'pasal',
        key: pasalKey,
        parentNode: amendedDocumentNode,
      },
    },
  };
}

function spansToAmendUpdatePasalPoint(
  amendedContext: AmendedContext,
  [pointKeyStr, spans]: KeySpans
): PasalUpdateAmenderPoint | undefined {
  const { context, amendedDocumentNode, parentNode } = amendedContext;
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const pasalKey = context.keyIds.spanIdToUpdatePasalKeyMap[firstSpanId];
  if (isUndefined(pasalKey)) return undefined;
  const pasalTitleIdx =
    chain(spans)
      .toPairs()
      .filter(([, span]) => context.keyIds.selfAmendPasalKeyOfId.includes(span.id))
      .map(([idx]) => parseInt(idx))
      .first()
      .value() ?? 0;
  if (pasalTitleIdx === 0) console.log('UND', spans[0]);
  const _descSpans = spans.slice(0, pasalTitleIdx);
  const [descFirst, ...descRest] = _descSpans;
  const descSpans = !isUndefined(descFirst) ? [removeNomorKey(descFirst), ...descRest] : _descSpans;
  const pointNode: PointNode = {
    nodeType: 'point',
    parentPointSetNode: { nodeType: 'pointSet', parentNode },
    key: parseInt(pointKeyStr),
  };
  return {
    type: 'pasalUpdateAmenderPoint',
    node: pointNode,
    description: spansToText(pointNode, 'description', descSpans),
    updatedPasalVersion: keySpansToPasalVersion(
      { parentDocumentNode: amendedDocumentNode },
      context,
      [pasalKey, spans.slice(pasalTitleIdx)]
    ),
  };
}

function spansToAmendInsertPasalPoint(
  amendedContext: AmendedContext,
  [pointKeyStr, spans]: KeySpans
): PasalInsertAmenderPoint | undefined {
  const { context, amendedDocumentNode, parentNode } = amendedContext;
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const pasalStringArr = context.keyIds.spanIdToInsertPasalKeyMap[firstSpanId];
  if (isUndefined(pasalStringArr)) return undefined;
  const pointNode: PointNode = {
    nodeType: 'point',
    parentPointSetNode: { nodeType: 'pointSet', parentNode },
    key: parseInt(pointKeyStr),
  };
  if (isEmpty(pasalStringArr)) {
    console.log('Insert not detected', { pasalStringArr }, { pointKeyStr, spans });
    return {
      type: 'pasalInsertAmenderPoint',
      node: pointNode,
      description: spansToText(pointNode, 'description', spans),
      insertedPasalVersionArr: [],
    };
  }
  const pasalDataKeys = keys(pasalStringArr).map((t) => parseInt(t));
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
  return {
    type: 'pasalInsertAmenderPoint',
    node: pointNode,
    description: spansToText(pointNode, 'description', descSpans),
    insertedPasalVersionArr: chain(spans)
      .slice(firstPasalTitleIdx)
      .reduce(mapSpanArrToPasalKeyWith(pasalStringArr), { record: {} })
      .thru(({ record }) => record)
      .toPairs()
      .map(keySpansToPasalVersionWith({ parentDocumentNode: amendedDocumentNode }, context))
      .value(),
  };
}

const keySpansToPasalVersionWith = curry(keySpansToPasalVersion);
function keySpansToPasalVersion(
  { parentDocumentNode }: { parentDocumentNode: DocumentNode },
  context: Context,
  [key, spans]: KeySpans
): PasalVersion {
  const pasalVersionNode: PasalVersionNode = {
    nodeType: 'pasalVersion',
    timeCreatedEpoch: Date.now(),
    state: 'exists',
    parentPasalNode: { nodeType: 'pasal', key, parentNode: parentDocumentNode },
  };
  const contentSpans = spans.slice(1);
  return {
    type: 'pasalVersion',
    node: pasalVersionNode,
    content:
      spansToAyatSet(pasalVersionNode, context, contentSpans) ??
      spansToPointSet(pasalVersionNode, context, contentSpans) ??
      spansToText(pasalVersionNode, 'text', contentSpans),
  };
}

type SpanArrMappedToPasalKey = { record: Record<string, Span[]>; lastPasalKey?: string };

const mapSpanArrToPasalKeyWith = curry(mapSpanArrToPasalKey);
function mapSpanArrToPasalKey(
  pasalStringArr: string[],
  acc: SpanArrMappedToPasalKey,
  span: Span
): SpanArrMappedToPasalKey {
  const { record, lastPasalKey } = acc;
  const newPasalKey = pasalStringArr[span.id];
  if (!isUndefined(newPasalKey)) return { ...acc, lastPasalKey: newPasalKey };
  const pasalKey = neverUndefined(lastPasalKey);
  const pasalStrArr = record[pasalKey] ?? [];
  const newRecord = { ...record, [pasalKey]: [...pasalStrArr, span] };
  return { ...acc, record: newRecord };
}

function spansToText(
  parent: PointNode | AyatNode | PasalVersionNode | PointSetNode,
  textName: string,
  spans: Span[]
): Text {
  return {
    type: 'text',
    node: { nodeType: 'text', textName, parentNode: parent },
    textString: chain(spans)
      .map(({ str }) => str)
      .join(' ')
      .value(),
    references: [],
  };
}

export function spanToStr(span: Span): string {
  return span.str;
}

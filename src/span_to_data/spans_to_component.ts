import {
  Disahkan,
  DocumentMetadata,
  MengingatNode,
  MenimbangNode,
  PasalSetNode,
} from '../component';
import assertNever from 'assert-never';
import { chain, curry, isEmpty, isUndefined, keys, map, parseInt, reduce } from 'lodash';
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
  BabSet,
} from '../component';
import { DocumentNode } from '../document';
import { Span, lastOf, neverUndefined } from '../util';
import {
  nomorKeyOfSpan,
  hurufKeyOfSpan,
  removeHurufKey,
  removeNomorKey,
  removeAyatKey,
  safeParseInt,
} from './parse_key_from_spans';
import { KeyIds } from './scan';
import { extractSpans, extractSpansWith, spanIdKeyMapOf, spansInRange } from './util';

export type RootOrganizer = 'bab' | 'pasal';

export type Context = {
  documentNode: DocumentNode;
  disahkan: Disahkan;
  hasAmendPasal: boolean;
  keyIds: KeyIds;
  rootOrganizer: RootOrganizer;
};

export function spansToStr(spans: Span[]): string {
  return spans.map(spanToStr).join('\n');
}

type MetadataSection =
  | 'menimbang'
  | 'mengingat'
  | 'init'
  | 'memutuskan'
  | 'denganPersetujuan'
  | 'denganRahmat'
  | 'tentang';
type MetadataAcc = {
  section: MetadataSection;
  spans: {
    [k in MetadataSection]: Span[];
  };
};

export function spansToMetadata(context: Context, spans: Span[]): DocumentMetadata {
  const res: MetadataAcc = reduce<Span, MetadataAcc>(
    spans,
    (acc, span) => {
      const [newSection, newSpan] = getNewSection(acc.section, span);
      return {
        section: newSection,
        spans: {
          ...acc.spans,
          [newSection]: [...acc.spans[newSection], newSpan],
        },
      };
    },
    {
      spans: {
        denganPersetujuan: [],
        memutuskan: [],
        mengingat: [],
        menimbang: [],
        init: [],
        denganRahmat: [],
        tentang: [],
      },
      section: 'init',
    }
  );
  const menimbangNode: MenimbangNode = { nodeType: 'menimbang', parentNode: context.documentNode };
  const mengingatNode: MengingatNode = { nodeType: 'mengingat', parentNode: context.documentNode };
  return {
    menimbang: {
      type: 'menimbang',
      node: menimbangNode,
      content:
        spansToPointSet(menimbangNode, context, res.spans.menimbang) ??
        spansToText(menimbangNode, 'text', res.spans.menimbang),
    },
    mengingat: {
      type: 'mengingat',
      node: mengingatNode,
      content:
        spansToPointSet(mengingatNode, context, res.spans.mengingat) ??
        spansToText(mengingatNode, 'text', res.spans.mengingat),
    },
    memutuskan: res.spans.memutuskan.map(spanToStr).join('\n').trim(),
    denganPersetujuan: res.spans.denganPersetujuan.map(spanToStr).join('\n').trim(),
    tentang: res.spans.tentang.map(spanToStr).join(' '),
  };
}

function getNewSection(prevSection: MetadataSection, span: Span): [MetadataSection, Span] {
  if (prevSection === 'init' && span.str.startsWith('TENTANG')) {
    return ['tentang', { ...span, str: '' }];
  }
  if (prevSection === 'tentang' && span.str.startsWith('DENGAN RAHMAT')) {
    return ['denganRahmat', { ...span, str: '' }];
  }
  if (prevSection === 'denganRahmat' && span.str.startsWith('Menimbang')) {
    return ['menimbang', { ...span, str: span.str.split(':').slice(1).join(':').trim() }];
  }
  if (prevSection === 'menimbang' && span.str.startsWith('Mengingat')) {
    return ['mengingat', { ...span, str: span.str.split(':').slice(1).join(':').trim() }];
  }
  if (prevSection === 'mengingat' && span.str.startsWith('Dengan persetujuan bersama antara')) {
    return ['denganPersetujuan', { ...span, str: '' }];
  }
  if (prevSection === 'denganPersetujuan' && span.str.startsWith('MEMUTUSKAN')) {
    return ['memutuskan', { ...span, str: '' }];
  }
  return [prevSection, span];
}

export function spansToContent(context: Context, spans: Span[]): BabSet | PasalSet {
  if (context.rootOrganizer === 'bab') {
    const babSetNode: BabSetNode = { nodeType: 'babSet', parentDocumentNode: context.documentNode };
    const { keyToSpanMap } = extractSpans(context.keyIds.spanIdToBabKeyMap, spans);
    return {
      type: 'babSet',
      node: babSetNode,
      elements: map(keyToSpanMap, spansToBabWith(context, babSetNode)),
    };
  }
  const daftarPasalNode: PasalSetNode = {
    nodeType: 'daftarPasal',
    parentNode: context.documentNode,
  };
  const { keyToSpanMap } = extractSpans(context.keyIds.spanIdToPasalKeyMap, spans);
  return {
    type: 'daftarPasal',
    node: daftarPasalNode,
    elements: map(keyToSpanMap, spansToPasalWith(context)),
  };
}

export type KeySpans = [string, Span[]];

const pasalArrToPasalSetWith = curry(pasalArrToPasalSet);
function pasalArrToPasalSet(
  parentNode: BabNode | BagianNode | ParagrafNode,
  elements: Pasal[]
): PasalSet {
  return { type: 'daftarPasal', node: { nodeType: 'daftarPasal', parentNode }, elements };
}

const bagianArrToBagianSetWith = curry(bagianArrToBagianSet);
function bagianArrToBagianSet(parentBabNode: BabNode, elements: Bagian[]): BagianSet {
  return { type: 'daftarBagian', node: { nodeType: 'daftarBagian', parentBabNode }, elements };
}

const paragrafArrToParagrafSetWith = curry(paragrafArrToParagrafSet);
function paragrafArrToParagrafSet(parentBagianNode: BagianNode, elements: Paragraf[]): ParagrafSet {
  return {
    type: 'daftarParagraf',
    node: { nodeType: 'daftarParagraf', parentBagianNode },
    elements,
  };
}

const spansToBabWith = curry(spansToBab);
function spansToBab(
  context: Context,
  parentBabSetNode: BabSetNode,
  spans: Span[],
  key: string
): Bab {
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
function spansToBagian(
  parentBabNode: BabNode,
  context: Context,
  spans: Span[],
  key: string
): Bagian {
  const bagianNode: BagianNode = {
    nodeType: 'bagian',
    key: parseInt(key),
    parentBagianSetNode: { nodeType: 'daftarBagian', parentBabNode },
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
  spans: Span[],
  key: string
): Paragraf {
  const paragrafNode: ParagrafNode = {
    nodeType: 'paragraf',
    key: parseInt(key),
    parentParagrafSetNode: { nodeType: 'daftarParagraf', parentBagianNode },
  };
  const { preKeySpans, keyToSpanMap } = extractSpans(context.keyIds.spanIdToPasalKeyMap, spans);
  return {
    type: 'paragraf',
    node: paragrafNode,
    title: preKeySpans.map(spanToStr).join(' '),
    daftarPasal: {
      type: 'daftarPasal',
      node: { nodeType: 'daftarPasal', parentNode: paragrafNode },
      elements: map(keyToSpanMap, spansToPasalWith(context)),
    },
  };
}

const spansToPasalWith = curry(spansToPasal);
function spansToPasal(context: Context, spans: Span[], key: string): Pasal {
  const pasalNode: PasalNode = {
    nodeType: 'pasal',
    key: parseInt(key),
    parentNode: context.documentNode,
  };
  return {
    type: 'pasal',
    node: pasalNode,
    version: keySpansToPasalVersion(
      {
        parentDocumentNode: context.documentNode,
        context,
        isAmendedPasal: false,
        state: 'orisinal',
      },
      spans,
      key
    ),
  };
}

function spansToAyatSet(
  {
    parentPasalVersionNode,
    context,
    isAmendAyat,
  }: {
    parentPasalVersionNode: PasalVersionNode;
    context: Context;
    isAmendAyat: boolean;
  },
  spans: Span[]
): AyatSet | undefined {
  const { keyToSpanMap } = extractSpansWith(
    isAmendAyat ? context.keyIds.spanIdToAmendAyatKeyMap : context.keyIds.spanIdToAyatKeyMap,
    spans
  );
  if (isEmpty(keyToSpanMap)) return undefined;
  const ayatSetNode: AyatSetNode = { nodeType: 'daftarAyat', parentPasalVersionNode };
  const ayats = chain(keyToSpanMap).toPairs().map(spansToAyatWith(ayatSetNode, context)).value();
  return {
    type: 'ayatSet',
    node: ayatSetNode,
    elements: ayats,
  };
}

function spansToPointSet(
  parentNode: PointNode | AyatNode | PasalVersionNode | MenimbangNode | MengingatNode,
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
  parentNode: PointNode | AyatNode | PasalVersionNode | MenimbangNode | MengingatNode,
  context: Context,
  pointType: 'numPoint' | 'charPoint',
  spans: Span[],
  spanIdx: number
): PointSet {
  const daftarHurufNode: PointSetNode = { nodeType: 'daftarHuruf', parentNode };
  return {
    type: 'daftarHuruf',
    node: daftarHurufNode,
    description: spansToText(daftarHurufNode, 'description', spans.slice(0, spanIdx)),
    elements: chain(spans)
      .slice(spanIdx)
      .reduce(toKeySpansWith(context, pointType), { keySpans: [] })
      .thru(({ keySpans }) => keySpans)
      .map(spansToPointWith(daftarHurufNode, context))
      .value(),
  };
}

const spansToPointWith = curry(spansToPoint);
function spansToPoint(
  parentPointSetNode: PointSetNode,
  context: Context,
  keySpans: KeySpans
): Point {
  const [key, spans] = keySpans;
  const pointNode: PointNode = { nodeType: 'huruf', key, parentPointSetNode };
  return {
    type: 'point',
    node: pointNode,
    content: spansToPointSet(pointNode, context, spans) ?? spansToText(pointNode, 'text', spans),
  };
}

type AmendedContext = {
  context: Context;
  amendedDocumentNode: DocumentNode;
  parentPointSetNode: PointSetNode;
};

function spansToAmendedDocumentNode(spans: Span[]): DocumentNode | undefined {
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
  if (isUndefined(nomor) || isUndefined(tahun)) return undefined;
  return { nodeType: 'peraturan', docType: 'noTahun', docCategory: 'uu', nomor, tahun };
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

const spansToAyatWith = curry(spansToAyat);
function spansToAyat(parentAyatSetNode: AyatSetNode, context: Context, keySpans: KeySpans): Ayat {
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
  spans: Span[],
  pointKeyStr: string
): PasalDeleteAmenderPoint | undefined {
  const { context, amendedDocumentNode, parentPointSetNode } = amendedContext;
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const pasalKey = context.keyIds.spanIdToDeletePasalKeyMap[firstSpanId];
  if (isUndefined(pasalKey)) return undefined;
  return {
    type: 'pasalDeleteAmenderPoint',
    node: { nodeType: 'huruf', parentPointSetNode, key: parseInt(pointKeyStr) },
    deletedPasalVersion: {
      type: 'pasalVersion',
      node: {
        nodeType: 'versiPasal',
        version: context.disahkan.date,
        state: 'penghapusan',
        parentPasalNode: {
          nodeType: 'pasal',
          key: pasalKey,
          parentNode: amendedDocumentNode,
        },
      },
    },
  };
}

function spansToAmendUpdatePasalPoint(
  amendedContext: AmendedContext,
  spans: Span[],
  pointKeyStr: string
): PasalUpdateAmenderPoint | undefined {
  const { context, amendedDocumentNode, parentPointSetNode } = amendedContext;
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
    nodeType: 'huruf',
    parentPointSetNode,
    key: parseInt(pointKeyStr),
  };
  return {
    type: 'pasalUpdateAmenderPoint',
    node: pointNode,
    description: spansToText(pointNode, 'description', descSpans),
    updatedPasalVersion: keySpansToPasalVersion(
      {
        parentDocumentNode: amendedDocumentNode,
        context,
        isAmendedPasal: true,
        state: 'pengubahan',
      },
      spans.slice(pasalTitleIdx),
      pasalKey
    ),
  };
}

function spansToAmendInsertPasalPoint(
  amendedContext: AmendedContext,
  spans: Span[],
  pointKeyStr: string
): PasalInsertAmenderPoint | undefined {
  const { context, amendedDocumentNode, parentPointSetNode } = amendedContext;
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const pasalData = context.keyIds.spanIdToInsertPasalKeyMap[firstSpanId];
  if (isUndefined(pasalData)) return undefined;
  const pointNode: PointNode = {
    nodeType: 'huruf',
    parentPointSetNode,
    key: parseInt(pointKeyStr),
  };
  if (isEmpty(pasalData)) {
    console.log('Insert not detected', { pasalStringArr: pasalData }, { pointKeyStr, spans });
    return {
      type: 'pasalInsertAmenderPoint',
      node: pointNode,
      description: spansToText(pointNode, 'description', spans),
      insertedPasalVersionArr: [],
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
  return {
    type: 'pasalInsertAmenderPoint',
    node: pointNode,
    description: spansToText(pointNode, 'description', descSpans),
    insertedPasalVersionArr: chain(spans)
      .slice(firstPasalTitleIdx)
      .reduce(mapSpanArrToPasalKeyWith(pasalData), { record: {} })
      .thru(({ record }) => record)
      .map(
        keySpansToPasalVersionWith({
          parentDocumentNode: amendedDocumentNode,
          context,
          isAmendedPasal: true,
          state: 'penyisipan',
        })
      )
      .value(),
  };
}

const keySpansToPasalVersionWith = curry(keySpansToPasalVersion);
function keySpansToPasalVersion(
  {
    parentDocumentNode,
    context,
    isAmendedPasal,
    state,
  }: {
    parentDocumentNode: DocumentNode;
    context: Context;
    isAmendedPasal: boolean;
    state: 'orisinal' | 'penyisipan' | 'pengubahan' | 'penghapusan';
  },
  spans: Span[],
  key: string
): PasalVersion {
  const pasalVersionNode: PasalVersionNode = {
    nodeType: 'versiPasal',
    version: context.disahkan.date,
    state,
    parentPasalNode: { nodeType: 'pasal', key, parentNode: parentDocumentNode },
  };
  const amendedPointSet =
    !isAmendedPasal &&
    context.hasAmendPasal &&
    !isEmpty(spansInRange(context.keyIds.spanIdToAmendNomorKeyMap, spans))
      ? spansToAmendedPointSet(pasalVersionNode, context, spans)
      : undefined;
  return {
    type: 'pasalVersion',
    node: pasalVersionNode,
    content:
      amendedPointSet ??
      spansToAyatSet(
        { parentPasalVersionNode: pasalVersionNode, context, isAmendAyat: isAmendedPasal },
        spans
      ) ??
      spansToPointSet(pasalVersionNode, context, spans.slice(1)) ??
      spansToText(pasalVersionNode, 'text', !isAmendedPasal ? spans.slice(1) : spans),
  };
}

function spansToAmendedPointSet(
  parentNode: PasalVersionNode,
  context: Context,
  spans: Span[]
): PointSet | undefined {
  const { preKeySpans, keyToSpanMap } = extractSpans(
    context.keyIds.spanIdToAmendNomorKeyMap,
    spans
  );
  const amendedDocumentNode = spansToAmendedDocumentNode(preKeySpans);
  if (isUndefined(amendedDocumentNode)) return undefined;
  const daftarHurufNode: PointSetNode = { nodeType: 'daftarHuruf', parentNode };
  return {
    type: 'daftarHuruf',
    node: daftarHurufNode,
    description: spansToText(daftarHurufNode, 'description', preKeySpans),
    elements: chain(keyToSpanMap)
      .map(
        spansToAmendedPointWith({
          context,
          amendedDocumentNode,
          parentPointSetNode: daftarHurufNode,
        })
      )
      .compact()
      .value(),
  };
}

const spansToAmendedPointWith = curry(spansToAmendedPoint);
function spansToAmendedPoint(
  amendedContext: AmendedContext,
  spans: Span[],
  key: string
): PasalDeleteAmenderPoint | PasalUpdateAmenderPoint | PasalInsertAmenderPoint | undefined {
  const result =
    spansToAmendDeletePasalPoint(amendedContext, spans, key) ??
    spansToAmendUpdatePasalPoint(amendedContext, spans, key) ??
    spansToAmendInsertPasalPoint(amendedContext, spans, key);
  if (isUndefined(result)) {
    const firstSpan = spans[0];
    console.log(
      `Unparsed amend: id:${firstSpan?.id}, pageNum:${firstSpan?.pageNum}, str:${firstSpan?.str}`
    );
  }
  return result;
}

type SpanArrMappedToPasalKey = { record: Record<string, Span[]>; lastPasalKey?: string };

const mapSpanArrToPasalKeyWith = curry(mapSpanArrToPasalKey);
function mapSpanArrToPasalKey(
  spanIdToPasalDataMap: Record<number, string>,
  acc: SpanArrMappedToPasalKey,
  span: Span
): SpanArrMappedToPasalKey {
  const { record, lastPasalKey } = acc;
  const newPasalKey = spanIdToPasalDataMap[span.id];
  if (!isUndefined(newPasalKey)) return { ...acc, lastPasalKey: newPasalKey };
  const pasalKey = neverUndefined(lastPasalKey, { spanIdToPasalDataMap, acc, span });
  const pasalStrArr = record[pasalKey] ?? [];
  const newRecord = { ...record, [pasalKey]: [...pasalStrArr, span] };
  return { ...acc, record: newRecord };
}

function spansToText(
  parent: PointNode | AyatNode | PasalVersionNode | PointSetNode | MenimbangNode | MengingatNode,
  textName: string,
  spans: Span[]
): Text {
  return {
    type: 'text',
    node: { nodeType: 'segmen', textName, parentNode: parent },
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

// TODO: masih ada "Pasal" di isi

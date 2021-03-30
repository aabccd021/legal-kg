import { ReferenceText } from './../../../legal/reference';
import { Paragraf, ParagrafNode, Paragrafs } from '../../../legal/component/paragraf';
import assertNever from 'assert-never';
import _, { chain, curry, map } from 'lodash';
import { compact, isUndefined } from 'lodash';
import { DocumentNode } from '../../../legal/document';
import { Ayat, AyatNode, Ayats } from '../../../legal/component/ayat';
import { Bab, BabNode } from '../../../legal/component/bab';
import { Bagian, BagianNode, Bagians } from '../../../legal/component/bagian';
import {
  PasalParentNode,
  getPasalParentDocument,
  PasalNode,
  Pasal,
  PasalContent,
  Pasals,
} from '../../../legal/component/pasal';
import { PointsNode, PointNode, Point, Points } from '../../../legal/component/point';
import { Document } from '../../../legal/document/index';
import { Reference } from '../../../legal/reference';
import {
  AmendedPoint,
  AmenderInsertPoint,
  AmenderPoints,
  AmenderUpdatePoint,
  AmendedPasal,
  AmendedPasalNode,
} from '../../../legal/component/amend';
// import { safeParseInt } from './parsekey_from_spans';
import { neverNum, neverString } from '../../../util';
import { safeParseInt } from './parse_key_from_spans';

export function rawJsonToJson(document: Document): Document {
  const { babArr: babs, node: _node } = document;

  return {
    ...document,
    // mengingat: mengimbangToDetectedMengimbang(mengingat, 'documentMengingat', _node),
    // menimbang: mengimbangToDetectedMengimbang(menimbang, 'documentMenimbang', _node),
    babArr: babs?.map((bab) => babToDetectedBab(bab, _node)),
  };
}

// function mengimbangToDetectedMengimbang(
//   mengimbang: Metadata | undefined,
//   metadataType: 'documentMenimbang' | 'documentMengingat',
//   parentDocument: DocumentNode
// ): Metadata | undefined {
//   if (isNil(mengimbang)) return undefined;
//   const { points, text } = mengimbang;
//   const metadataNode: MetadataNode = { metadataType,
// parent: parentDocument, nodeType: 'metadata' };
//   const detectedText = isNil(points)
//     ? { ...text, references: detectDocNode(text.text, parentDocument) }
//     : text;
//   const detectedIsi = !isNil(points) ? pointsToDetectedPoints(points, metadataNode) : points;

//   return { ...mengimbang, points: detectedIsi, text: detectedText };
// }

function babToDetectedBab(bab: Bab, parent: DocumentNode): Bab {
  const babNode: BabNode = {
    nodeType: 'bab',
    key: bab.key,
    parent,
  };
  const detectedIsi: Pasals | Bagians =
    bab.content.type === 'pasals'
      ? { type: 'pasals', pasalArr: bab.content.pasalArr.map(toDetectedPasalWith(babNode)) }
      : { type: 'bagians', bagianArr: bab.content.bagianArr.map(toDetectedBagianWith(babNode)) };

  return { ...bab, content: detectedIsi };
}

const toDetectedPasalWith = curry(toDetectedPasal);
function toDetectedPasal(parent: PasalParentNode, pasal: Pasal): Pasal {
  const { content: isi, key } = pasal;
  const parentDocumentNode = getPasalParentDocument(parent);
  const pasalNode: PasalNode = { key, parentDoc: parentDocumentNode, nodeType: 'pasal' };
  const detectedIsi = pasalContentToDetectedPasalContent(isi, pasalNode);
  return { ...pasal, content: detectedIsi };
}

function pasalContentToDetectedPasalContent(isi: PasalContent, pasalNode: PasalNode): PasalContent {
  switch (isi.type) {
    case 'amenderPoints':
      return detectedAmendPointsOf(isi, pasalNode);
    default:
      return toDetectedIsiAmendedUpdatePasal(isi, pasalNode);
  }
}

function toDetectedIsiAmendedUpdatePasal(
  content: Points | ReferenceText | Ayats,
  pasalNode: PasalNode
): Points | ReferenceText | Ayats {
  if (content.type === 'ayats')
    return {
      ...content,
      ayatArr: content.ayatArr.map(toDetectedAyatWith(pasalNode)),
    };
  if (content.type === 'points') return pointsToDetectedPoints(content, pasalNode);
  if (content.type === 'referenceText')
    return { ...content, references: detectPasalNode(content.text, pasalNode) };
  assertNever(content);
}

function detectedAmendPointsOf(amendPoints: AmenderPoints, pasalNode: PasalNode): AmenderPoints {
  const { description: description, amendedPointArr: isi } = amendPoints;
  const detectedIsi = isi.map(detectedAmendPointOf(pasalNode));
  const detectedDescription = {
    ...description,
    references: detectPasalNode(description.textString, pasalNode),
  };
  return { ...amendPoints, description: detectedDescription, amendedPointArr: detectedIsi };
}

const detectedAmendPointOf = curry(_detectedAmendPointOf);
function _detectedAmendPointOf(pasalNode: PasalNode, amendPoint: AmendedPoint): AmendedPoint {
  if (amendPoint.operation === 'delete') return amendPoint;
  if (amendPoint.operation === 'update')
    return detectedAmendUpdatePasalPointOf(pasalNode, amendPoint);
  if (amendPoint.operation === 'insert')
    return detectedAmendInsertPasalPointOf(pasalNode, amendPoint);
  assertNever(amendPoint);
}

function detectedAmendUpdatePasalPointOf(
  pasalNode: PasalNode,
  amendPoint: AmenderUpdatePoint
): AmenderUpdatePoint {
  const { updatedPasal: amendedPasal, description } = amendPoint;
  const newDescription: ReferenceText = {
    ...description,
    references: detectPasalNode(description.text, pasalNode),
  };
  const detectedIsi = toDetectedIsiAmendedUpdatePasal(amendedPasal.content, pasalNode);
  const newAmendedPasal: AmendedPasal = { ...amendedPasal, content: detectedIsi };
  return { ...amendPoint, updatedPasal: newAmendedPasal, description: newDescription };
}
function detectedAmendInsertPasalPointOf(
  pasalNode: PasalNode,
  amendPoint: AmenderInsertPoint
): AmenderInsertPoint {
  const { amendedPasalArr: amendedPasals, description } = amendPoint;
  const newDescription: ReferenceText = {
    ...description,
    references: detectPasalNode(description.text, pasalNode),
  };
  const newAmendedPasals: AmendedPasal[] = map(amendedPasals, (amendedPasal) => ({
    ...amendedPasal,
    isi: toDetectedIsiAmendedUpdatePasal(amendedPasal.content, pasalNode),
  }));
  return { ...amendPoint, amendedPasalArr: newAmendedPasals, description: newDescription };
}

function pointsToDetectedPoints(points: Points, pointsNode: PointsNode): Points {
  const { content: isi, description: _description } = points;
  const detectedIsi = isi.map(toDetectedPointWith(pointsNode));
  const descriptionReferences = detectPointParentNode(_description.text, pointsNode);
  return {
    ...points,
    content: detectedIsi,
    description: { ..._description, references: descriptionReferences },
  };
}

const toDetectedPointWith = curry(pointToDetectedPoint);
function pointToDetectedPoint(parentPoints: PointsNode, point: Point): Point {
  const { key, content: isi } = point;
  const pointNode: PointNode = { key, parent: parentPoints, nodeType: 'point' };
  const detectedIsi: Points | ReferenceText =
    isi.type === 'points'
      ? pointsToDetectedPoints(isi, pointNode)
      : { ...isi, references: detectPointNode(isi.text, pointNode) };
  return { ...point, content: detectedIsi };
}

const toDetectedAyatWith = curry(ayatToDetectedAyat);
function ayatToDetectedAyat(parentPasal: PasalNode, ayat: Ayat): Ayat {
  const ayatNode: AyatNode = {
    nodeType: 'ayat',
    key: ayat.key,
    parent: parentPasal,
  };
  const detectedText: ReferenceText | Points =
    ayat.content.type === 'referenceText'
      ? { ...ayat.content, references: detectAyatNode(ayat.content.text, ayatNode) }
      : pointsToDetectedPoints(ayat.content, ayatNode);

  return { ...ayat, content: detectedText };
}

const toDetectedBagianWith = curry(toDetectedBagian);
function toDetectedBagian(parent: BabNode, bagian: Bagian): Bagian {
  const bagianNode: BagianNode = {
    nodeType: 'bagian',
    key: bagian.key,
    parent,
  };
  const content: Pasals | Paragrafs =
    bagian.content.type === 'pasals'
      ? { type: 'pasals', pasalArr: bagian.content.pasalArr.map(toDetectedPasalWith(bagianNode)) }
      : {
          type: 'paragrafs',
          paragrafArr: bagian.content.paragrafArr.map(toDetectedParagrafWith(bagianNode)),
        };

  return { ...bagian, content };
}

const toDetectedParagrafWith = curry(toDetectedParagraf);
function toDetectedParagraf(parentBagian: BagianNode, paragraf: Paragraf): Paragraf {
  const paragrafNode: ParagrafNode = {
    nodeType: 'paragraf',
    key: paragraf.key,
    parent: parentBagian,
  };
  return {
    ...paragraf,
    content: {
      type: 'pasals',
      pasalArr: paragraf.content.pasalArr.map(toDetectedPasalWith(paragrafNode)),
    },
  };
}

function detectPointNode(text: string, pointNode: PointNode): Reference[] {
  const { parent } = pointNode;
  const allReferences = [
    ...detectPointParentNode(text, parent),
    ...detectHurufXYZ(text, pointNode),
  ];
  return _resolveConflictingReferences(allReferences);
}

function detectPointParentNode(text: string, pointsNode: PointsNode): Reference[] {
  if (pointsNode.nodeType === 'point') return [];
  if (pointsNode.nodeType === 'ayat') return detectAyatNode(text, pointsNode);
  if (pointsNode.nodeType === 'pasal') return detectPasalNode(text, pointsNode);
  // case 'metadata':
  // return detectDocNode(text, pointsNode.parent);
  if (pointsNode.nodeType === 'amendedPasal') return detectPasalNode(text, pointsNode);
  assertNever(pointsNode);
}

function detectAyatNode(text: string, ayatNode: AyatNode): Reference[] {
  const { parent: parentPasal } = ayatNode;
  return detectPasalNode(text, parentPasal);
}

function detectPasalNode(text: string, pasalNode: PasalNode | AmendedPasalNode): Reference[] {
  const detectors: Detector<PasalNode | AmendedPasalNode>[] = [detectAyatX, detectAyatNHurufXYZ];
  const detectedReferences = detectors.flatMap((detector) => detector(text, pasalNode));
  const docReferences = detectDocNode(text, pasalNode.parentDoc);
  const allReferences = [...detectedReferences, ...docReferences];

  return _resolveConflictingReferences(allReferences);
}

function detectDocNode(text: string, documentNode: DocumentNode): Reference[] {
  const detectors: Detector<DocumentNode>[] = [detectPasalX, detectPasalXAyatX];
  const detectedReferences = detectors.flatMap((detector) => detector(text, documentNode));
  const rootReferences = detectRootNode(text);
  const allReferences = [...detectedReferences, ...rootReferences];
  return _resolveConflictingReferences(allReferences);
}

function detectRootNode(text: string): Reference[] {
  return detectHardCoded(text);
}

function detectHardCoded(text: string): Reference[] {
  const map: [string, DocumentNode][] = [
    [
      'Undang Undang Dasar Negara Republik Indonesia Tahun 1945',
      { nodeType: 'document', docType: 'uud' },
    ],
  ];

  const references = map.flatMap(([key, node]) => {
    const regexp = new RegExp(key, 'g');
    const matches = [...text.matchAll(regexp)];

    return matches.map((match) => {
      const start = match.index ?? neverNum();
      const end = (match.index ?? neverNum()) + (match[0]?.length ?? neverNum());

      return { start, end, node };
    });
  });

  return references;
}

function detectPasalXAyatX(text: string, parentDocumentNode: DocumentNode): Reference[] {
  const regexp = /Pasal [0-9]+ ayat \((l|[0-9]+)\)/g;
  const matches = [...text.matchAll(regexp)];
  return chain(matches)
    .map((match) => {
      const keyStrs = compact(match[0]?.split(/(Pasal |ayat \(|\))/));
      const [, pasal, , ayat] = keyStrs.map(safeParseInt);
      if (isUndefined(pasal) || isUndefined(ayat)) {
        console.log(`Unparsable reference: ${match[0]}===${keyStrs}===${match}`);
        return undefined;
      }
      const start = match.index ?? neverNum();
      const end = (match.index ?? neverNum()) + (match[0]?.length ?? neverNum());
      const parentPasal: PasalNode = {
        parentDoc: parentDocumentNode,
        key: pasal,
        nodeType: 'pasal',
      };
      const node: AyatNode = {
        parent: parentPasal,
        key: ayat,
        nodeType: 'ayat',
      };
      return { start, end, node };
    })
    .compact()
    .value();
}

function detectHurufXYZ(text: string, parentPoint: PointNode): Reference[] {
  const { parent: parentPoints } = parentPoint;
  const regexp = /huruf ?([a-z]?,? ?)+( [a-z]( |,))/g;
  const matches = [...text.matchAll(regexp)];

  return matches.flatMap((match) => {
    const arr =
      match[0]
        ?.replaceAll(/(huruf| |dan)/g, ',')
        .split(',')
        .filter((x) => ![',', ''].includes(x)) ?? [];

    const start = match.index ?? neverNum();

    return arr.map((key, idx) => {
      const [hStart, hEnd] = getPosByLenAndIndex(arr.length, idx, start);
      const pointNode: PointNode = { key, parent: parentPoints, nodeType: 'point' };
      const reference: Reference = { start: hStart, end: hEnd, node: pointNode };

      return reference;
    });
  });
}

type Detector<T> = (text: string, node: T) => Reference[];

const detectAyatNHurufXYZ: Detector<PasalNode | AmendedPasalNode> = (text, parentPasal) => {
  const regexp = /ayat \((l|[0-9]+)\) huruf ?([a-z]?,? ?)+( [a-z]( |,))/g;

  const matches = [...text.matchAll(regexp)];

  return matches.flatMap((match) => {
    const arr = match[0]
      ?.replaceAll(/(ayat|\(|\))/g, ',')
      .split(',')
      .filter((x) => ![',', ' ', ''].includes(x));
    const key = safeParseInt(arr?.[0] ?? neverString()) ?? neverNum();
    const start = match.index ?? neverNum();
    const offset = start + `ayat (${key})`.length;
    const hurufString = arr?.splice(1).join(',') ?? neverString();
    const ayatNode: AyatNode = { key, parent: parentPasal, nodeType: 'ayat' };
    const pointNode: PointNode = { parent: ayatNode, key: -1, nodeType: 'point' };

    const hurufs = detectHurufXYZ(hurufString, pointNode).map((r, idx) => ({
      ...r,
      start: idx === 0 ? start : r.start + offset,
      end: r.end + offset,
    }));

    return hurufs;
  });
};

const detectAyatX: Detector<PasalNode | AmendedPasalNode> = (text, parentPasal) => {
  const regexp = /ayat \((l|[0-9]+)\)/g;
  const matches = [...text.matchAll(regexp)];

  return matches.map((match) => {
    const key = safeParseInt(match[0]?.slice('ayat ('.length, -1) ?? neverString()) ?? neverNum();
    const start = match.index ?? neverNum();
    const end = start + (match[0]?.length ?? neverNum());
    const node: AyatNode = { key, parent: parentPasal, nodeType: 'ayat' };

    const reference: Reference = { start, end, node };
    return reference;
  });
};

// TODO: shorten
function getPosByLenAndIndex(arrLen: number, index: number, start: number): [number, number] {
  if (index === 0) return [start, start + 'huruf a'.length];

  if (arrLen === 2 && index === 1) {
    const _start = start + 'huruf a dan '.length;
    return [_start, _start + 1];
  }

  if (arrLen - 1 === index) {
    const _start = start + 'huruf '.length + 'a, '.length * index + ' dan'.length;
    return [_start, _start + 1];
  }

  const _start = start + 'huruf '.length + 'a, '.length * index;
  return [_start, _start + 1];
}

function detectPasalX(text: string, parentDocumentNode: DocumentNode): Reference[] {
  const regexp = /Pasal [0-9]+/g;
  const matches = [...text.matchAll(regexp)];

  return matches.map((match) => {
    const key = safeParseInt(match[0]?.slice('Pasal '.length) ?? neverString()) ?? neverNum();
    const start = match.index ?? neverNum();
    const end = start + (match[0]?.length ?? neverNum());
    const node: PasalNode = { key, parentDoc: parentDocumentNode, nodeType: 'pasal' };

    const reference: Reference = { start, end, node };
    return reference;
  });
}

function _resolveConflictingReferences(references: Reference[]): Reference[] {
  const sortedReferences = _(references)
    .reverse()
    .sort((x) => x.end - x.start)
    .value();
  const resolvedReferences: Reference[] = [];

  for (const reference of sortedReferences) {
    if (isReferenceCompatible(reference, resolvedReferences)) {
      resolvedReferences.push(reference);
    }
  }

  return resolvedReferences;
}

function isReferenceCompatible(newReference: Reference, references: Reference[]): boolean {
  const { start, end } = newReference;

  return !references.some(
    (r) => (r.start <= start && start < r.end) || (r.start < end && end <= r.end)
  );
}

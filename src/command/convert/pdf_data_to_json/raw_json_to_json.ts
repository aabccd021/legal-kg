import { ReferenceText } from './../../../legal/reference';
import { Paragraf, ParagrafNode, Paragrafs } from './../../../legal/structure/paragraf';
import assertNever from 'assert-never';
import _, { chain, curry, map } from 'lodash';
import { isNil, compact, isUndefined } from 'lodash';
import { DocumentNode } from '../../../legal/document';
import { Ayat, AyatNode, Ayats } from '../../../legal/structure/ayat';
import { Bab, BabNode } from '../../../legal/structure/bab';
import { Bagian, BagianNode, Bagians } from '../../../legal/structure/bagian';
import { Metadata, MetadataNode } from '../../../legal/structure/metadata';
import {
  PasalParentNode,
  getPasalParentDocument,
  PasalNode,
  Pasal,
  IsiPasal,
  Pasals,
} from '../../../legal/structure/pasal';
import { PointsNode, PointNode, Point, Points } from '../../../legal/structure/point';
import { Document } from '../../../legal/document/index';
import { Reference } from '../../../legal/reference';
import {
  AmendedPoint,
  AmenderInsertPoint,
  AmendPoints,
  AmenderUpdatePoint,
  AmendedPasal,
  AmendedPasalNode,
} from '../../../legal/structure/amend';
import { safeParseInt } from './parse_key_from_spans';
import { neverNum, neverString } from '../../../util';

export function rawJsonToJson(document: Document): Document {
  const { babs, mengingat, menimbang, _node } = document;

  return {
    ...document,
    mengingat: mengimbangToDetectedMengimbang(mengingat, 'documentMengingat', _node),
    menimbang: mengimbangToDetectedMengimbang(menimbang, 'documentMenimbang', _node),
    babs: babs?.map((bab) => babToDetectedBab(bab, _node)),
  };
}

function mengimbangToDetectedMengimbang(
  mengimbang: Metadata | undefined,
  metadataType: 'documentMenimbang' | 'documentMengingat',
  parentDocument: DocumentNode
): Metadata | undefined {
  if (isNil(mengimbang)) return undefined;
  const { points, text } = mengimbang;
  const metadataNode: MetadataNode = { metadataType, parentDocument, _structureType: 'metadata' };
  const detectedText = isNil(points)
    ? { ...text, references: detectDocNode(text.text, parentDocument) }
    : text;
  const detectedIsi = !isNil(points) ? pointsToDetectedPoints(points, metadataNode) : points;

  return { ...mengimbang, points: detectedIsi, text: detectedText };
}

function babToDetectedBab(bab: Bab, parentDocument: DocumentNode): Bab {
  const { isi, _key } = bab;
  const babNode: BabNode = { _key, parentDocument, _structureType: 'bab' };
  const detectedIsi: Pasals | Bagians =
    isi._type === 'pasals'
      ? { _type: 'pasals', pasals: isi.pasals.map(toDetectedPasalWith(babNode)) }
      : { _type: 'bagians', bagians: isi.bagians.map(toDetectedBagianWith(babNode)) };

  return { ...bab, isi: detectedIsi };
}

const toDetectedPasalWith = curry(toDetectedPasal);
function toDetectedPasal(parent: PasalParentNode, pasal: Pasal): Pasal {
  const { isi, _key } = pasal;
  const parentDocumentNode = getPasalParentDocument(parent);
  const pasalNode: PasalNode = { _key, parentDocumentNode, _structureType: 'pasal' };
  const detectedIsi = pasalContentToDetectedPasalContent(isi, pasalNode);
  return { ...pasal, isi: detectedIsi };
}

function pasalContentToDetectedPasalContent(isi: IsiPasal, pasalNode: PasalNode): IsiPasal {
  switch (isi._type) {
    case 'amenderPoints':
      return detectedAmendPointsOf(isi, pasalNode);
    default:
      return toDetectedIsiAmendedUpdatePasal(isi, pasalNode);
  }
}

function toDetectedIsiAmendedUpdatePasal(
  isi: Points | ReferenceText | Ayats,
  pasalNode: PasalNode
): Points | ReferenceText | Ayats {
  if (isi._type === 'ayats')
    return { ...isi, ayats: isi.ayats.map((ayat) => ayatToDetectedAyat(ayat, pasalNode)) };
  if (isi._type === 'points') return pointsToDetectedPoints(isi, pasalNode);
  if (isi._type === 'referenceText')
    return { ...isi, references: detectPasalNode(isi.text, pasalNode) };
  assertNever(isi);
}

function detectedAmendPointsOf(amendPoints: AmendPoints, pasalNode: PasalNode): AmendPoints {
  const { _description: description, isi } = amendPoints;
  const detectedIsi = isi.map(detectedAmendPointOf(pasalNode));
  const detectedDescription = {
    ...description,
    references: detectPasalNode(description.text, pasalNode),
  };
  return { ...amendPoints, _description: detectedDescription, isi: detectedIsi };
}

const detectedAmendPointOf = curry(_detectedAmendPointOf);
function _detectedAmendPointOf(pasalNode: PasalNode, amendPoint: AmendedPoint): AmendedPoint {
  if (amendPoint._operation === 'delete') return amendPoint;
  if (amendPoint._operation === 'update')
    return detectedAmendUpdatePasalPointOf(pasalNode, amendPoint);
  if (amendPoint._operation === 'insert')
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
  const detectedIsi = toDetectedIsiAmendedUpdatePasal(amendedPasal.isi, pasalNode);
  const newAmendedPasal: AmendedPasal = { ...amendedPasal, isi: detectedIsi };
  return { ...amendPoint, updatedPasal: newAmendedPasal, description: newDescription };
}
function detectedAmendInsertPasalPointOf(
  pasalNode: PasalNode,
  amendPoint: AmenderInsertPoint
): AmenderInsertPoint {
  const { insertedPasals: amendedPasals, description } = amendPoint;
  const newDescription: ReferenceText = {
    ...description,
    references: detectPasalNode(description.text, pasalNode),
  };
  const newAmendedPasals: AmendedPasal[] = map(amendedPasals, (amendedPasal) => ({
    ...amendedPasal,
    isi: toDetectedIsiAmendedUpdatePasal(amendedPasal.isi, pasalNode),
  }));
  return { ...amendPoint, insertedPasals: newAmendedPasals, description: newDescription };
}

function pointsToDetectedPoints(points: Points, pointsNode: PointsNode): Points {
  const { isi, _description } = points;
  const detectedIsi = isi.map(toDetectedPointWith(pointsNode));
  const descriptionReferences = detectPointParentNode(_description.text, pointsNode);
  return {
    ...points,
    isi: detectedIsi,
    _description: { ..._description, references: descriptionReferences },
  };
}

const toDetectedPointWith = curry(pointToDetectedPoint);
function pointToDetectedPoint(parentPoints: PointsNode, point: Point): Point {
  const { _key, isi } = point;
  const pointNode: PointNode = { _key, parentPoints, _structureType: 'point' };
  const detectedIsi: Points | ReferenceText =
    isi._type === 'points'
      ? pointsToDetectedPoints(isi, pointNode)
      : { ...isi, references: detectPointNode(isi.text, pointNode) };
  return { ...point, isi: detectedIsi };
}

function ayatToDetectedAyat(ayat: Ayat, parentPasal: PasalNode): Ayat {
  const { isi, _key } = ayat;
  const ayatNode: AyatNode = { _key, parentPasal, _structureType: 'ayat' };
  const detectedText: ReferenceText | Points =
    isi._type === 'referenceText'
      ? { ...isi, references: detectAyatNode(isi.text, ayatNode) }
      : pointsToDetectedPoints(isi, ayatNode);

  return { ...ayat, isi: detectedText };
}

const toDetectedBagianWith = curry(toDetectedBagian);
function toDetectedBagian(parentBab: BabNode, bagian: Bagian): Bagian {
  const { _key, isi } = bagian;
  const bagianNode: BagianNode = { _key, parentBab, _structureType: 'bagian' };
  const detectedIsi: Pasals | Paragrafs =
    isi._type === 'pasals'
      ? { _type: 'pasals', pasals: isi.pasals.map(toDetectedPasalWith(bagianNode)) }
      : { _type: 'paragrafs', paragrafs: isi.paragrafs.map(toDetectedParagrafWith(bagianNode)) };

  return { ...bagian, isi: detectedIsi };
}

const toDetectedParagrafWith = curry(toDetectedParagraf);
function toDetectedParagraf(parentBagian: BagianNode, paragraf: Paragraf): Paragraf {
  const { _key, isi } = paragraf;
  const paragrafNode: ParagrafNode = { _key, parentBagian, _structureType: 'paragraf' };
  const pasals = isi.pasals.map(toDetectedPasalWith(paragrafNode));
  return { ...paragraf, isi: { _type: 'pasals', pasals } };
}

function detectPointNode(text: string, pointNode: PointNode): Reference[] {
  const { parentPoints: parent } = pointNode;
  const allReferences = [
    ...detectPointParentNode(text, parent),
    ...detectHurufXYZ(text, pointNode),
  ];

  return _resolveConflictingReferences(allReferences);
}

function detectPointParentNode(text: string, pointsNode: PointsNode): Reference[] {
  switch (pointsNode._structureType) {
    case 'point':
      return [];
    case 'ayat':
      return detectAyatNode(text, pointsNode);
    case 'pasal':
      return detectPasalNode(text, pointsNode);
    case 'metadata':
      return detectDocNode(text, pointsNode.parentDocument);
    case 'amendedPasal':
      return detectPasalNode(text, pointsNode);
  }
}

function detectAyatNode(text: string, ayatNode: AyatNode): Reference[] {
  const { parentPasal } = ayatNode;
  return detectPasalNode(text, parentPasal);
}

function detectPasalNode(text: string, pasalNode: PasalNode | AmendedPasalNode): Reference[] {
  const { parentDocumentNode } = pasalNode;
  const detectors: Detector<PasalNode | AmendedPasalNode>[] = [detectAyatX, detectAyatNHurufXYZ];
  const detectedReferences = detectors.flatMap((detector) => detector(text, pasalNode));
  const docReferences = detectDocNode(text, parentDocumentNode);
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
      { _structureType: 'document', _documentType: 'uud' },
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
      const [, pasal, , ayat] = keyStrs.map((x) => safeParseInt(x));
      if (isUndefined(pasal) || isUndefined(ayat)) {
        console.log(`Unparsable reference: ${match[0]}===${keyStrs}===${match}`);
        return undefined;
      }
      const start = match.index ?? neverNum();
      const end = (match.index ?? neverNum()) + (match[0]?.length ?? neverNum());
      const parentPasal: PasalNode = {
        parentDocumentNode,
        _key: pasal,
        _structureType: 'pasal',
      };
      const node: AyatNode = {
        parentPasal,
        _key: ayat,
        _structureType: 'ayat',
      };

      return { start, end, node };
    })
    .compact()
    .value();
}

function detectHurufXYZ(text: string, parentPoint: PointNode): Reference[] {
  const { parentPoints } = parentPoint;
  const regexp = /huruf ?([a-z]?,? ?)+( [a-z]( |,))/g;
  const matches = [...text.matchAll(regexp)];

  return matches.flatMap((match) => {
    const arr =
      match[0]
        ?.replaceAll(/(huruf| |dan)/g, ',')
        .split(',')
        .filter((x) => ![',', ''].includes(x)) ?? [];

    const start = match.index ?? neverNum();

    return arr.map((_key, idx) => {
      const [hStart, hEnd] = getPosByLenAndIndex(arr.length, idx, start);
      const pointNode: PointNode = { _key, parentPoints, _structureType: 'point' };
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
    const _key = safeParseInt(arr?.[0] ?? neverString()) ?? neverNum();
    const start = match.index ?? neverNum();
    const offset = start + `ayat (${_key})`.length;
    const hurufString = arr?.splice(1).join(',') ?? neverString();
    const ayatNode: AyatNode = { _key, parentPasal, _structureType: 'ayat' };
    const pointNode: PointNode = { parentPoints: ayatNode, _key: -1, _structureType: 'point' };

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
    const _key = safeParseInt(match[0]?.slice('ayat ('.length, -1) ?? neverString()) ?? neverNum();
    const start = match.index ?? neverNum();
    const end = start + (match[0]?.length ?? neverNum());
    const node: AyatNode = { _key, parentPasal, _structureType: 'ayat' };

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
    const _key = safeParseInt(match[0]?.slice('Pasal '.length) ?? neverString()) ?? neverNum();
    const start = match.index ?? neverNum();
    const end = start + (match[0]?.length ?? neverNum());
    const node: PasalNode = { _key, parentDocumentNode, _structureType: 'pasal' };

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

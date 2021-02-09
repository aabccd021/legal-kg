import assertNever from 'assert-never';
import _ from 'lodash';
import { isNil, isArray, compact } from 'lodash';
import { DocumentNode } from '../../../legal/document';
import { Ayat, AyatNode, isAyats } from '../../../legal/structure/ayat';
import { Bab, BabNode } from '../../../legal/structure/bab';
import { Bagian, BagianNode } from '../../../legal/structure/bagian';
import { Metadata, MetadataNode } from '../../../legal/structure/metadata';
import { Paragraf, ParagrafNode } from '../../../legal/structure/paragraf';
import {
  PasalParentNode,
  getPasalParentDocument,
  PasalNode,
  isPasals,
  Pasal,
} from '../../../legal/structure/pasal';
import { PointsNode, PointNode, Point, Points } from '../../../legal/structure/point';
import { Document } from '../../../legal/document/index';
import { Reference } from '../../../legal/reference';

export function rawJsonToJson(document: Document, documentNode: DocumentNode): Document {
  const { babs, mengingat, menimbang } = document;

  return {
    ...document,
    mengingat: mengimbangToDetectedMengimbang(mengingat, 'documentMengingat', documentNode),
    menimbang: mengimbangToDetectedMengimbang(menimbang, 'documentMenimbang', documentNode),
    babs: babs?.map((bab) => babToDetectedBab(bab, documentNode)),
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
  const detectedIsi = isPasals(isi)
    ? isi.map((pasal) => pasalToDetectedPasal(pasal, babNode))
    : isi.map((bagian) => bagianToDetectedBagian(bagian, babNode));

  return { ...bab, isi: detectedIsi };
}

function pasalToDetectedPasal(pasal: Pasal, parent: PasalParentNode): Pasal {
  const { isi, text, _key } = pasal;
  const parentDocument = getPasalParentDocument(parent);
  const pasalNode: PasalNode = { _key, parentDocument, _structureType: 'pasal' };
  const detectedText = isNil(isi)
    ? { ...text, references: detectPasalNode(text.text, pasalNode) }
    : text;
  const detectedIsi = !isNil(isi) ? _pasalToetectedPasal(isi, pasalNode) : isi;

  return { ...pasal, text: detectedText, isi: detectedIsi };
}

function _pasalToetectedPasal(isi: Ayat[] | Points, pasalNode: PasalNode): Ayat[] | Points {
  if (isArray(isi) && isAyats(isi)) return isi.map((ayat) => ayatToDetectedAyat(ayat, pasalNode));

  return pointsToDetectedPoints(isi, pasalNode);
}

function pointsToDetectedPoints(points: Points, pointsNode: PointsNode): Points {
  const { isi, _description } = points;
  const detectedIsi = isi.map((p) => pointToDetectedPoint(p, pointsNode));
  const descriptionReferences = detectPointParentNode(_description.text, pointsNode);

  return {
    ...points,
    isi: detectedIsi,
    _description: { ..._description, references: descriptionReferences },
  };
}

function pointToDetectedPoint(point: Point, parentPoints: PointsNode): Point {
  const { _key, isi, text } = point;
  const pointNode: PointNode = { _key, parentPoints, _structureType: 'point' };
  const detectedText = isNil(isi)
    ? { ...text, references: detectPointNode(text.text, pointNode) }
    : text;
  const detectedIsi = !isNil(isi) ? pointsToDetectedPoints(isi, pointNode) : isi;

  return { ...point, text: detectedText, isi: detectedIsi };
}

function ayatToDetectedAyat(pasal: Ayat, parentPasal: PasalNode): Ayat {
  const { isi, text, _key } = pasal;
  const ayatNode: AyatNode = { _key, parentPasal, _structureType: 'ayat' };
  const detectedText = isNil(isi)
    ? { ...text, references: detectAyatNode(text.text, ayatNode) }
    : text;
  const detectedIsi = !isNil(isi) ? pointsToDetectedPoints(isi, ayatNode) : isi;

  return { ...pasal, text: detectedText, isi: detectedIsi };
}

function bagianToDetectedBagian(bagian: Bagian, parentBab: BabNode): Bagian {
  const { _key, isi } = bagian;
  const bagianNode: BagianNode = { _key, parentBab, _structureType: 'bagian' };
  const detectedIsi = isPasals(isi)
    ? isi.map((pasal) => pasalToDetectedPasal(pasal, bagianNode))
    : isi.map((paragraf) => paragrafToDetectedParagraf(paragraf, bagianNode));

  return { ...bagian, isi: detectedIsi };
}

function paragrafToDetectedParagraf(paragraf: Paragraf, parentBagian: BagianNode): Paragraf {
  const { _key, isi } = paragraf;
  const paragrafNode: ParagrafNode = { _key, parentBagian, _structureType: 'paragraf' };
  const detectedIsi = isi.map((pasal) => pasalToDetectedPasal(pasal, paragrafNode));

  return { ...paragraf, isi: detectedIsi };
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
  if (pointsNode._structureType === 'point') return [];
  if (pointsNode._structureType === 'ayat') return detectAyatNode(text, pointsNode);
  if (pointsNode._structureType === 'pasal') return detectPasalNode(text, pointsNode);
  if (pointsNode._structureType === 'metadata')
    return detectDocNode(text, pointsNode.parentDocument);
  assertNever(pointsNode);
}

function detectAyatNode(text: string, ayatNode: AyatNode): Reference[] {
  const { parentPasal } = ayatNode;
  return detectPasalNode(text, parentPasal);
}

function detectPasalNode(text: string, pasalNode: PasalNode): Reference[] {
  const { parentDocument } = pasalNode;
  const detectors = [detectAyatX, detectAyatNHurufXYZ];
  const detectedReferences = detectors.flatMap((detector) => detector(text, pasalNode));
  const docReferences = detectDocNode(text, parentDocument);
  const allReferences = [...detectedReferences, ...docReferences];

  return _resolveConflictingReferences(allReferences);
}

function detectDocNode(text: string, documentNode: DocumentNode): Reference[] {
  const detectors = [detectPasalX, detectPasalXAyatX];

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
    ['Undang Undang Dasar Negara Republik Indonesia Tahun 1945', { _documentType: 'uud' }],
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

function detectPasalXAyatX(text: string, parentDocument: DocumentNode): Reference[] {
  const regexp = /Pasal [0-9]+ ayat \([0-9]+\)/g;
  const matches = [...text.matchAll(regexp)];

  return matches.map((match) => {
    const keyStrs = compact(match[0]?.split(/(Pasal |ayat \(|\))/));
    const [, pasal, , ayat] = keyStrs.map((x) => parseInt(x));
    const start = match.index ?? neverNum();
    const end = (match.index ?? neverNum()) + (match[0]?.length ?? neverNum());
    const parentPasal: PasalNode = {
      parentDocument,
      _key: pasal ?? neverNum(),
      _structureType: 'pasal',
    };
    const node: AyatNode = {
      parentPasal,
      _key: ayat ?? neverNum(),
      _structureType: 'ayat',
    };

    return { start, end, node };
  });
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

function detectAyatNHurufXYZ(text: string, parentPasal: PasalNode): Reference[] {
  const regexp = /ayat \([0-9]+\) huruf ?([a-z]?,? ?)+( [a-z]( |,))/g;

  const matches = [...text.matchAll(regexp)];

  return matches.flatMap((match) => {
    const arr = match[0]
      ?.replaceAll(/(ayat|\(|\))/g, ',')
      .split(',')
      .filter((x) => ![',', ' ', ''].includes(x));
    const _key = parseInt(arr?.[0] ?? neverString());
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
}

function detectAyatX(text: string, parentPasal: PasalNode): Reference[] {
  const regexp = /ayat \([0-9]+\)/g;
  const matches = [...text.matchAll(regexp)];

  return matches.map((match) => {
    const _key = parseInt(match[0]?.slice('ayat ('.length, -1) ?? neverString());
    const start = match.index ?? neverNum();
    const end = start + (match[0]?.length ?? neverNum());
    const node: AyatNode = { _key, parentPasal, _structureType: 'ayat' };

    const reference: Reference = { start, end, node };
    return reference;
  });
}

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

function detectPasalX(text: string, parentDocument: DocumentNode): Reference[] {
  const regexp = /Pasal [0-9]+/g;
  const matches = [...text.matchAll(regexp)];

  return matches.map((match) => {
    const _key = parseInt(match[0]?.slice('Pasal '.length) ?? neverString());
    const start = match.index ?? neverNum();
    const end = start + (match[0]?.length ?? neverNum());
    const node: PasalNode = { _key, parentDocument, _structureType: 'pasal' };

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

function neverNum(): number {
  throw Error();
}

function neverString(): string {
  throw Error();
}

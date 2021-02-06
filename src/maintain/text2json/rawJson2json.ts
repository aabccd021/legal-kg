import assertNever from 'assert-never';
import _ from 'lodash';
import { isNil, isArray, compact } from 'lodash';
import {
  LegalDocument,
  Mengimbang,
  Bab,
  isPasals,
  Pasal,
  Ayat,
  Points,
  isAyats,
  Point,
  Bagian,
  Paragraf,
  Reference,
} from '../../type';
import {
  MetadataTrace,
  BabTrace,
  PasalTrace,
  PointsTrace,
  PointTrace,
  BagianTrace,
  ParagrafTrace,
  AyatTrace,
  PasalParentTrace,
  getPasalParentDocument,
} from '../../uri/document-structure';
import { DocumentTrace } from '../../uri/document-type';

export function rawJson2json(legal: LegalDocument, trace: DocumentTrace): LegalDocument {
  const { babs, mengingat, menimbang } = legal;

  return {
    ...legal,
    mengingat: mengimbang2detectedMengimbang(mengingat, 'documentMengingat', trace),
    menimbang: mengimbang2detectedMengimbang(menimbang, 'documentMenimbang', trace),
    babs: babs?.map((bab) => bab2detectedBab(bab, trace)),
  };
}

function mengimbang2detectedMengimbang(
  mengimbang: Mengimbang | undefined,
  metadataType: 'documentMenimbang' | 'documentMengingat',
  parentDocument: DocumentTrace
): Mengimbang | undefined {
  if (isNil(mengimbang)) return undefined;
  const { points, text } = mengimbang;
  const trace: MetadataTrace = { metadataType, parentDocument, _structureType: 'metadata' };
  const detectedText = isNil(points)
    ? { ...text, references: detectDocTrace(text.text, parentDocument) }
    : text;
  const detectedIsi = !isNil(points) ? points2detectedPoints(points, trace) : points;

  return { ...mengimbang, points: detectedIsi, text: detectedText };
}

function bab2detectedBab(bab: Bab, parentDocument: DocumentTrace): Bab {
  const { isi, _key } = bab;
  const trace: BabTrace = { _key, parentDocument, _structureType: 'bab' };
  const detectedIsi = isPasals(isi)
    ? isi.map((pasal) => pasal2detectedPasal(pasal, trace))
    : isi.map((bagian) => bagian2detectedBagian(bagian, trace));

  return { ...bab, isi: detectedIsi };
}

function pasal2detectedPasal(pasal: Pasal, parent: PasalParentTrace): Pasal {
  const { isi, text, _key } = pasal;
  const parentDocument = getPasalParentDocument(parent);
  const trace: PasalTrace = { _key, parentDocument, _structureType: 'pasal' };
  const detectedText = isNil(isi)
    ? { ...text, references: detectPasalTrace(text.text, trace) }
    : text;
  const detectedIsi = !isNil(isi) ? _pasal2detectedPasal(isi, trace) : isi;

  return { ...pasal, text: detectedText, isi: detectedIsi };
}

function _pasal2detectedPasal(isi: Ayat[] | Points, trace: PasalTrace): Ayat[] | Points {
  if (isArray(isi) && isAyats(isi)) return isi.map((ayat) => ayat2detectedAyat(ayat, trace));

  return points2detectedPoints(isi, trace);
}

function points2detectedPoints(points: Points, parentTrace: PointsTrace): Points {
  const { isi, _description } = points;
  const detectedIsi = isi.map((p) => point2detectedPoint(p, parentTrace));
  const descriptionReferences = detectPointParentTrace(_description.text, parentTrace);

  return {
    ...points,
    isi: detectedIsi,
    _description: { ..._description, references: descriptionReferences },
  };
}

function point2detectedPoint(point: Point, parentPoints: PointsTrace): Point {
  const { _key, isi, text } = point;
  const trace: PointTrace = { _key, parentPoints, _structureType: 'point' };
  const detectedText = isNil(isi)
    ? { ...text, references: detectPointTrace(text.text, trace) }
    : text;
  const detectedIsi = !isNil(isi) ? points2detectedPoints(isi, trace) : isi;

  return { ...point, text: detectedText, isi: detectedIsi };
}

function ayat2detectedAyat(pasal: Ayat, parentPasal: PasalTrace): Ayat {
  const { isi, text, _key } = pasal;
  const trace: AyatTrace = { _key, parentPasal, _structureType: 'ayat' };
  const detectedText = isNil(isi)
    ? { ...text, references: detectAyatTrace(text.text, trace) }
    : text;
  const detectedIsi = !isNil(isi) ? points2detectedPoints(isi, trace) : isi;

  return { ...pasal, text: detectedText, isi: detectedIsi };
}

function bagian2detectedBagian(bagian: Bagian, parentBab: BabTrace): Bagian {
  const { _key, isi } = bagian;
  const trace: BagianTrace = { _key, parentBab, _structureType: 'bagian' };
  const detectedIsi = isPasals(isi)
    ? isi.map((pasal) => pasal2detectedPasal(pasal, trace))
    : isi.map((paragraf) => paragraf2detectedParagraf(paragraf, trace));

  return { ...bagian, isi: detectedIsi };
}

function paragraf2detectedParagraf(paragraf: Paragraf, parentBagian: BagianTrace): Paragraf {
  const { _key, isi } = paragraf;
  const trace: ParagrafTrace = { _key, parentBagian, _structureType: 'paragraf' };
  const detectedIsi = isi.map((pasal) => pasal2detectedPasal(pasal, trace));

  return { ...paragraf, isi: detectedIsi };
}

function detectPointTrace(text: string, trace: PointTrace): Reference[] {
  const { parentPoints: parent } = trace;
  const allReferences = [...detectPointParentTrace(text, parent), ...detectHurufXYZ(text, trace)];

  return _resolveConflictingReferences(allReferences);
}

function detectPointParentTrace(text: string, trace: PointsTrace): Reference[] {
  if (trace._structureType === 'point') return [];
  if (trace._structureType === 'ayat') return detectAyatTrace(text, trace);
  if (trace._structureType === 'pasal') return detectPasalTrace(text, trace);
  if (trace._structureType === 'metadata') return detectDocTrace(text, trace.parentDocument);
  assertNever(trace);
}

function detectAyatTrace(text: string, ayat: AyatTrace): Reference[] {
  const { parentPasal } = ayat;
  return detectPasalTrace(text, parentPasal);
}

function detectPasalTrace(text: string, trace: PasalTrace): Reference[] {
  const { parentDocument } = trace;
  const detectors = [detectAyatX, detectAyatNHurufXYZ];
  const detectedReferences = detectors.flatMap((detector) => detector(text, trace));
  const docReferences = detectDocTrace(text, parentDocument);
  const allReferences = [...detectedReferences, ...docReferences];

  return _resolveConflictingReferences(allReferences);
}
// interface Omit {
//   <T extends Record<string, unknown>, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
//     [K2 in Exclude<keyof T, K[number]>]: T[K2];
//   };
// }

// const omit: Omit = (obj, ...keys) => {
//   const ret = {} as {
//     [K in keyof typeof obj]: typeof obj[K];
//   };
//   let key: keyof typeof obj;
//   for (key in obj) {
//     if (!keys.includes(key)) {
//       ret[key] = obj[key];
//     }
//   }
//   return ret;
// };

function detectDocTrace(text: string, trace: DocumentTrace): Reference[] {
  const detectors = [detectPasalX, detectPasalXAyatX];

  const detectedReferences = detectors.flatMap((detector) => detector(text, trace));
  const rootReferences = detectRootTrace(text);
  const allReferences = [...detectedReferences, ...rootReferences];

  return _resolveConflictingReferences(allReferences);
}

function detectRootTrace(text: string): Reference[] {
  return detectHardCoded(text);
}

function detectHardCoded(text: string): Reference[] {
  const map: [string, DocumentTrace][] = [
    ['Undang Undang Dasar Negara Republik Indonesia Tahun 1945', { legalType: 'uud' }],
  ];

  const references = map.flatMap(([key, trace]) => {
    const regexp = new RegExp(key, 'g');
    const matches = [...text.matchAll(regexp)];

    return matches.map((match) => {
      const start = match.index ?? neverNum();
      const end = (match.index ?? neverNum()) + (match[0]?.length ?? neverNum());

      return { start, end, trace };
    });
  });

  return references;
}

function detectPasalXAyatX(text: string, parentDocument: DocumentTrace): Reference[] {
  const regexp = /Pasal [0-9]+ ayat \([0-9]+\)/g;
  const matches = [...text.matchAll(regexp)];

  return matches.map((match) => {
    const keyStrs = compact(match[0]?.split(/(Pasal |ayat \(|\))/));
    const [, pasal, , ayat] = keyStrs.map((x) => parseInt(x));
    const start = match.index ?? neverNum();
    const end = (match.index ?? neverNum()) + (match[0]?.length ?? neverNum());
    const parentPasal: PasalTrace = {
      parentDocument,
      _key: pasal ?? neverNum(),
      _structureType: 'pasal',
    };
    const trace: AyatTrace = {
      parentPasal,
      _key: ayat ?? neverNum(),
      _structureType: 'ayat',
    };

    return { start, end, trace };
  });
}

function detectHurufXYZ(text: string, parentPoint: PointTrace): Reference[] {
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
      // const hTrace: PointsTrace = { parentDocument: trace.parentPoints, _key: h };
      const hTrace: PointTrace = { _key, parentPoints, _structureType: 'point' };
      const reference: Reference = { start: hStart, end: hEnd, trace: hTrace };

      return reference;
    });
  });
}

function detectAyatNHurufXYZ(text: string, parentPasal: PasalTrace): Reference[] {
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
    const trace: AyatTrace = { _key, parentPasal, _structureType: 'ayat' };
    const pointTrace: PointTrace = { parentPoints: trace, _key: -1, _structureType: 'point' };

    const hurufs = detectHurufXYZ(hurufString, pointTrace).map((r, idx) => ({
      ...r,
      start: idx === 0 ? start : r.start + offset,
      end: r.end + offset,
    }));

    return hurufs;
  });
}

function detectAyatX(text: string, parentPasal: PasalTrace): Reference[] {
  const regexp = /ayat \([0-9]+\)/g;
  const matches = [...text.matchAll(regexp)];

  return matches.map((match) => {
    const _key = parseInt(match[0]?.slice('ayat ('.length, -1) ?? neverString());
    const start = match.index ?? neverNum();
    const end = start + (match[0]?.length ?? neverNum());
    const trace: AyatTrace = { _key, parentPasal, _structureType: 'ayat' };

    return { start, end, trace };
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

function detectPasalX(text: string, parentDocument: DocumentTrace): Reference[] {
  const regexp = /Pasal [0-9]+/g;
  const matches = [...text.matchAll(regexp)];
  if (text.startsWith('tidak sesuai dengan arah')) {
    console.log(text);
  }

  return matches.map((match) => {
    const _key = parseInt(match[0]?.slice('Pasal '.length) ?? neverString());
    const start = match.index ?? neverNum();
    const end = start + (match[0]?.length ?? neverNum());
    const trace: PasalTrace = { _key, parentDocument, _structureType: 'pasal' };

    return { start, end, trace };
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

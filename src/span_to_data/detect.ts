import { assertNever } from 'assert-never';
import {
  Ayat,
  AyatSet,
  AyatSetNode,
  Mengingat,
  Menimbang,
  PasalNode,
  PasalVersionNode,
  PointSet,
} from '../component';
import { chain, compact, isUndefined } from 'lodash';
import {
  Bagian,
  Document,
  PasalSet,
  PointNode,
  PointSetNode,
  Reference,
  AyatNode,
  Text,
} from '../component';
import { neverNum, neverString } from '../util';
import { safeParseInt } from './parse_key_from_spans';
import { DocumentNode } from '../document';

export function detectInDocument(document: Document): Document {
  const { content, metadata } = document;

  return {
    ...document,
    metadata: {
      ...metadata,
      menimbang: detectInMenimbang(metadata.menimbang),
      mengingat: detectInMengingat(metadata.mengingat),
    },
    content:
      content.type === 'babSet'
        ? {
            ...content,
            elements: content.elements.map((bab) => ({
              ...bab,
              content:
                bab.content.type === 'daftarPasal'
                  ? detectInPasalSet(bab.content)
                  : {
                      ...bab.content,
                      elements: bab.content.elements.map(detectInBagian),
                    },
            })),
          }
        : detectInPasalSet(content),
  };
}

function detectInMenimbang(menimbang: Menimbang | undefined): Menimbang | undefined {
  if (isUndefined(menimbang)) return undefined;
  if (menimbang.content.type === 'daftarHuruf') {
    return { ...menimbang, content: detectInPointSetWhichBelowMetadata(menimbang.content) };
  }
  if (menimbang.content.type === 'text') {
    return {
      ...menimbang,
      content: {
        ...menimbang.content,
        references: detectBelowDocument(menimbang.content.textString),
      },
    };
  }
  assertNever(menimbang.content);
}

function detectInMengingat(mengingat: Mengingat | undefined): Mengingat | undefined {
  if (isUndefined(mengingat)) return undefined;
  if (mengingat.content.type === 'daftarHuruf') {
    return { ...mengingat, content: detectInPointSetWhichBelowMetadata(mengingat.content) };
  }
  if (mengingat.content.type === 'text') {
    return {
      ...mengingat,
      content: {
        ...mengingat.content,
        references: detectBelowDocument(mengingat.content.textString),
      },
    };
  }
  assertNever(mengingat.content);
}

function detectInPointSetWhichBelowMetadata(daftarHuruf: PointSet): PointSet {
  return {
    ...daftarHuruf,
    elements: daftarHuruf.elements.map((point) => {
      if (point.type === 'point') {
        if (point.content.type === 'text') {
          return {
            ...point,
            content: {
              ...point.content,
              references: _resolveConflictingReferences([
                ...detectBelowDocument(point.content.textString),
              ]),
            },
          };
        }
        if (point.content.type === 'daftarHuruf') {
          return {
            ...point,
            content: detectInPointSetWhichBelowMetadata(point.content),
          };
        }
        assertNever(point.content);
      }
      if (point.type === 'pasalDeleteAmenderPoint') return point;
      if (point.type === 'pasalInsertAmenderPoint') return point;
      if (point.type === 'pasalUpdateAmenderPoint') return point;
      assertNever(point);
    }),
  };
}

function detectInPasalSet(daftarPasal: PasalSet): PasalSet {
  return {
    ...daftarPasal,
    elements: daftarPasal.elements.map((pasal) => ({
      ...pasal,
      version: {
        ...pasal.version,
        content: detectInPasalVersionContent(pasal.version.content, pasal.version.node),
      },
    })),
  };
}

function detectInBagian(bagian: Bagian): Bagian {
  return {
    ...bagian,
    content:
      bagian.content.type === 'daftarPasal'
        ? detectInPasalSet(bagian.content)
        : {
            ...bagian.content,
            elements: bagian.content.elements.map((paragraf) => ({
              ...paragraf,
              daftarPasal: detectInPasalSet(paragraf.daftarPasal),
            })),
          },
  };
}

function detectInPasalVersionContent(
  pasalVersionContent: PointSet | Text | AyatSet | undefined,
  pasalVersionNode: PasalVersionNode
): PointSet | Text | AyatSet | undefined {
  if (isUndefined(pasalVersionContent)) return undefined;
  if (pasalVersionContent.type === 'ayatSet')
    return {
      ...pasalVersionContent,
      elements: pasalVersionContent.elements.map((ayat) => {
        if (ayat.content.type === 'daftarHuruf') {
          const newAyat: Ayat = {
            ...ayat,
            content: detectInPointSetWhichBelowPasalVersoin(ayat.content, pasalVersionNode),
          };
          return newAyat;
        }
        if (ayat.content.type === 'text') {
          const newAyat: Ayat = {
            ...ayat,
            content: {
              ...ayat.content,
              references: _resolveConflictingReferences([
                ...detectBelowPasalVersion(ayat.content.textString, pasalVersionNode),
              ]),
            },
          };
          return newAyat;
        }
        assertNever(ayat.content);
      }),
    };
  if (pasalVersionContent.type === 'daftarHuruf')
    return detectInPointSetWhichBelowPasalVersoin(pasalVersionContent, pasalVersionNode);
  if (pasalVersionContent.type === 'text') {
    return {
      ...pasalVersionContent,
      references: _resolveConflictingReferences(
        detectBelowPasalVersion(pasalVersionContent.textString, pasalVersionNode)
      ),
    };
  }
  assertNever(pasalVersionContent);
}

// kalo point set dibawah pasal version, bukan menimbang / mengingat
function detectInPointSetWhichBelowPasalVersoin(
  daftarHuruf: PointSet,
  pasalVersionNode: PasalVersionNode
): PointSet {
  return {
    ...daftarHuruf,
    elements: daftarHuruf.elements.map((point) => {
      if (point.type === 'point') {
        if (point.content.type === 'text') {
          return {
            ...point,
            content: {
              ...point.content,
              references: _resolveConflictingReferences([
                ...detectBelowPasalVersion(point.content.textString, pasalVersionNode),
              ]),
            },
          };
        }
        if (point.content.type === 'daftarHuruf') {
          return {
            ...point,
            content: detectInPointSetWhichBelowPasalVersoin(point.content, pasalVersionNode),
          };
        }
        assertNever(point.content);
      }
      if (point.type === 'pasalDeleteAmenderPoint') return point;
      if (point.type === 'pasalInsertAmenderPoint') return point;
      if (point.type === 'pasalUpdateAmenderPoint') return point;
      assertNever(point);
    }),
  };
}

function detectBelowDocument(textString: string): Reference[] {
  return [...detectUU(textString), ...detectHardCoded(textString)];
}

function detectBelowPasalVersion(
  textString: string,
  pasalVersionNode: PasalVersionNode
): Reference[] {
  return [
    ...detectBelowDocument(textString),
    ...detectPasalX(textString, pasalVersionNode.parentPasalNode.parentNode),
    ...detectHurufXYZ(textString, {
      nodeType: 'daftarHuruf',
      parentNode: pasalVersionNode,
    }),
    ...detectAyatNHurufXYZ(textString, {
      nodeType: 'daftarAyat',
      parentPasalVersionNode: pasalVersionNode,
    }),
    ...detectAyatX(textString, {
      nodeType: 'daftarAyat',
      parentPasalVersionNode: pasalVersionNode,
    }),
    ...detectPasalXAyatX(textString, {
      nodeType: 'daftarAyat',
      parentPasalVersionNode: pasalVersionNode,
    }),
  ];
}

function detectHardCoded(text: string): Reference[] {
  const map: [string, DocumentNode][] = [
    [
      'Undang Undang Dasar Negara Republik Indonesia Tahun 1945',
      { nodeType: 'peraturan', docType: 'uud' },
    ],
    [
      'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
      { nodeType: 'peraturan', docType: 'uud' },
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

function detectUU(text: string): Reference[] {
  return chain([...text.matchAll(/Undang-Undang Nomor [0-9]+ Tahun [0-9]+/g)])
    .map((match) => {
      if (isUndefined(match.index)) throw Error();
      const len = match[0]?.length;
      if (isUndefined(len)) throw Error();
      const [, , nomor, , tahun] = match[0]?.split(' ')?.map(safeParseInt) ?? [];
      if (isUndefined(nomor)) throw Error();
      if (isUndefined(tahun)) throw Error();
      const start = match.index;
      const end = match.index + len;
      const node: DocumentNode = {
        nodeType: 'peraturan',
        docType: 'noTahun',
        docCategory: 'uu',
        nomor,
        tahun,
      };
      return { start, end, node };
    })
    .value();
}

function detectPasalXAyatX(text: string, parentAyatSetNode: AyatSetNode): Reference[] {
  // TODO: give example
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
      const node: AyatNode = {
        parentAyatSetNode,
        key: ayat,
        nodeType: 'ayat',
      };
      return { start, end, node };
    })
    .compact()
    .value();
}

function detectHurufXYZ(text: string, parentPointSetNode: PointSetNode): Reference[] {
  // TODO: give example
  const regexp = /huruf ?([a-z]?,? ?)+( [a-z]( |,))/g;
  const matches = [...text.matchAll(regexp)];

  const references = matches.flatMap((match) => {
    const arr =
      match[0]
        ?.replaceAll(/(huruf| |dan)/g, ',')
        .split(',')
        .filter((x) => ![',', ''].includes(x)) ?? [];

    const start = match.index ?? neverNum();

    return arr.map((key, idx) => {
      const [hStart, hEnd] = getPosByLenAndIndex(arr.length, idx, start);
      const pointNode: PointNode = { key, parentPointSetNode, nodeType: 'huruf' };
      const reference: Reference = { start: hStart, end: hEnd, node: pointNode };

      return reference;
    });
  });
  return references;
}

type Detector<T> = (text: string, node: T) => Reference[];

const detectAyatNHurufXYZ: Detector<AyatSetNode> = (text, parentAyatSetNode) => {
  // TODO: give example
  const regexp = /ayat \((l|[0-9]+)\) huruf ?([a-z]?,? ?)+( [a-z]( |,))/g;

  const matches = [...text.matchAll(regexp)];

  return matches.flatMap((match) => {
    const arr = match[0]
      ?.replaceAll(/(ayat|\(|\))/g, ',')
      .split(',')
      .filter((x) => ![',', ' ', ''].includes(x));
    const ayatKey = safeParseInt(arr?.[0] ?? neverString()) ?? neverNum();
    const start = match.index ?? neverNum();
    const offset = start + `ayat (${ayatKey})`.length;
    const hurufString = arr?.splice(1).join(',') ?? neverString();
    const daftarHurufNode: PointSetNode = {
      nodeType: 'daftarHuruf',
      parentNode: { nodeType: 'ayat', key: ayatKey, parentAyatSetNode },
    };

    const hurufs = detectHurufXYZ(hurufString, daftarHurufNode).map((r, idx) => ({
      ...r,
      start: idx === 0 ? start : r.start + offset,
      end: r.end + offset,
    }));

    return hurufs;
  });
};

const detectAyatX: Detector<AyatSetNode> = (text, parentAyatSetNode) => {
  // TODO: give example
  const regexp = /ayat \((l|[0-9]+)\)/g;
  const matches = [...text.matchAll(regexp)];

  return matches.map((match) => {
    const key = safeParseInt(match[0]?.slice('ayat ('.length, -1) ?? neverString()) ?? neverNum();
    const start = match.index ?? neverNum();
    const end = start + (match[0]?.length ?? neverNum());
    const node: AyatNode = { key, parentAyatSetNode, nodeType: 'ayat' };

    const reference: Reference = { start, end, node };
    return reference;
  });
};

// // TODO: shorten
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

function detectPasalX(text: string, parentNode: DocumentNode): Reference[] {
  const regexp = /Pasal [0-9]+/g;
  const matches = [...text.matchAll(regexp)];

  return matches.map((match) => {
    const key = safeParseInt(match[0]?.slice('Pasal '.length) ?? neverString()) ?? neverNum();
    const start = match.index ?? neverNum();
    const end = start + (match[0]?.length ?? neverNum());
    const node: PasalNode = { key, parentNode, nodeType: 'pasal' };

    const reference: Reference = { start, end, node };
    return reference;
  });
}

function _resolveConflictingReferences(references: Reference[]): Reference[] {
  const sortedReferences = chain(references)
    .reverse()
    .sort((x) => x.end - x.start)
    .reduce<Reference[]>(
      (prev, reference) => (isReferenceCompatible(reference, prev) ? [...prev, reference] : prev),
      []
    )
    .value();

  return sortedReferences;
}

function isReferenceCompatible(newReference: Reference, references: Reference[]): boolean {
  const { start, end } = newReference;

  return !references.some(
    (r) => (r.start <= start && start < r.end) || (r.start < end && end <= r.end)
  );
}

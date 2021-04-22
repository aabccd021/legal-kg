import { AyatSetNode, PasalNode } from './../../../legal/component';
import { chain, compact, isUndefined } from 'lodash';
import {
  Bab,
  Bagian,
  Document,
  PasalSet,
  PointNode,
  PointSetNode,
  Reference,
  Pasal,
  Text,
  PasalVersionNode,
  AyatNode,
} from '../../../legal/component';
import { neverNum, neverString } from '../../../util';
import { safeParseInt } from './parse_key_from_spans';
import { DocumentNode } from '../../../legal/document';

export function detectDocument(document: Document): Document {
  const { babSet } = document;

  return {
    ...document,
    babSet: {
      ...babSet,
      elements: babSet.elements.map(detectBab),
    },
  };
}

function detectBab(bab: Bab): Bab {
  return {
    ...bab,
    content:
      bab.content.type === 'pasalSet'
        ? detectPasalSet(bab.content)
        : {
            ...bab.content,
            elements: bab.content.elements.map(detectBagian),
          },
  };
}

function detectPasalSet(pasalSet: PasalSet): PasalSet {
  return {
    ...pasalSet,
    elements: pasalSet.elements.map(detectPasal),
  };
}

function detectBagian(bagian: Bagian): Bagian {
  return {
    ...bagian,
    content:
      bagian.content.type === 'pasalSet'
        ? detectPasalSet(bagian.content)
        : {
            ...bagian.content,
            elements: bagian.content.elements.map((paragraf) => ({
              ...paragraf,
              pasalSet: detectPasalSet(paragraf.pasalSet),
            })),
          },
  };
}

function detectPasal(pasal: Pasal): Pasal {
  if (pasal.version.content === undefined) return pasal;
  if (pasal.version.content?.type !== 'text') return pasal;
  return {
    ...pasal,
    version: {
      ...pasal.version,
      content: detectPasalVersionText(pasal.version.content, pasal.version.node),
    },
  };
}

function detectPasalVersionText(text: Text, pasalVersionNode: PasalVersionNode): Text {
  const references: Reference[] = [
    ...detectHardCoded(text.textString),
    ...detectPasalX(text.textString, pasalVersionNode.parentPasalNode.parentNode),
    ...detectHurufXYZ(text.textString, { nodeType: 'pointSet', parentNode: pasalVersionNode }),
    ...detectAyatNHurufXYZ(text.textString, {
      nodeType: 'ayatSet',
      parentPasalVersionNode: pasalVersionNode,
    }),
    ...detectAyatX(text.textString, {
      nodeType: 'ayatSet',
      parentPasalVersionNode: pasalVersionNode,
    }),
    ...detectPasalXAyatX(text.textString, {
      nodeType: 'ayatSet',
      parentPasalVersionNode: pasalVersionNode,
    }),
  ];
  return { ...text, references: _resolveConflictingReferences(references) };
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

function detectPasalXAyatX(text: string, parentAyatSetNode: AyatSetNode): Reference[] {
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
      const pointNode: PointNode = { key, parentPointSetNode, nodeType: 'point' };
      const reference: Reference = { start: hStart, end: hEnd, node: pointNode };

      return reference;
    });
  });
  return references;
}

type Detector<T> = (text: string, node: T) => Reference[];

const detectAyatNHurufXYZ: Detector<AyatSetNode> = (text, parentAyatSetNode) => {
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
    const pointSetNode: PointSetNode = {
      nodeType: 'pointSet',
      parentNode: { nodeType: 'ayat', key: ayatKey, parentAyatSetNode },
    };

    const hurufs = detectHurufXYZ(hurufString, pointSetNode).map((r, idx) => ({
      ...r,
      start: idx === 0 ? start : r.start + offset,
      end: r.end + offset,
    }));

    return hurufs;
  });
};

const detectAyatX: Detector<AyatSetNode> = (text, parentAyatSetNode) => {
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

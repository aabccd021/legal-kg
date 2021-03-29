import { assertNever } from 'assert-never';
import {
  AmendedPoint,
  AmenderPoints,
  AmenderInsertPoint,
  AmenderUpdatePoint,
  AmenderDeletePointNode,
  AmenderDeletePoint,
  AmendedPasal,
  AmenderInsertPointNode,
  AmenderUpdatePointNode,
  AmendedPasalNode,
} from '../../../legal/component/amend';
import { PasalContent } from '../../../legal/component/pasal';
import { compact, isNil, curry, flatMap, map } from 'lodash';
import { Triple } from './triple';
import { Document, DocumentNode } from '../../../legal/document/index';
import { Ayat, AyatNode } from '../../../legal/component/ayat';
import { Bab, BabNode } from '../../../legal/component/bab';
import { Bagian, BagianNode } from '../../../legal/component/bagian';
import { Paragraf, ParagrafNode } from '../../../legal/component/paragraf';
import { Points, PointsNode, Point, PointNode } from '../../../legal/component/point';
import { Reference } from '../../../legal/reference';
import {
  Pasal,
  PasalParentNode,
  getPasalParentDocument,
  PasalNode,
} from '../../../legal/component/pasal';

export function yamlToTriples({
  // _name,
  // _nomor,
  // _tahun,
  // _pemutus,
  // _tentang,
  // _salinan,
  // _memutuskan,
  // _tempatDisahkan,
  // _tanggalDisahkan,
  // _tempatDitetapkan,
  // _tanggalDitetapkan,
  // _jabatanPengesah,
  // _namaPengesah,
  // _tempatDiundangkan,
  // _tanggalDiundangkan,
  // _sekretaris,
  // _denganPersetujuan,
  // _dokumen,
  _node,
  // penjelasan,
  // mengingat,
  // menimbang,
  babs,
}: Document): Triple[] {
  // const denganPersetujuanTriple: Triple[] =
  // _denganPersetujuan?.map((x) => [_node, 'denganPersetujuan', x]) ?? [];
  const triples: (Triple | undefined)[] = [
    // ...metadataToTriple(_node, 'documentMenimbang', menimbang),
    // ...metadataToTriple(_node, 'documentMengingat', mengingat),
    ...flatMap(babs, babToTripleWith(_node)),
    // isUndefined(penjelasan) ? undefined : [_node, 'penjelasan', penjelasan.join('\n')],
    // [_node, 'name', _name],
    // [_node, 'nomor', _nomor],
    // [_node, 'tahun', _tahun],
    // [_node, 'pemutus', _pemutus],
    // [_node, 'tentang', _tentang],
    // [_node, 'salinan', _salinan],
    // [_node, 'memutuskan', _memutuskan],
    // [_node, 'tempatDisahkan', _tempatDisahkan],
    // [_node, 'tanggalDisahkan', _tanggalDisahkan],
    // [_node, 'tempatDitetapkan', _tempatDitetapkan],
    // [_node, 'tanggalDitetapkan', _tanggalDitetapkan],
    // [_node, 'jabatanPengesah', _jabatanPengesah],
    // [_node, 'namaPengesah', _namaPengesah],
    // [_node, 'tempatDiundangkan', _tempatDiundangkan],
    // [_node, 'tanggalDiundangkan', _tanggalDiundangkan],
    // [_node, 'sekretaris', _sekretaris],
    // [_node, 'dokumen', _dokumen],
    // ...denganPersetujuanTriple,
  ];

  return compact(triples);
}

// function metadataToTriple(
//   parentDocument: DocumentNode,
//   metadataType: 'documentMengingat' | 'documentMenimbang',
//   mengimbang?: Metadata
// ): Triple[] {
//   if (isNil(mengimbang)) return [];
//   const metadata: MetadataNode = { metadataType, parentDocument, nodeType: 'metadata' };
//   const { points, text } = mengimbang;
//   const isiTriples: Triple[] = isNil(points)
//     ? [[metadata, 'hasText', text.text]]
//     : pointsToTriple(metadata, points);

//   return [...isiTriples, [parentDocument, 'hasMetadata', metadata]];
// }

const babToTripleWith = curry(babToTriple);
function babToTriple(parentDocument: DocumentNode, bab: Bab): Triple[] {
  const { key, title, content } = bab;
  const babkey: BabNode = { key, parent: parentDocument, nodeType: 'bab' };
  const isikeys =
    content.type === 'bagians'
      ? flatMap(content.bagianArr, bagianToTripleWith(babkey))
      : flatMap(content.pasalArr, pasalToTripleWith(babkey));

  return [
    [parentDocument, 'documentHasBab', babkey],
    [babkey, 'babHasKey', key],
    [babkey, 'babHasTitle', title],
    ...isikeys,
  ];
}

const bagianToTripleWith = curry(bagianToTriple);
function bagianToTriple(parentBab: BabNode, bagian: Bagian): Triple[] {
  const bagiankey: BagianNode = {
    nodeType: 'bagian',
    key: bagian.key,
    parent: parentBab,
  };
  return [
    [parentBab, 'babHasBagian', bagiankey],
    [bagiankey, 'bagianHasKey', bagian.key],
    ...(bagian.content.type === 'paragrafs'
      ? flatMap(bagian.content.paragrafArr, paragrafToTripleWith(bagiankey))
      : flatMap(bagian.content.pasalArr, pasalToTripleWith(parentBab))),
  ];
}

const paragrafToTripleWith = curry(paragrafToTriple);
function paragrafToTriple(parent: BagianNode, paragraf: Paragraf): Triple[] {
  const paragrafNode: ParagrafNode = {
    nodeType: 'paragraf',
    key: paragraf.key,
    parent,
  };
  return [
    [parent, 'bagianHasParagraf', paragrafNode],
    [paragrafNode, 'paragrafHasKey', paragraf.key],
    ...flatMap(paragraf.content.pasalArr, pasalToTripleWith(paragrafNode)),
  ];
}

const pasalToTripleWith = curry(pasalToTriple);
function pasalToTriple(parent: PasalParentNode, pasal: Pasal): Triple[] {
  const pasalNode: PasalNode = {
    nodeType: 'pasal',
    key: pasal.key,
    parentDoc: getPasalParentDocument(parent),
  };
  return [
    pasalParentToTriple(parent, pasalNode),
    [pasalNode, 'pasalHasKey', pasal.key],
    ...pasalContentToTriple(pasalNode, pasal.content),
  ];
}

function pasalParentToTriple(parent: PasalParentNode, pasal: PasalNode): Triple {
  if (parent.nodeType === 'bab') return [parent, 'babHasPasal', pasal];
  if (parent.nodeType === 'bagian') return [parent, 'bagianHasPasal', pasal];
  if (parent.nodeType === 'paragraf') return [parent, 'paragrafHasPasal', pasal];
  assertNever(parent);
}

function pasalContentToTriple(pasalNode: PasalNode, content: PasalContent): Triple[] {
  if (content.type === 'ayats') return content.ayatArr.flatMap(ayatToTripleWith(pasalNode));
  if (content.type === 'points') return pointsToTriple(pasalNode, content);
  if (content.type === 'referenceText') return referencesToTriple(pasalNode, content.references);
  if (content.type === 'amenderPoints') return amenderPointsToTriple(pasalNode, content);
  assertNever(content);
}

const ayatToTripleWith = curry(ayatToTriple);
function ayatToTriple(parent: PasalNode, ayat: Ayat): Triple[] {
  const ayatNode: AyatNode = {
    nodeType: 'ayat',
    key: ayat.key,
    parent,
  };
  const isiTriples: Triple[] =
    ayat.content.type === 'points'
      ? pointsToTriple(ayatNode, ayat.content)
      : [
          [ayatNode, 'ayatHasText', ayat.content.text],
          ...referencesToTriple(ayatNode, ayat.content.references),
        ];
  return [[parent, 'pasalHasAyat', ayatNode], [ayatNode, 'ayatHasKey', ayat.key], ...isiTriples];
}

function amenderPointsToTriple(pointsNode: PointsNode, points: AmenderPoints): Triple[] {
  const { description: _description, amendedPointArr: isi, parent: parentDocument } = points;
  return [
    [pointsNode, 'pointsHasDescription', _description.text],
    ...referencesToTriple(pointsNode, _description.references),
    ...isi.flatMap(amendedPointToTripleWith(pointsNode, parentDocument)),
  ];
}

function pointsToTriple(pointsNode: PointsNode, points: Points): Triple[] {
  if (isNil(points)) return [];
  const { description: _description, content: isi } = points;
  return [
    [pointsNode, 'pointsHasDescription', _description.text],
    ...referencesToTriple(pointsNode, _description.references),
    ...isi.flatMap((i) => pointToTriple(pointsNode, i)),
  ];
}

const amendedPointToTripleWith = curry(amendedPointToTriple);
function amendedPointToTriple(
  pointsNode: PointsNode,
  parentDocument: DocumentNode,
  point: AmendedPoint
): Triple[] {
  switch (point.operation) {
    case 'delete':
      return amenderDeletePointToTriple(pointsNode, point);
    case 'insert':
      return amenderInsertPointToTriple(pointsNode, parentDocument, point);
    case 'update':
      return amenderUpdatePointToTriple(pointsNode, parentDocument, point);
  }
}

function amenderDeletePointToTriple(pointsNode: PointsNode, point: AmenderDeletePoint): Triple[] {
  const { key: _nomorKey, deletedNode: deletedPasal } = point;
  const node: AmenderDeletePointNode = {
    nodeType: 'amenderPoint',
    operation: 'delete',
    key: _nomorKey,
    parent: pointsNode,
  };
  return [[node, 'amenderDeletePointHasPasal', deletedPasal]];
}

function amenderInsertPointToTriple(
  pointsNode: PointsNode,
  parentDocument: DocumentNode,
  point: AmenderInsertPoint
): Triple[] {
  const { key, amendedPasalArr, description } = point;
  const node: AmenderInsertPointNode = {
    nodeType: 'amenderPoint',
    operation: 'insert',
    key,
    parent: pointsNode,
  };
  return [
    [node, 'amenderInsertPointHasDescription', description.text],
    ...referencesToTriple(node, description.references),
    ...flatMap(
      amendedPasalArr,
      amendedPasalToTripleWith({ parentPointNode: node, parentDocument })
    ),
  ];
}

function amenderUpdatePointToTriple(
  pointsNode: PointsNode,
  parentDocument: DocumentNode,
  point: AmenderUpdatePoint
): Triple[] {
  const { key, updatedPasal, description } = point;
  const node: AmenderUpdatePointNode = {
    nodeType: 'amenderPoint',
    operation: 'update',
    key: key,
    parent: pointsNode,
  };
  return [
    [node, 'amenderUpdatePointHasDescription', description.text],
    ...referencesToTriple(node, description.references),
    ...amendedPasalToTriple({ parentPointNode: node, parentDocument }, updatedPasal),
  ];
}

const amendedPasalToTripleWith = curry(amendedPasalToTriple);
function amendedPasalToTriple(
  context: {
    parentPointNode: AmenderUpdatePointNode | AmenderInsertPointNode;
    parentDocument: DocumentNode;
  },
  amendedPasal: AmendedPasal
): Triple[] {
  const { parentPointNode, parentDocument } = context;
  const node: AmendedPasalNode = {
    nodeType: 'amendedPasal',
    key: amendedPasal.key,
    parentDoc: parentDocument,
    amenderPointNode: parentPointNode,
  };
  return parentPointNode.operation === 'insert'
    ? [[parentPointNode, 'amenderInsertPointInsertedPasal', node]]
    : [[parentPointNode, 'amenderUpdatePointUpdatedPasal', node]];
}

function pointToTriple(pointsNode: PointsNode, point: Point): Triple[] {
  const { key, content: isi } = point;
  const pointNode: PointNode = { key, parent: pointsNode, nodeType: 'point' };
  const isiTriples: Triple[] =
    isi.type === 'points'
      ? pointsToTriple(pointNode, isi)
      : [[pointNode, 'pointHasText', isi.text], ...referencesToTriple(pointNode, isi.references)];
  return [
    [pointsNode, 'pointsHasPoint', pointNode],
    [pointNode, 'pointHasKey', key],
    ...isiTriples,
  ];
}

function referencesToTriple(
  parent: PointsNode | AmenderUpdatePointNode | AmenderInsertPointNode | AmendedPasalNode,
  references: Reference[]
): Triple[] {
  return map(references, ({ node }) => [parent, 'references', node] as Triple);
}

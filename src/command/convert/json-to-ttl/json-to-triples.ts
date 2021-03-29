import { BabSet, BabSetNode, BagianSet, BagianSetNode, ParagrafSet } from './../../../legal/component/index';
import assertNever from 'assert-never';
import { flatMap, compact, curry, isNil, map } from 'lodash';
import {
  Bab,
  BabNode,
  Bagian,
  BagianNode,
  Paragraf,
  ParagrafNode,
  Pasal,
  PasalNode,
  getPasalParentDocument,
  Ayat,
  AyatNode,
  PointSet,
  Text,
  AyatSet,
  Point,
  PointNode,
  Reference,
  BabSetNode,
} from '../../../legal/component';
import {
  AmendedPasalNode,
  AmenderPoints,
  AmendedPoint,
  AmenderDeletePoint,
  AmenderDeletePointNode,
  AmenderInsertPoint,
  AmenderInsertPointNode,
  AmenderUpdatePoint,
  AmenderUpdatePointNode,
  AmendedPasal,
} from '../../../legal/component/amend';
import { Document, DocumentNode } from '../../../legal/document';
import { LegalTriple } from './triple';

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
  babSet,
}: Document): LegalTriple[] {
  // const denganPersetujuanTriple: Triple[] =
  // _denganPersetujuan?.map((x) => [_node, 'denganPersetujuan', x]) ?? [];
  const triples: (LegalTriple | undefined)[] = [
    // ...metadataToTriple(_node, 'documentMenimbang', menimbang),
    // ...metadataToTriple(_node, 'documentMengingat', mengingat),
    ...babSetToTriple(_node, babSet),
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
//   const contentTriples: Triple[] = isNil(points)
//     ? [[metadata, 'hasText', text.text]]
//     : pointsToTriple(metadata, points);

//   return [...contentTriples, [parentDocument, 'hasMetadata', metadata]];
// }

function babSetToTriple(parentDocNode: DocumentNode, babSet: BabSet): LegalTriple[] {
  const babSetNode: BabSetNode = { nodeType: 'babSet', parent: parentDocNode };
  return flatMap(babSet.elements, babToTripleWith(babSetNode));
}

const babToTripleWith = curry(babToTriple);
function babToTriple(parentBabSetNode: BabSetNode, bab: Bab): LegalTriple[] {
  // const babNode: BabNode = { key, parent: parentDocument, nodeType: 'bab' };
  // const contentTriples: Triple[] =
  //   content.type === 'bagians'
  //     ? flatMap(content.bagianArr, bagianToTripleWith(babNode))
  //     : flatMap(content.pasalArr, pasalToTripleWith(babNode));
  const babNode: BabNode = { nodeType: 'bab', key: bab.key, parent: parentBabSetNode };
  return [
    [parentBabSetNode, 'babSetHasBab', babNode],
    [babNode, 'babHasKey', bab.key],
    [babNode, 'babHasTitle', bab.title],
    // ...contentTriples,
  ];
}

function bagianSetToTriple(parentBabNode: BabNode, bagianSet: BagianSet): LegalTriple[] {
  const bagianSetNode: BagianSetNode = { nodeType: 'bagianSet', parent: parentBabNode };
  return flatMap(bagianSet.elements, bagianToTripleWith(bagianSetNode));
}

const bagianToTripleWith = curry(bagianToTriple);
function bagianToTriple(parentBagianSetNode: BagianSetNode, bagian: Bagian): LegalTriple[] {
  const bagianNode: BagianNode = {
    nodeType: 'bagian',
    key: bagian.key,
    parent: parentBagianSetNode,
  };
  return [
    [parentBagianSetNode, 'bagianSetHasBagian', bagianNode],
    [bagianNode, 'bagianHasKey', bagian.key],
    [bagianNode, 'bagianHasJudul', bagian.title],
    // ...(bagian.content.type === 'paragrafs'
    //   ? flatMap(bagian.content.paragrafArr, paragrafToTripleWith(bagiankey))
    //   : flatMap(bagian.content.pasalArr, pasalToTripleWith(parentBab))),
  ];
}

function paragrafSetToTriple(parentBagianNode: BagianNode, paragrafSet: ParagrafSet): LegalTriple[] {

}

const paragrafToTripleWith = curry(paragrafToTriple);
function paragrafToTriple(parent: BagianNode, paragraf: Paragraf): LegalTriple[] {
  const paragrafNode: ParagrafNode = { nodeType: 'paragraf', key: paragraf.key, parent };
  return [
    [parent, 'bagianHasParagraf', paragrafNode],
    [paragrafNode, 'paragrafHasKey', paragraf.key],
    ...flatMap(paragraf.content.elements, pasalToTripleWith(paragrafNode)),
  ];
}

const pasalToTripleWith = curry(pasalToTriple);
function pasalToTriple(parent: PasalParentNode, pasal: Pasal): LegalTriple[] {
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

function pasalParentToTriple(parent: PasalParentNode, pasal: PasalNode): LegalTriple {
  if (parent.nodeType === 'bab') return [parent, 'babHasPasal', pasal];
  if (parent.nodeType === 'bagian') return [parent, 'bagianHasPasal', pasal];
  if (parent.nodeType === 'paragraf') return [parent, 'paragrafHasPasal', pasal];
  assertNever(parent);
}

function pasalContentToTriple(pasalNode: PasalNode, content: PasalContent): LegalTriple[] {
  if (content.type === 'ayats') return content.ayatArr.flatMap(ayatToTripleWith(pasalNode));
  if (content.type === 'points') return pointsToTriple(pasalNode, content);
  if (content.type === 'referenceText') return referencesToTriple(pasalNode, content.references);
  if (content.type === 'amenderPoints') return amenderPointsToTriple(pasalNode, content);
  assertNever(content);
}

const ayatToTripleWith = curry(ayatToTriple);
function ayatToTriple(parent: PasalNode | AmendedPasalNode, ayat: Ayat): LegalTriple[] {
  const ayatNode: AyatNode = { nodeType: 'ayat', key: ayat.key, parent };
  const contentTriples: LegalTriple[] =
    ayat.content.type === 'points'
      ? pointsToTriple(ayatNode, ayat.content)
      : [
          [ayatNode, 'ayatHasText', ayat.content.text],
          ...referencesToTriple(ayatNode, ayat.content.references),
        ];
  return [
    [parent, 'pasalHasAyat', ayatNode],
    [ayatNode, 'ayatHasKey', ayat.key],
    ...contentTriples,
  ];
}

function amenderPointsToTriple(pointsNode: PointsNode, points: AmenderPoints): LegalTriple[] {
  return [
    [pointsNode, 'pointsHasDescription', points.description.text],
    ...referencesToTriple(pointsNode, points.description.references),
    ...points.amendedPointArr.flatMap(amendedPointToTripleWith(pointsNode, points.parent)),
  ];
}

function pointsToTriple(pointsNode: PointsNode, points: PointSet): LegalTriple[] {
  if (isNil(points)) return [];
  return [
    [pointsNode, 'pointsHasDescription', points.description.text],
    ...referencesToTriple(pointsNode, points.description.references),
    ...points.elements.flatMap(pointToTripleWith(pointsNode)),
  ];
}

const amendedPointToTripleWith = curry(amendedPointToTriple);
function amendedPointToTriple(
  pointsNode: PointsNode,
  parentDocument: DocumentNode,
  point: AmendedPoint
): LegalTriple[] {
  switch (point.operation) {
    case 'delete':
      return amenderDeletePointToTriple(pointsNode, point);
    case 'insert':
      return amenderInsertPointToTriple(pointsNode, parentDocument, point);
    case 'update':
      return amenderUpdatePointToTriple(pointsNode, parentDocument, point);
  }
}

function amenderDeletePointToTriple(
  pointsNode: PointsNode,
  point: AmenderDeletePoint
): LegalTriple[] {
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
): LegalTriple[] {
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
      amendedPasalToTripleWith({ amenderPointNode: node, parentDoc: parentDocument })
    ),
  ];
}

function amenderUpdatePointToTriple(
  pointsNode: PointsNode,
  parentDoc: DocumentNode,
  point: AmenderUpdatePoint
): LegalTriple[] {
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
    ...amendedPasalToTriple({ amenderPointNode: node, parentDoc }, updatedPasal),
  ];
}

const amendedPasalToTripleWith = curry(amendedPasalToTriple);
function amendedPasalToTriple(
  context: {
    amenderPointNode: AmenderUpdatePointNode | AmenderInsertPointNode;
    parentDoc: DocumentNode;
  },
  amendedPasal: AmendedPasal
): LegalTriple[] {
  const { amenderPointNode, parentDoc } = context;
  const node: AmendedPasalNode = {
    nodeType: 'amendedPasal',
    key: amendedPasal.key,
    parentDoc,
    amenderPointNode,
  };
  const parentHasPasalTriple: LegalTriple =
    amenderPointNode.operation === 'insert'
      ? [amenderPointNode, 'amenderInsertPointInsertedPasal', node]
      : [amenderPointNode, 'amenderUpdatePointUpdatedPasal', node];
  return [
    parentHasPasalTriple,
    [node, 'amendedPasalHasKey', amendedPasal.key],
    ...amendedPasalContentToTriple(node, amendedPasal.content),
  ];
}

function amendedPasalContentToTriple(
  pasalNode: AmendedPasalNode,
  content: PointSet | Text | AyatSet
): LegalTriple[] {
  if (content.type === 'ayats') return content.elements.flatMap(ayatToTripleWith(pasalNode));
  if (content.type === 'points') return pointsToTriple(pasalNode, content);
  if (content.type === 'referenceText') return referencesToTriple(pasalNode, content.references);
  assertNever(content);
}

const pointToTripleWith = curry(pointToTriple);
function pointToTriple(parent: PointsNode, point: Point): LegalTriple[] {
  const pointNode: PointNode = { key: point.key, parent, nodeType: 'point' };
  const contentTriples: LegalTriple[] =
    point.content.type === 'points'
      ? pointsToTriple(pointNode, point.content)
      : [
          [pointNode, 'pointHasText', point.content.text],
          ...referencesToTriple(pointNode, point.content.references),
        ];
  return [
    [parent, 'pointsHasPoint', pointNode],
    [pointNode, 'pointHasKey', point.key],
    ...contentTriples,
  ];
}

function referencesToTriple(
  parent: PointsNode | AmenderUpdatePointNode | AmenderInsertPointNode | AmendedPasalNode,
  references: Reference[]
): LegalTriple[] {
  return map(references, ({ node }) => [parent, 'references', node] as LegalTriple);
}

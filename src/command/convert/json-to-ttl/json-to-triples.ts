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
} from './../../../legal/structure/amend';
import { IsiPasal } from './../../../legal/structure/pasal';
import { compact, isNil, curry, flatMap, isUndefined, map } from 'lodash';
import { Triple } from './triple';
import { Document, DocumentNode } from '../../../legal/document/index';
import { Ayat, AyatNode } from '../../../legal/structure/ayat';
import { Bab, BabNode } from '../../../legal/structure/bab';
import { Bagian, BagianNode } from '../../../legal/structure/bagian';
import { Metadata, MetadataNode } from '../../../legal/structure/metadata';
import { Paragraf, ParagrafNode } from '../../../legal/structure/paragraf';
import { Points, PointsNode, Point, PointNode } from '../../../legal/structure/point';
import { Reference } from '../../../legal/reference';
import {
  Pasal,
  PasalParentNode,
  getPasalParentDocument,
  PasalNode,
} from '../../../legal/structure/pasal';

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
  _denganPersetujuan,
  // _dokumen,
  _node,
  penjelasan,
  mengingat,
  menimbang,
  babs,
}: Document): Triple[] {
  const denganPersetujuanTriple: Triple[] =
    _denganPersetujuan?.map((x) => [_node, 'denganPersetujuan', x]) ?? [];
  const triples: (Triple | undefined)[] = [
    ...metadataToTriple(_node, 'documentMenimbang', menimbang),
    ...metadataToTriple(_node, 'documentMengingat', mengingat),
    ...flatMap(babs, babToTripleWith(_node)),
    isUndefined(penjelasan) ? undefined : [_node, 'penjelasan', penjelasan.join('\n')],
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
    ...denganPersetujuanTriple,
  ];

  return compact(triples);
}

function metadataToTriple(
  parentDocument: DocumentNode,
  metadataType: 'documentMengingat' | 'documentMenimbang',
  mengimbang?: Metadata
): Triple[] {
  if (isNil(mengimbang)) return [];
  const metadata: MetadataNode = { metadataType, parentDocument, _structureType: 'metadata' };
  const { points, text } = mengimbang;
  const isiTriples: Triple[] = isNil(points)
    ? [[metadata, 'hasText', text.text]]
    : pointsToTriple(metadata, points);

  return [...isiTriples, [parentDocument, 'hasMetadata', metadata]];
}

const babToTripleWith = curry(babToTriple);
function babToTriple(parentDocument: DocumentNode, bab: Bab): Triple[] {
  const { _key, _judul, isi } = bab;
  const bab_key: BabNode = { _key, parentDocument, _structureType: 'bab' };
  const isi_keys =
    isi._type === 'bagians'
      ? flatMap(isi.bagians, bagianToTripleWith(bab_key))
      : flatMap(isi.pasals, pasalToTripleWith(bab_key));

  return [
    [parentDocument, 'hasBab', bab_key],
    [bab_key, 'hasKey', _key],
    [bab_key, 'hasJudul', _judul],
    ...isi_keys,
  ];
}

const bagianToTripleWith = curry(bagianToTriple);
function bagianToTriple(parentBab: BabNode, bagian: Bagian): Triple[] {
  const { _key, isi } = bagian;
  const bagian_key: BagianNode = { _key, parentBab, _structureType: 'bagian' };
  const isi_keys =
    isi._type === 'paragrafs'
      ? flatMap(isi.paragrafs, paragrafToTripleWith(bagian_key))
      : flatMap(isi.pasals, pasalToTripleWith(parentBab));

  return [[parentBab, 'hasBagian', bagian_key], [bagian_key, 'hasKey', _key], ...isi_keys];
}

const paragrafToTripleWith = curry(paragrafToTriple);
function paragrafToTriple(parentBagian: BagianNode, paragraf: Paragraf): Triple[] {
  const { _key, isi } = paragraf;
  const paragraf_key: ParagrafNode = { _key, parentBagian, _structureType: 'paragraf' };

  return [
    [parentBagian, 'hasParagraf', paragraf_key],
    [paragraf_key, 'hasKey', _key],
    ...flatMap(isi.pasals, pasalToTripleWith(paragraf_key)),
  ];
}

const pasalToTripleWith = curry(pasalToTriple);
function pasalToTriple(parent: PasalParentNode, pasal: Pasal): Triple[] {
  const { _key, isi } = pasal;
  const parentDocumentNode = getPasalParentDocument(parent);
  const pasalNode: PasalNode = {
    _key,
    parentDocumentNode,
    _structureType: 'pasal',
  };

  return [
    [parent, 'hasPasal', pasalNode],
    [pasalNode, 'hasKey', _key],
    ...pasalContentToTriple(pasalNode, isi),
  ];
}

function pasalContentToTriple(pasalNode: PasalNode, isi: IsiPasal): Triple[] {
  switch (isi._type) {
    case 'ayats':
      return isi.ayats.flatMap(ayatToTripleWith(pasalNode));
    case 'points':
      return pointsToTriple(pasalNode, isi);
    case 'referenceText':
      return referencesToTriple(pasalNode, isi.references);
    case 'amenderPoints':
      return amenderPointsToTriple(pasalNode, isi);
  }
}

const ayatToTripleWith = curry(ayatToTriple);
function ayatToTriple(parentPasal: PasalNode, ayat: Ayat): Triple[] {
  const { _key, isi } = ayat;
  const ayatNode: AyatNode = { _key, parentPasal, _structureType: 'ayat' };
  const isiTriples: Triple[] =
    isi._type === 'points'
      ? pointsToTriple(ayatNode, isi)
      : [[ayatNode, 'hasText', isi.text], ...referencesToTriple(ayatNode, isi.references)];
  return [[parentPasal, 'hasAyat', ayatNode], [ayatNode, 'hasKey', _key], ...isiTriples];
}

function amenderPointsToTriple(pointsNode: PointsNode, points: AmenderPoints): Triple[] {
  const { _description, isi, parentDocument } = points;
  return [
    [pointsNode, 'hasDescription', _description.text],
    ...referencesToTriple(pointsNode, _description.references),
    ...isi.flatMap(amendedPointToTripleWith(pointsNode, parentDocument)),
  ];
}

function pointsToTriple(pointsNode: PointsNode, points: Points): Triple[] {
  if (isNil(points)) return [];
  const { _description, isi } = points;
  return [
    [pointsNode, 'hasDescription', _description.text],
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
  switch (point._operation) {
    case 'delete':
      return amenderDeletePointToTriple(pointsNode, point);
    case 'insert':
      return amenderInsertPointToTriple(pointsNode, parentDocument, point);
    case 'update':
      return amenderUpdatePointToTriple(pointsNode, parentDocument, point);
  }
}

function amenderDeletePointToTriple(pointsNode: PointsNode, point: AmenderDeletePoint): Triple[] {
  const { _nomorKey, deletedPasal } = point;
  const node: AmenderDeletePointNode = {
    _structureType: 'amenderPoint',
    _operation: 'delete',
    _key: _nomorKey,
    parentPoints: pointsNode,
  };
  return [[node, 'hasPasal', deletedPasal]];
}

function amenderInsertPointToTriple(
  pointsNode: PointsNode,
  parentDocument: DocumentNode,
  point: AmenderInsertPoint
): Triple[] {
  const { _nomorKey, insertedPasals: amendedPasals, description } = point;
  const node: AmenderInsertPointNode = {
    _structureType: 'amenderPoint',
    _operation: 'insert',
    _key: _nomorKey,
    parentPoints: pointsNode,
  };
  return [
    ...flatMap(amendedPasals, (amendedPasal) =>
      amendedPasalToTriple(node, parentDocument, amendedPasal)
    ),
    [node, 'hasDescription', description.text],
    ...referencesToTriple(node, description.references),
  ];
}

function amenderUpdatePointToTriple(
  pointsNode: PointsNode,
  parentDocument: DocumentNode,
  point: AmenderUpdatePoint
): Triple[] {
  const { _nomorKey, updatedPasal: amendedPasal, description } = point;
  const node: AmenderUpdatePointNode = {
    _structureType: 'amenderPoint',
    _operation: 'update',
    _key: _nomorKey,
    parentPoints: pointsNode,
  };
  return [
    [node, 'hasDescription', description.text],
    ...referencesToTriple(node, description.references),
    ...amendedPasalToTriple(node, parentDocument, amendedPasal),
  ];
}

function amendedPasalToTriple(
  parentPointNode: AmenderUpdatePointNode | AmenderInsertPointNode,
  parentDocumentNode: DocumentNode,
  amendedPasal: AmendedPasal
): Triple[] {
  const { _key } = amendedPasal;
  const node: AmendedPasalNode = {
    _structureType: 'amendedPasal',
    _key,
    parentDocumentNode,
    amendPointNode: parentPointNode,
  };
  return parentPointNode._operation === 'insert'
    ? [[parentPointNode, 'insertedPasal', node]]
    : [[parentPointNode, 'updatedPasal', node]];
}

function pointToTriple(pointsNode: PointsNode, point: Point): Triple[] {
  const { _key, isi } = point;
  const pointNode: PointNode = { _key, parentPoints: pointsNode, _structureType: 'point' };
  const isiTriples: Triple[] =
    isi._type === 'points'
      ? pointsToTriple(pointNode, isi)
      : [[pointNode, 'hasText', isi.text], ...referencesToTriple(pointNode, isi.references)];
  return [[pointsNode, 'hasPoint', pointNode], [pointNode, 'hasKey', _key], ...isiTriples];
}

function referencesToTriple(
  parent: PointsNode | AmenderUpdatePointNode | AmenderInsertPointNode | AmendedPasalNode,
  references: Reference[]
): Triple[] {
  return map(references, ({ node }) => [parent, 'references', node] as Triple);
}

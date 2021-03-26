import {
  AmendedPoint,
  AmendPoints,
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
import { flatten, compact, isNil, curry, flatMap } from 'lodash';
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
  _name,
  _nomor,
  _tahun,
  _pemutus,
  _tentang,
  _salinan,
  _memutuskan,
  _tempatDisahkan,
  _tanggalDisahkan,
  _tempatDitetapkan,
  _tanggalDitetapkan,
  _jabatanPengesah,
  _namaPengesah,
  _tempatDiundangkan,
  _tanggalDiundangkan,
  _sekretaris,
  _denganPersetujuan,
  _dokumen,
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
    ...flatten(babs?.map((b) => babsToTriple(b, _node))),
    [_node, 'penjelasan', penjelasan?.join('\n')],
    [_node, 'name', _name],
    [_node, 'nomor', _nomor],
    [_node, 'tahun', _tahun],
    [_node, 'pemutus', _pemutus],
    [_node, 'tentang', _tentang],
    [_node, 'salinan', _salinan],
    [_node, 'memutuskan', _memutuskan],
    [_node, 'tempatDisahkan', _tempatDisahkan],
    [_node, 'tanggalDisahkan', _tanggalDisahkan],
    [_node, 'tempatDitetapkan', _tempatDitetapkan],
    [_node, 'tanggalDitetapkan', _tanggalDitetapkan],
    [_node, 'jabatanPengesah', _jabatanPengesah],
    [_node, 'namaPengesah', _namaPengesah],
    [_node, 'tempatDiundangkan', _tempatDiundangkan],
    [_node, 'tanggalDiundangkan', _tanggalDiundangkan],
    [_node, 'sekretaris', _sekretaris],
    [_node, 'dokumen', _dokumen],
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

function babsToTriple(bab: Bab, parentDocument: DocumentNode): Triple[] {
  const { _key, _judul, isi } = bab;
  const bab_key: BabNode = { _key, parentDocument, _structureType: 'bab' };
  const isi_keys =
    isi._type === 'bagians'
      ? flatMap(isi.bagians, (b) => bagianToTriple(b, bab_key))
      : flatMap(isi.pasals, (p) => pasalToTriple(p, bab_key));

  return [
    [parentDocument, 'hasBab', bab_key],
    [bab_key, 'hasKey', _key],
    [bab_key, 'hasJudul', _judul],
    ...isi_keys,
  ];
}

function bagianToTriple(bagian: Bagian, parentBab: BabNode): Triple[] {
  const { _key, isi } = bagian;
  const bagian_key: BagianNode = { _key, parentBab, _structureType: 'bagian' };
  const isi_keys =
    isi._type === 'paragrafs'
      ? flatMap(isi.paragrafs, (p) => paragrafToTriple(p, bagian_key))
      : flatMap(isi.pasals, (p) => pasalToTriple(p, parentBab));

  return [[parentBab, 'hasBagian', bagian_key], [bagian_key, 'hasKey', _key], ...isi_keys];
}

function paragrafToTriple(paragraf: Paragraf, parentBagian: BagianNode): Triple[] {
  const { _key, isi } = paragraf;
  const paragraf_key: ParagrafNode = { _key, parentBagian, _structureType: 'paragraf' };

  return [
    [parentBagian, 'hasParagraf', paragraf_key],
    [paragraf_key, 'hasKey', _key],
    ...flatMap(isi.pasals, (p) => pasalToTriple(p, paragraf_key)),
  ];
}

function pasalToTriple(pasal: Pasal, parent: PasalParentNode): Triple[] {
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
      return amendPointsToTriple(pasalNode, isi);
  }
}

const ayatToTripleWith = curry(ayatToTriple);
function ayatToTriple(parentPasal: PasalNode, ayat: Ayat): Triple[] {
  const { _key, isi } = ayat;
  const ayat_key: AyatNode = { _key, parentPasal, _structureType: 'ayat' };

  const isiTriples: Triple[] =
    isi._type === 'points'
      ? pointsToTriple(ayat_key, isi)
      : [[ayat_key, 'hasText', isi.text], ...referencesToTriple(ayat_key, isi.references)];

  return [[parentPasal, 'hasAyat', ayat_key], [ayat_key, 'hasKey', _key], ...isiTriples];
}
function amendPointsToTriple(pointsNode: PointsNode, points: AmendPoints): Triple[] {
  if (isNil(points)) return [];
  const { _description, isi, parentDocument } = points;

  return [
    [pointsNode, 'hasDescription', _description.text],
    ...referencesToTriple(pointsNode, _description.references),
    ...isi.flatMap((i) => amendedPointToTriple(pointsNode, parentDocument, i)),
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
    ...amendedPasalToTriple(node, parentDocument, amendedPasal),
    [node, 'hasDescription', description.text],
    ...referencesToTriple(node, description.references),
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
  return [[parentPointNode, 'hasPasal', node]];
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
  return references.map(({ node }) => [parent, 'references', node]);
}

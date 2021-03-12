// import { IsiPasal } from './../../../legal/structure/pasal';
// import { flatten, compact, isNil, curry } from 'lodash';
// import { Triple } from './triple';
// import { Document, DocumentNode } from '../../../legal/document/index';
// import { Ayat, AyatNode } from '../../../legal/structure/ayat';
// import { Bab, BabNode } from '../../../legal/structure/bab';
// import { isBagians, Bagian, BagianNode } from '../../../legal/structure/bagian';
// import { Metadata, MetadataNode } from '../../../legal/structure/metadata';
// import { isParagrafs, Paragraf, ParagrafNode } from '../../../legal/structure/paragraf';
// import { Points, PointsNode, Point, PointNode } from '../../../legal/structure/point';
// import { Reference } from '../../../legal/reference';
// import {
//   Pasal,
//   PasalParentNode,
//   getPasalParentDocument,
//   PasalNode,
// } from '../../../legal/structure/pasal';
// import assertNever from 'assert-never';

// export function jsonToTriples({
//   _name,
//   _nomor,
//   _tahun,
//   _pemutus,
//   _tentang,
//   _salinan,
//   _memutuskan,
//   _tempatDisahkan,
//   _tanggalDisahkan,
//   _tempatDitetapkan,
//   _tanggalDitetapkan,
//   _jabatanPengesah,
//   _namaPengesah,
//   _tempatDiundangkan,
//   _tanggalDiundangkan,
//   _sekretaris,
//   _denganPersetujuan,
//   _dokumen,
//   _node,
//   penjelasan,
//   mengingat,
//   menimbang,
//   babs,
// }: Document): Triple[] {
//   const denganPersetujuanTriple: Triple[] =
//     _denganPersetujuan?.map((x) => [_node, 'denganPersetujuan', x]) ?? [];
//   const triples: (Triple | undefined)[] = [
//     ...metadataToTriple(_node, 'documentMenimbang', menimbang),
//     ...metadataToTriple(_node, 'documentMengingat', mengingat),
//     ...flatten(babs?.map((b) => babsToTriple(b, _node))),
//     [_node, 'penjelasan', penjelasan?.join('\n')],
//     [_node, 'name', _name],
//     [_node, 'nomor', _nomor],
//     [_node, 'tahun', _tahun],
//     [_node, 'pemutus', _pemutus],
//     [_node, 'tentang', _tentang],
//     [_node, 'salinan', _salinan],
//     [_node, 'memutuskan', _memutuskan],
//     [_node, 'tempatDisahkan', _tempatDisahkan],
//     [_node, 'tanggalDisahkan', _tanggalDisahkan],
//     [_node, 'tempatDitetapkan', _tempatDitetapkan],
//     [_node, 'tanggalDitetapkan', _tanggalDitetapkan],
//     [_node, 'jabatanPengesah', _jabatanPengesah],
//     [_node, 'namaPengesah', _namaPengesah],
//     [_node, 'tempatDiundangkan', _tempatDiundangkan],
//     [_node, 'tanggalDiundangkan', _tanggalDiundangkan],
//     [_node, 'sekretaris', _sekretaris],
//     [_node, 'dokumen', _dokumen],
//     ...denganPersetujuanTriple,
//   ];

//   return compact(triples);
// }

// function metadataToTriple(
//   parentDocument: DocumentNode,
//   metadataType: 'documentMengingat' | 'documentMenimbang',
//   mengimbang?: Metadata
// ): Triple[] {
//   if (isNil(mengimbang)) return [];
//   const metadata: MetadataNode = { metadataType, parentDocument, _structureType: 'metadata' };
//   const { points, text } = mengimbang;
//   const isiTriples: Triple[] = isNil(points)
//     ? [[metadata, 'hasText', text.text]]
//     : pointsToTriple(metadata, points);

//   return [...isiTriples, [parentDocument, 'hasMetadata', metadata]];
// }

// function babsToTriple(bab: Bab, parentDocument: DocumentNode): Triple[] {
//   const { _key, _judul, isi } = bab;
//   const bab_key: BabNode = { _key, parentDocument, _structureType: 'bab' };
//   const isi_keys = isBagians(isi)
//     ? isi.flatMap((b) => bagianToTriple(b, bab_key))
//     : isi.flatMap((p) => pasalToTriple(p, bab_key));

//   return [
//     [parentDocument, 'hasBab', bab_key],
//     [bab_key, 'hasKey', _key],
//     [bab_key, 'hasJudul', _judul],
//     ...isi_keys,
//   ];
// }

// function bagianToTriple(bagian: Bagian, parentBab: BabNode): Triple[] {
//   const { _key, isi } = bagian;
//   const bagian_key: BagianNode = { _key, parentBab, _structureType: 'bagian' };
//   const isi_keys = isParagrafs(isi)
//     ? isi.flatMap((p) => paragrafToTriple(p, bagian_key))
//     : isi.flatMap((p) => pasalToTriple(p, parentBab));

//   return [[parentBab, 'hasBagian', bagian_key], [bagian_key, 'hasKey', _key], ...isi_keys];
// }

// function paragrafToTriple(paragraf: Paragraf, parentBagian: BagianNode): Triple[] {
//   const { _key, isi } = paragraf;
//   const paragraf_key: ParagrafNode = { _key, parentBagian, _structureType: 'paragraf' };

//   return [
//     [parentBagian, 'hasParagraf', paragraf_key],
//     [paragraf_key, 'hasKey', _key],
//     ...isi.flatMap((p) => pasalToTriple(p, paragraf_key)),
//   ];
// }

// function pasalToTriple(pasal: Pasal, parent: PasalParentNode): Triple[] {
//   const { _key, isi } = pasal;
//   const parentDocument = getPasalParentDocument(parent);
//   const pasal_key: PasalNode = { _key, parentDocument, _structureType: 'pasal' };

//   return [
//     [parent, 'hasPasal', pasal_key],
//     [pasal_key, 'hasKey', _key],
//     ...pasalContentToTriple(pasal_key, isi),
//   ];
// }

// function pasalContentToTriple(pasal_key: PasalNode, isi: IsiPasal): Triple[] {
//   if (isi._type === 'ayats') return isi.ayats.flatMap(ayatToTripleWith(pasal_key));
//   if (isi._type === 'points') return pointsToTriple(pasal_key, isi);
//   if (isi._type === 'referenceText') return referencesToTriple(pasal_key, isi.references);
//   if (isi._type === 'amendPoints') return tripleOfAmendPoints(pasal_key, isi);
//   assertNever(isi);
// }

// function tripleOfAmendPoints(_pasal_key: PasalNode, _isi: IsiPasal): Triple[] {
//   return [];
// }

// const ayatToTripleWith = curry(ayatToTriple);
// function ayatToTriple(parentPasal: PasalNode, ayat: Ayat): Triple[] {
//   const { _key, text, isi } = ayat;
//   const ayat_key: AyatNode = { _key, parentPasal, _structureType: 'ayat' };

//   return [
//     [parentPasal, 'hasAyat', ayat_key],
//     [ayat_key, 'hasKey', _key],
//     [ayat_key, 'hasText', text.text],
//     ...referencesToTriple(ayat_key, text.references),
//     ...pointsToTriple(ayat_key, isi),
//   ];
// }
// function pointsToTriple(points_key: PointsNode, points: Points | undefined): Triple[] {
//   if (isNil(points)) return [];
//   const { _description, text, isi } = points;

//   return [
//     [points_key, 'hasDescription', _description.text],
//     [points_key, 'hasText', text],
//     ...referencesToTriple(points_key, _description.references),
//     ...isi.flatMap((i) => pointToTriple(points_key, i)),
//   ];
// }

// function pointToTriple(points_key: PointsNode, point: Point): Triple[] {
//   const { _key, isi, text } = point;
//   const point_key: PointNode = { _key, parentPoints: points_key, _structureType: 'point' };
//   const isiTriples: Triple[] = isNil(isi)
//     ? [[point_key, 'hasText', text.text]]
//     : pointsToTriple(point_key, isi);

//   return [
//     [points_key, 'hasPoint', point_key],
//     [point_key, 'hasKey', _key],
//     ...referencesToTriple(point_key, text.references),
//     ...isiTriples,
//   ];
// }

// // function pointContentToTriple(pointNode: PointNode, isi: Points | UpdateAmend): Triple[] {
// //   if (isi._type === 'updateAmend') return updateAmendToTriple(pointNode, isi);
// //   if (isi._type === 'points') return pointsToTriple(pointNode, isi);
// //   assertNever(isi);
// // }

// // function updateAmendToTriple(_: PointNode, __: UpdateAmend): Triple[] {
// //   return [];
// // }

// function referencesToTriple(parent: PointsNode, references: Reference[]): Triple[] {
//   return references.map(({ node: _key }) => [parent, 'references', _key]);
// }

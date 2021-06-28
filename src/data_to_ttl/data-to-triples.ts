import {
  PasalDeleteAmenderPoint,
  Point,
  PointNode,
  PointSet,
  PointSetNode,
  PasalUpdateAmenderPoint,
  PasalInsertAmenderPoint,
  PasalVersion,
  MenimbangNode,
  MengingatNode,
  Mengingat,
  Menimbang,
} from '../component';
import assertNever from 'assert-never';
import { flatMap, curry, map, chain, isUndefined, compact } from 'lodash';
import {
  Bab,
  BabNode,
  Bagian,
  BagianNode,
  Paragraf,
  ParagrafNode,
  Pasal,
  Ayat,
  Text,
  AyatSet,
  Reference,
  BagianSet,
  ParagrafSet,
  ParagrafSetNode,
  PasalSet,
  PasalSetNode,
  PasalVersionNode,
  AyatNode,
  SegmentNode,
  Document,
} from '../component';

import { LegalTriple } from './triple';
import { DocumentNode } from '../document';
import { LegislationTypeNode } from '../legislation_type';

export function yamlToTriples({
  node,
  content,
  disahkan,
  metadata: { mengingat, menimbang, tentang },
}: Document): LegalTriple[] {
  const contentTriples: LegalTriple[] =
    content.type === 'babSet'
      ? [[node, 'daftarBab', content.node], ...flatMap(content.elements, babToTriple)]
      : daftarPasalToTriple(node, content);
  return compact([
    ...contentTriples,
    [node, 'disahkanPada', disahkan.date],
    [node, 'jenisPeraturan', getLegislationTypeNode({ node })],
    tentang ? [node, 'tentang', tentang] : undefined,
    ...mengingatToTriple(mengingat),
    ...menimbangToTriple(menimbang),
    disahkan.pengesah ? [node, 'disahkanOleh', disahkan.pengesah] : undefined,
    disahkan.location ? [node, 'disahkanDi', disahkan.location] : undefined,
    disahkan.jabatanPengesah ? [node, 'jabatanPengesah', disahkan.jabatanPengesah] : undefined,
    node.docType === 'noTahun' ? [node, 'tahun', node.tahun] : undefined,
    node.docType === 'noTahun' ? [node, 'nomor', node.nomor] : undefined,
    [node, 'bahasa', 'id'],
    [node, 'yurisdiksi', getLegislationJurisdiction({ node })],
  ]);
}

function getLegislationJurisdiction({ node }: { node: DocumentNode }): string {
  if (node.docType === 'uud') return 'Indonesia';
  if (node.docType === 'noTahun') {
    if (node.docCategory === 'perda_provinsi_dki_jakarta') return 'DKI Jakarta';
    if (node.docCategory === 'pergub_dki_jakarta') return 'DKI Jakarta';
    if (node.docCategory === 'perwali_malang') return 'Kota Malang';
    if (node.docCategory === 'uu') return 'Indonesia';
    if (node.docCategory === 'pp') return 'Indonesia';
    assertNever(node.docCategory);
  }
  assertNever(node);
}

function getLegislationTypeNode({ node }: { node: DocumentNode }): LegislationTypeNode {
  if (node.docType === 'uud') return { nodeType: 'legislationType', legislationType: 'UUD' };
  if (node.docType === 'noTahun') {
    if (node.docCategory === 'perda_provinsi_dki_jakarta')
      return { nodeType: 'legislationType', legislationType: 'PerdaProvinsi' };
    if (node.docCategory === 'pergub_dki_jakarta')
      return { nodeType: 'legislationType', legislationType: 'PeraturanGubernur' };
    if (node.docCategory === 'perwali_malang')
      return { nodeType: 'legislationType', legislationType: 'PeraturanBupatiWalikota' };
    if (node.docCategory === 'uu') return { nodeType: 'legislationType', legislationType: 'UU' };
    if (node.docCategory === 'pp') return { nodeType: 'legislationType', legislationType: 'PP' };
    assertNever(node.docCategory);
  }
  assertNever(node);
}

function mengingatToTriple(mengingat?: Mengingat): LegalTriple[] {
  if (isUndefined(mengingat)) return [];
  return [
    [mengingat.node.parentNode, 'mengingat', mengingat.node],
    ...(mengingat.content.type === 'daftarHuruf'
      ? daftarHurufToTriple(mengingat.content)
      : textToTriple(mengingat.content)),
  ];
}

function menimbangToTriple(menimbang?: Menimbang): LegalTriple[] {
  if (isUndefined(menimbang)) return [];
  return [
    [menimbang.node.parentNode, 'menimbang', menimbang.node],
    ...(menimbang.content.type === 'daftarHuruf'
      ? daftarHurufToTriple(menimbang.content)
      : textToTriple(menimbang.content)),
  ];
}

function babToTriple(bab: Bab): LegalTriple[] {
  return [
    [bab.node.parentBabSetNode, 'bab', bab.node],
    [bab.node, 'nomor', bab.node.key],
    [bab.node, 'judul', bab.title],
    ...(bab.content.type === 'daftarBagian'
      ? daftarBagianToTriple(bab.node, bab.content)
      : daftarPasalToTriple(bab.node, bab.content)),
  ];
}

function daftarBagianToTriple(parentBabNode: BabNode, daftarBagian: BagianSet): LegalTriple[] {
  return [
    [parentBabNode, 'daftarBagian', daftarBagian.node],
    ...flatMap(daftarBagian.elements, bagianToTriple),
  ];
}

function bagianToTriple(bagian: Bagian): LegalTriple[] {
  return [
    [bagian.node.parentBagianSetNode, 'bagian', bagian.node],
    [bagian.node, 'nomor', bagian.node.key],
    [bagian.node, 'judul', bagian.title],
    ...(bagian.content.type === 'daftarParagraf'
      ? daftarParagrafToTriple(bagian.node, bagian.content)
      : daftarPasalToTriple(bagian.node, bagian.content)),
  ];
}

function daftarParagrafToTriple(
  parentBagianNode: BagianNode,
  daftarParagraf: ParagrafSet
): LegalTriple[] {
  const daftarParagrafNode: ParagrafSetNode = { nodeType: 'daftarParagraf', parentBagianNode };
  return [
    [parentBagianNode, 'daftarParagraf', daftarParagrafNode],
    ...flatMap(daftarParagraf.elements, paragrafToTriple),
  ];
}

function paragrafToTriple(paragraf: Paragraf): LegalTriple[] {
  return [
    [paragraf.node.parentParagrafSetNode, 'paragraf', paragraf.node],
    [paragraf.node, 'nomor', paragraf.node.key],
    [paragraf.node, 'judul', paragraf.title],
    ...daftarPasalToTriple(paragraf.node, paragraf.daftarPasal),
  ];
}

function daftarPasalToTriple(
  parentNode: DocumentNode | BabNode | BagianNode | ParagrafNode,
  daftarPasal: PasalSet
): LegalTriple[] {
  const daftarPasalNode: PasalSetNode = { nodeType: 'daftarPasal', parentNode };
  return [
    _daftarPasalToTriple(parentNode, daftarPasalNode),
    ...flatMap(daftarPasal.elements, pasalToTripleWith(daftarPasalNode)),
  ];
}

function _daftarPasalToTriple(
  parentNode: DocumentNode | BabNode | BagianNode | ParagrafNode,
  daftarPasalNode: PasalSetNode
): LegalTriple {
  if (parentNode.nodeType === 'bab') return [parentNode, 'daftarPasal', daftarPasalNode];
  if (parentNode.nodeType === 'bagian') return [parentNode, 'daftarPasal', daftarPasalNode];
  if (parentNode.nodeType === 'paragraf') return [parentNode, 'daftarPasal', daftarPasalNode];
  if (parentNode.nodeType === 'peraturan') return [parentNode, 'daftarPasal', daftarPasalNode];
  assertNever(parentNode);
}

const pasalToTripleWith = curry(pasalToTriple);
function pasalToTriple(parentPasalSetNode: PasalSetNode, pasal: Pasal): LegalTriple[] {
  return [
    [parentPasalSetNode, 'pasal', pasal.node],
    [pasal.node, 'nomor', pasal.node.key],
    [pasal.node, 'versi', pasal.version.node],
    [pasal.node.parentNode, 'pasal', pasal.node],
    ...pasalVersionToTriple(pasal.version),
  ];
}

function pasalVersionToTriple(pasalVersion: PasalVersion): LegalTriple[] {
  return [
    [pasalVersion.node, 'jenisVersi', pasalVersion.node.state],
    [pasalVersion.node, 'tanggal', pasalVersion.node.version],
    [pasalVersion.node, 'teks', componentToRawText(pasalVersion)],
    ...pasalVersionContentToTriple(pasalVersion.content),
  ];
}

function componentToRawText(
  comp:
    | PasalVersion
    | PointSet
    | Text
    | AyatSet
    | Point
    | PasalDeleteAmenderPoint
    | PasalUpdateAmenderPoint
    | PasalInsertAmenderPoint
    | undefined
): string {
  if (isUndefined(comp)) return '';
  if (comp.type === 'pasalVersion') return componentToRawText(comp.content);
  if (comp.type === 'text') return comp.textString;
  if (comp.type === 'ayatSet') {
    return comp.elements
      .map((ayat) => `(${ayat.node.key}). ${componentToRawText(ayat.content)}`)
      .join('\n');
  }
  if (comp.type === 'daftarHuruf') {
    const content = comp.elements.map((point) => componentToRawText(point)).join('\n');
    return `${componentToRawText(comp.description)}\n${content}\n`;
  }
  if (comp.type === 'point') {
    return `${comp.node.key}. ${componentToRawText(comp.content)}`;
  }
  if (comp.type === 'pasalDeleteAmenderPoint') {
    return `${comp.node.key}. Pasal ${comp.deletedPasalVersion.node.parentPasalNode.key} dihapus.`;
  }
  if (comp.type === 'pasalInsertAmenderPoint') {
    const content = chain(comp.insertedPasalVersionArr).map(componentToRawText).join('\n').value();
    return `${comp.node.key}. ${componentToRawText(comp.description)}\n${content}`;
  }
  if (comp.type === 'pasalUpdateAmenderPoint') {
    return `${comp.node.key}. ${componentToRawText(comp.description)}\n${componentToRawText(
      comp.updatedPasalVersion
    )}`;
  }
  assertNever(comp);
}

function pasalVersionContentToTriple(
  content: PointSet | Text | AyatSet | undefined
): LegalTriple[] {
  if (isUndefined(content)) return [];
  if (content.type === 'daftarHuruf') return daftarHurufToTriple(content);
  if (content.type === 'ayatSet') return ayatSetToTriple(content);
  if (content.type === 'text') return textToTriple(content);
  assertNever(content);
}

function ayatSetToTriple(ayatSet: AyatSet): LegalTriple[] {
  return [
    [ayatSet.node.parentPasalVersionNode, 'daftarAyat', ayatSet.node],
    ...flatMap(ayatSet.elements, ayatToTriple),
  ];
}

function ayatToTriple(ayat: Ayat): LegalTriple[] {
  return [
    [ayat.node.parentAyatSetNode, 'ayat', ayat.node],
    [ayat.node, 'nomor', ayat.node.key],
    [ayat.node, 'teks', componentToRawText(ayat.content)],
    ...(ayat.content.type === 'daftarHuruf'
      ? daftarHurufToTriple(ayat.content)
      : textToTriple(ayat.content)),
  ];
}

// TODO: make all to triple in one function

function daftarHurufToTriple(daftarHuruf: PointSet): LegalTriple[] {
  return [
    _daftarHurufToTriple(daftarHuruf.node.parentNode, daftarHuruf.node),
    ...textToTriple(daftarHuruf.description),
    ...flatMap(daftarHuruf.elements, pointToTriple),
  ];
}

function _daftarHurufToTriple(
  parentNode: PointNode | AyatNode | PasalVersionNode | MenimbangNode | MengingatNode,
  daftarHurufNode: PointSetNode
): LegalTriple {
  if (parentNode.nodeType === 'ayat') return [parentNode, 'daftarHuruf', daftarHurufNode];
  if (parentNode.nodeType === 'versiPasal') return [parentNode, 'daftarHuruf', daftarHurufNode];
  if (parentNode.nodeType === 'huruf') return [parentNode, 'daftarHuruf', daftarHurufNode];
  if (parentNode.nodeType === 'menimbang') return [parentNode, 'daftarHuruf', daftarHurufNode];
  if (parentNode.nodeType === 'mengingat') return [parentNode, 'daftarHuruf', daftarHurufNode];
  assertNever(parentNode);
}

function pointToTriple(
  point: Point | PasalDeleteAmenderPoint | PasalUpdateAmenderPoint | PasalInsertAmenderPoint
): LegalTriple[] {
  return [
    [point.node.parentPointSetNode, 'huruf', point.node],
    [point.node, 'nomor', point.node.key],
    ..._pointToTriple(point),
  ];
}

// TODO: origin component relation

function _pointToTriple(
  point: Point | PasalDeleteAmenderPoint | PasalUpdateAmenderPoint | PasalInsertAmenderPoint
): LegalTriple[] {
  if (point.type === 'pasalDeleteAmenderPoint')
    return [
      [point.node, 'menghapus', point.deletedPasalVersion.node],
      [point.deletedPasalVersion.node.parentPasalNode, 'versi', point.deletedPasalVersion.node],
      [
        point.deletedPasalVersion.node.parentPasalNode.parentNode,
        'pasal',
        point.deletedPasalVersion.node.parentPasalNode,
      ],
      ...pasalVersionToTriple(point.deletedPasalVersion),
    ];
  if (point.type === 'pasalUpdateAmenderPoint')
    return [
      [point.node, 'mengubah', point.updatedPasalVersion.node],
      [point.updatedPasalVersion.node.parentPasalNode, 'versi', point.updatedPasalVersion.node],
      [
        point.updatedPasalVersion.node.parentPasalNode.parentNode,
        'pasal',
        point.updatedPasalVersion.node.parentPasalNode,
      ],
      ...pasalVersionToTriple(point.updatedPasalVersion),
    ];
  if (point.type === 'pasalInsertAmenderPoint')
    return flatMap(point.insertedPasalVersionArr, pointToAmendInsertTripleWith(point));
  if (point.type === 'point')
    return point.content.type === 'daftarHuruf'
      ? daftarHurufToTriple(point.content)
      : textToTriple(point.content);
  assertNever(point);
}

const pointToAmendInsertTripleWith = curry(pointToAmendInsertTriple);
function pointToAmendInsertTriple(
  point: PasalInsertAmenderPoint,
  pasalVersion: PasalVersion
): LegalTriple[] {
  return [
    [point.node, 'menyisipkan', pasalVersion.node],
    [pasalVersion.node.parentPasalNode, 'versi', pasalVersion.node],
    [pasalVersion.node.parentPasalNode.parentNode, 'pasal', pasalVersion.node.parentPasalNode],
    ...pasalVersionToTriple(pasalVersion),
  ];
}

// TODO: rawText

function textToTriple(text: Text): LegalTriple[] {
  return [
    [text.node, 'teks', text.textString],
    _textToTriple(text.node.parentNode, text.node),
    ...map(text.references, referenceToTripleWith(text.node)),
  ];
}

function _textToTriple(
  parentNode:
    | PointSetNode
    | PointNode
    | PasalVersionNode
    | AyatNode
    | MenimbangNode
    | MengingatNode,
  textNode: SegmentNode
): LegalTriple {
  if (parentNode.nodeType === 'ayat') return [parentNode, 'segmen', textNode];
  if (parentNode.nodeType === 'versiPasal') return [parentNode, 'segmen', textNode];
  if (parentNode.nodeType === 'huruf') return [parentNode, 'segmen', textNode];
  if (parentNode.nodeType === 'daftarHuruf') return [parentNode, 'segmen', textNode];
  if (parentNode.nodeType === 'menimbang') return [parentNode, 'segmen', textNode];
  if (parentNode.nodeType === 'mengingat') return [parentNode, 'segmen', textNode];
  assertNever(parentNode);
}

const referenceToTripleWith = curry(referenceToTriple);
function referenceToTriple(textNode: SegmentNode, reference: Reference): LegalTriple {
  return [textNode, 'merujuk', reference.node];
}

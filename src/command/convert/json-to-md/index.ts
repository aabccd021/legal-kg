import { IsiPasal } from './../../../legal/structure/pasal';
import { assertNever } from 'assert-never';
import { map, flatten, compact, isNil, repeat } from 'lodash';
import { toRoman } from 'roman-numerals';
import { getDocumentName, _getDocumentUri, DocumentNode } from '../../../legal/document';
import * as fs from 'fs';
import { getLegalUri } from '../../../legal';
import { Ayat, AyatNode } from '../../../legal/structure/ayat';
import { Bab, BabNode } from '../../../legal/structure/bab';
import { Bagian, BagianNode, isBagians } from '../../../legal/structure/bagian';
import { Metadata, MetadataNode } from '../../../legal/structure/metadata';
import { Paragraf, ParagrafNode } from '../../../legal/structure/paragraf';
import {
  PasalParentNode,
  PasalNode,
  getPasalParentDocument,
  isPasals,
  Pasal,
} from '../../../legal/structure/pasal';
import { Point, PointNode, Points } from '../../../legal/structure/point';
import { ReferenceText } from '../../../legal/reference';
import { Document } from '../../../legal/document/index';
import { getDocumentData, getDocumentFilePath } from '../../../data';
import {
  AmendDeletePasalPoint,
  AmendedPoint,
  AmendInsertPasalPoint,
  AmendPoints,
  AmendUpdatePasalPoint,
} from '../../../legal/structure/amend';

type Option = { overwrite: boolean };
export function jsonToMd(option: Option): void {
  const jsonNodes = getDocumentData('json');
  jsonNodes.forEach((jsonNode) => handleJson(jsonNode, option));
}

function handleJson(jsonNode: DocumentNode, option: Option): void {
  const { overwrite } = option;
  const jsonFile = getDocumentFilePath(jsonNode, 'jsonv2');
  const { path: mdPath, exists: mdExists } = getDocumentFilePath(jsonNode, 'md');

  try {
    if (!overwrite && mdExists) {
      console.log(`Skipped json-to-md ${mdPath}`);
      return;
    }

    const jsonString = fs.readFileSync(jsonFile.path).toString();
    const json = JSON.parse(jsonString) as Document;
    const md = _jsonToMd(json);

    fs.writeFileSync(mdPath, md);

    console.log(`Finished json-to-md ${mdPath}`);
  } catch {
    console.log(`Error json-to-md ${mdPath}`);
  }
}

function _jsonToMd(doc: Document): string {
  const {
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
    mengingat,
    menimbang,
    _node,
    babs,
  } = doc;
  const uri = _getDocumentUri(_node);
  const name = getDocumentName(_node);
  const lines: (string | undefined)[] = [
    `# [${name}](${uri})`,
    `\n| Nama | Data |`,
    `| ------ | ----- |`,
    metadata('Name', _name),
    metadata('Nomor', _nomor),
    metadata('Tahun', _tahun),
    metadata('Pemutus', _pemutus),
    metadata('Tentang', _tentang),
    metadata('Salinan', _salinan),
    metadata('Memutuskan', _memutuskan),
    metadata('Tempat Disahkan', _tempatDisahkan),
    metadata('Tanggal Disahkan', _tanggalDisahkan),
    metadata('Tempat Ditetapkan', _tempatDitetapkan),
    metadata('Tanggal Ditetapkan', _tanggalDitetapkan),
    metadata('Jabatan Pengesah', _jabatanPengesah),
    metadata('Nama Pengesah', _namaPengesah),
    metadata('Tempat Diundangkan', _tempatDiundangkan),
    metadata('Tanggal Diundangkan', _tanggalDiundangkan),
    metadata('Sekretaris', _sekretaris),
    metadata('Dokumen', _dokumen),
    ...map(_denganPersetujuan, (d) => metadata('Dengan Persetujuan', d)),
    mengimbangToMd('Menimbang', menimbang, 'documentMenimbang', _node),
    mengimbangToMd('Mengingat', mengingat, 'documentMengingat', _node),
    ...flatten(babs?.map((b) => babToMd(b, _node))),
  ];

  return compact(lines).join('\n');
}

function mengimbangToMd(
  title: string,
  isi: Metadata | undefined,
  metadataType: 'documentMengingat' | 'documentMenimbang',
  parentDocument: DocumentNode
): string {
  if (isNil(isi)) return '';
  const { points, text } = isi;
  const metadataNode: MetadataNode = { metadataType, parentDocument, _structureType: 'metadata' };
  const isiStr = !isNil(points) ? pointsToMd(points, metadataNode) : referenceToMd(text);
  const uri = getLegalUri(metadataNode);

  return `\n# [${title}](${uri})\n${isiStr}`;
}

function babToMd(bab: Bab, parentDocument: DocumentNode): string {
  const { _key, _judul, isi } = bab;
  const babNode: BabNode = { _key, parentDocument, _structureType: 'bab' };
  const isiStr: string = isiBabToMd(isi, babNode);
  const romanKey = toRoman(_key);
  const babUri = getLegalUri(babNode);

  return `\n# [BAB ${romanKey}: ${_judul}](${babUri})\n${isiStr} \n`;
}

function isiBabToMd(isi: Bagian[] | Pasal[], babNode: BabNode): string {
  if (isPasals(isi)) return isi.map((p) => pasalToMd(p, babNode)).join('\n');
  if (isBagians(isi)) return isi.map((b) => bagianToMd(b, babNode)).join('\n');
  assertNever(isi);
}

function bagianToMd(bagian: Bagian, parentBab: BabNode): string {
  const { _key, isi } = bagian;
  const bagianNode: BagianNode = { _key, parentBab, _structureType: 'bagian' };
  const isiStr = isPasals(isi)
    ? isi.map((p) => pasalToMd(p, parentBab))
    : isi.map((p) => paragrafToMd(p, bagianNode));
  const uri = getLegalUri(bagianNode);

  return `\n## [Bagian ${_key}](${uri})\n${isiStr}\n`;
}

function paragrafToMd(paragraf: Paragraf, parentBagian: BagianNode): string {
  const { _key, isi } = paragraf;
  const paragrafNode: ParagrafNode = { _key, parentBagian, _structureType: 'paragraf' };
  const isiStr = isi.map((p) => pasalToMd(p, parentBagian));
  const uri = getLegalUri(paragrafNode);

  return `\n## [Paragraf ${_key}](${uri})\n${isiStr}\n`;
}

function pasalToMd(pasal: Pasal, pasalParent: PasalParentNode): string {
  const { _key, isi } = pasal;
  const parentDocument = getPasalParentDocument(pasalParent);
  const pasalNode: PasalNode = { _key, parentDocument, _structureType: 'pasal' };
  const isiStr: string = pasalContentToMd(isi, pasalNode);
  const uri = getLegalUri(pasalNode);

  return `\n### [Pasal ${_key}](${uri})\n${isiStr}\n`;
}

function pasalContentToMd(isi: IsiPasal, pasalNode: PasalNode): string {
  if (isi._type === 'ayats') return isi.ayats.map((a) => ayatToMd(a, pasalNode)).join('\n');
  if (isi._type === 'points') return pointsToMd(isi, pasalNode);
  if (isi._type === 'referenceText') return referenceToMd(isi);
  if (isi._type === 'amendPoints') return amendPointsToMd(isi);
  assertNever(isi);
}

function amendPointsToMd(amendPoints: AmendPoints): string {
  const { description, isi } = amendPoints;
  const isiMd = isi.map(amendPointToMd).join('\n');
  return `${description}\n${isiMd}`;
}

function amendPointToMd(amendPoint: AmendedPoint): string {
  if (amendPoint._operation === 'delete') return amendDeletePasalPointToMd(amendPoint);
  if (amendPoint._operation === 'update') return amendUpdatePasalPointToMd(amendPoint);
  if (amendPoint._operation === 'insert') return amendInsertPasalPointToMd(amendPoint);
  assertNever(amendPoint);
}

function amendDeletePasalPointToMd(amendPoint: AmendDeletePasalPoint): string {
  return amendPoint.isi.text;
}
function amendUpdatePasalPointToMd(amendPoint: AmendUpdatePasalPoint): string {
  return amendPoint.isi.text;
}
function amendInsertPasalPointToMd(amendPoint: AmendInsertPasalPoint): string {
  return amendPoint.isi.text;
}

function ayatToMd(ayat: Ayat, parentPasal: PasalNode): string {
  const { _key, isi, text } = ayat;
  const ayatNode: AyatNode = { _key, parentPasal, _structureType: 'ayat' };
  const isiStr = !isNil(isi) ? pointsToMd(isi, ayatNode) : referenceToMd(text);
  const uri = getLegalUri(ayatNode);

  return `\n#### [Ayat (${_key})](${uri})\n${isiStr}`;
}

function pointsToMd(
  points: Points,
  parent: PointNode | AyatNode | PasalNode | MetadataNode,
  depth = 0
): string {
  const { _description, isi } = points;
  const isiStr = isi.map((x) => pointToMd(x, parent, depth)).join('\n');
  const description = referenceToMd(_description);

  return `${description}\n${isiStr}`;
}

// function updateAmendToMd(_: UpdateAmend, __: PointNode): string {
//   return '';
// }

function pointToMd(
  point: Point,
  parent: PointNode | AyatNode | PasalNode | MetadataNode,
  depth: number
): string {
  const { isi, _key, text } = point;
  const pointNode: PointNode = { _key, parentPoints: parent, _structureType: 'point' };
  const isiStr = !isNil(isi) ? pointsToMd(isi, pointNode, depth + 1) : referenceToMd(text);
  const indent = repeat(' ', depth * 4);
  const uri = getLegalUri(pointNode);

  return `${indent}* [${_key}.](${uri}) ${isiStr}`;
}

function metadata(key: string, value: string | number | undefined): string | undefined {
  if (isNil(value)) return undefined;

  return `|${key}|${value}|`;
}

function splitAt(slicable: string, indices: number[]): string[] {
  return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
}

function referenceToMd(ref: ReferenceText): string {
  const { references, text } = ref;
  const sortedReferences = references.sort((a, b) => a.start - b.start);
  const indices = sortedReferences.flatMap(({ start, end }) => [start, end]);
  const uris = sortedReferences.map(({ node }) => getLegalUri(node));
  const splitted = splitAt(text, indices);

  return splitted.map((text, index) => `${getPrefixByIndex(index, uris)}${text}`).join('');
}

function getPrefixByIndex(index: number, uris: string[]): string {
  if (index === 0) return '';
  if (index % 2 === 1) return '[';
  const uriIndex = index / 2 - 1;
  const uri = uris[uriIndex];

  return `](${uri})`;
}

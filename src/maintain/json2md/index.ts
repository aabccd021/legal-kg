import { getPasalParentDocument, PasalParentNode } from './../../uri/document-structure';
import { assertNever } from 'assert-never';
import { map, flatten, compact, isNil, repeat, isArray } from 'lodash';
import { toRoman } from 'roman-numerals';
import {
  Document,
  Mengimbang,
  Bab,
  Bagian,
  Pasal,
  isPasals,
  isBagians,
  Paragraf,
  Points,
  Ayat,
  isAyats,
  Point,
  ReferenceText,
} from '../../type';
import {
  MetadataNode,
  getMetadataUri,
  getBabUri,
  BabNode,
  BagianNode,
  getBagianUri,
  ParagrafNode,
  getParagrafUri,
  PasalNode,
  getPasalUri,
  AyatNode,
  getAyatUri,
  PointNode,
  getPointUri,
} from '../../uri/document-structure';
import { getDocumentName, getDocumentUri, DocumentNode } from '../../uri/document-type';
import { DataDir, getDocumentData, getDocFilePath } from '../utils';
import * as fs from 'fs';
import { getLegalUri } from '../../uri';

function json2md(): void {
  const dataDir = 'maintained_documents';
  const jsonDir: DataDir = { dir: dataDir, dataType: 'json' };
  const mdDir: DataDir = { dir: dataDir, dataType: 'md' };

  const datas = getDocumentData(jsonDir);
  datas.forEach((data) => {
    const jsonPath = getDocFilePath(data, jsonDir);
    const mdPath = getDocFilePath(data, mdDir);

    const jsonString = fs.readFileSync(jsonPath).toString();
    const json = JSON.parse(jsonString) as Document;
    const md = _json2md(json);

    fs.writeFileSync(mdPath, md);

    console.log(`Finished json2md ${mdPath}`);
  });
}

function _json2md(doc: Document): string {
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
  const uri = getDocumentUri(_node);
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
    mengimbang2md('Menimbang', menimbang, 'documentMenimbang', _node),
    mengimbang2md('Mengingat', mengingat, 'documentMengingat', _node),
    ...flatten(babs?.map((b) => bab2md(b, _node))),
  ];

  return compact(lines).join('\n');
}

function mengimbang2md(
  title: string,
  isi: Mengimbang | undefined,
  metadataType: 'documentMengingat' | 'documentMenimbang',
  parentDocument: DocumentNode
): string {
  if (isNil(isi)) return '';
  const { points, text } = isi;
  const metadataNode: MetadataNode = { metadataType, parentDocument, _structureType: 'metadata' };
  const isiStr = !isNil(points) ? points2md(points, metadataNode) : reference2md(text);
  const uri = getMetadataUri(metadataNode);

  return `\n# [${title}](${uri})\n${isiStr}`;
}

function bab2md(bab: Bab, parentDocument: DocumentNode): string {
  const { _key, _judul, isi, text } = bab;
  const babNode: BabNode = { _key, parentDocument, _structureType: 'bab' };
  const isiStr: string = !isNil(isi) ? isiBab2md(isi, babNode) : text;
  const romanKey = toRoman(_key);
  const babUri = getBabUri(babNode);

  return `\n# [BAB ${romanKey}: ${_judul}](${babUri})\n${isiStr} \n`;
}

function isiBab2md(isi: Bagian[] | Pasal[], babNode: BabNode): string {
  if (isPasals(isi)) return isi.map((p) => pasal2md(p, babNode)).join('\n');
  if (isBagians(isi)) return isi.map((b) => bagian2md(b, babNode)).join('\n');
  assertNever(isi);
}

function bagian2md(bagian: Bagian, parentBab: BabNode): string {
  const { _key, isi } = bagian;
  const bagianNode: BagianNode = { _key, parentBab, _structureType: 'bagian' };
  const isiStr = isPasals(isi)
    ? isi.map((p) => pasal2md(p, parentBab))
    : isi.map((p) => paragraf2md(p, bagianNode));
  const uri = getBagianUri(bagianNode);

  return `\n## [Bagian ${_key}](${uri})\n${isiStr}\n`;
}

function paragraf2md(paragraf: Paragraf, parentBagian: BagianNode): string {
  const { _key, isi } = paragraf;
  const paragrafNode: ParagrafNode = { _key, parentBagian, _structureType: 'paragraf' };
  const isiStr = isi.map((p) => pasal2md(p, parentBagian));
  const uri = getParagrafUri(paragrafNode);

  return `\n## [Paragraf ${_key}](${uri})\n${isiStr}\n`;
}

function pasal2md(pasal: Pasal, pasalParent: PasalParentNode): string {
  const { _key, isi, text } = pasal;
  const parentDocument = getPasalParentDocument(pasalParent);
  const pasalNode: PasalNode = { _key, parentDocument, _structureType: 'pasal' };
  const isiStr: string = !isNil(isi) ? pasalContent2md(isi, pasalNode) : reference2md(text);
  const uri = getPasalUri(pasalNode);

  return `\n### [Pasal ${_key}](${uri})\n${isiStr}\n`;
}

function pasalContent2md(isi: Points | Ayat[], pasalNode: PasalNode): string {
  if (isArray(isi) && isAyats(isi)) return isi.map((a) => ayat2md(a, pasalNode)).join('\n');

  return points2md(isi, pasalNode);
}

function ayat2md(ayat: Ayat, parentPasal: PasalNode): string {
  const { _key, isi, text } = ayat;
  const ayatNode: AyatNode = { _key, parentPasal, _structureType: 'ayat' };
  const isiStr = !isNil(isi) ? points2md(isi, ayatNode) : reference2md(text);
  const uri = getAyatUri(ayatNode);

  return `\n#### [Ayat (${_key})](${uri})\n${isiStr}`;
}

function points2md(
  points: Points,
  parent: PointNode | AyatNode | PasalNode | MetadataNode,
  depth = 0
): string {
  const { _description, isi } = points;
  const isiStr = isi.map((x) => point2md(x, parent, depth)).join('\n');
  const description = reference2md(_description);

  return `${description}\n${isiStr}`;
}

function point2md(
  point: Point,
  parent: PointNode | AyatNode | PasalNode | MetadataNode,
  depth: number
): string {
  const { isi, _key, text } = point;
  const pointNode: PointNode = { _key, parentPoints: parent, _structureType: 'point' };
  const isiStr = !isNil(isi) ? points2md(isi, pointNode, depth + 1) : reference2md(text);
  const indent = repeat(' ', depth * 4);
  const uri = getPointUri(pointNode);

  return `${indent}* [${_key}.](${uri}) ${isiStr}`;
}

function metadata(key: string, value: string | number | undefined): string | undefined {
  if (isNil(value)) return undefined;

  return `|${key}|${value}|`;
}

function splitAt(slicable: string, indices: number[]): string[] {
  return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
}

function reference2md(ref: ReferenceText): string {
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

json2md();

import { IsiPasal } from '../../legal/structure/pasal';
import { assertNever } from 'assert-never';
import { map, flatten, compact, isNil, repeat, curry, chain } from 'lodash';
import { toRoman } from 'roman-numerals';
import { getDocumentName, getDocumentUri, DocumentNode } from '../../legal/document';
import * as fs from 'fs';
import { getUri } from '../../legal';
import { Ayat, AyatNode } from '../../legal/structure/ayat';
import { Bab, BabNode } from '../../legal/structure/bab';
import { Bagian, BagianNode } from '../../legal/structure/bagian';
import { Metadata, MetadataNode } from '../../legal/structure/metadata';
import { Paragraf, ParagrafNode } from '../../legal/structure/paragraf';
import {
  PasalParentNode,
  PasalNode,
  getPasalParentDocument,
  Pasal,
} from '../../legal/structure/pasal';
import { Point, PointNode, Points } from '../../legal/structure/point';
import { ReferenceText } from '../../legal/reference';
import { Document } from '../../legal/document/index';
import { getDocumentData, getDocumentFilePath } from '../../data';
import {
  AmenderDeletePoint,
  AmendedPoint,
  AmenderInsertPoint,
  AmendPoints,
  AmenderUpdatePoint,
} from '../../legal/structure/amend';
import * as yaml from 'js-yaml';

type Option = { overwrite: boolean };
export function jsonToMd(option: Option): void {
  const jsonNodes = getDocumentData('yaml');
  jsonNodes.forEach((jsonNode) => handleJson(jsonNode, option));
}

function handleJson(jsonNode: DocumentNode, option: Option): void {
  const { overwrite } = option;
  const jsonFile = getDocumentFilePath(jsonNode, 'yaml');
  const { path: mdPath, exists: mdExists } = getDocumentFilePath(jsonNode, 'mdv2');

  try {
    if (!overwrite && mdExists) {
      console.log(`Skipped json-to-md ${mdPath}`);
      return;
    }

    const json = yaml.load(fs.readFileSync(jsonFile.path, 'utf8')) as Document;
    const md = _jsonToMd(json);

    fs.writeFileSync(mdPath, md);

    console.log(`Finished json-to-md ${mdPath}`);
  } catch (e) {
    console.log(`Error json-to-md ${mdPath}`);
    console.log(e);
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
  const uri = getUri(metadataNode);

  return `\n# [${title}](${uri})\n${isiStr}`;
}

function babToMd(bab: Bab, parentDocument: DocumentNode): string {
  const { _key, _judul, isi } = bab;
  const babNode: BabNode = { _key, parentDocument, _structureType: 'bab' };
  const isiStr: string =
    isi._type === 'pasals'
      ? isi.pasals.map(pasalToMdWith(babNode)).join('\n')
      : isi.bagians.map(bagianToMdWith(babNode)).join('\n');
  const romanKey = toRoman(_key);
  const babUri = getUri(babNode);

  return `\n# [BAB ${romanKey}: ${_judul}](${babUri})\n${isiStr} \n`;
}

const bagianToMdWith = curry(bagianToMd);
function bagianToMd(parentBab: BabNode, bagian: Bagian): string {
  const { _key, isi } = bagian;
  const bagianNode: BagianNode = { _key, parentBab, _structureType: 'bagian' };
  const isiStr =
    isi._type === 'pasals'
      ? isi.pasals.map(pasalToMdWith(parentBab))
      : isi.paragrafs.map(paragrafToMdWith(bagianNode));
  const uri = getUri(bagianNode);
  return `\n## [Bagian ${_key}](${uri})\n${isiStr}\n`;
}

const paragrafToMdWith = curry(paragrafToMd);
function paragrafToMd(parentBagian: BagianNode, paragraf: Paragraf): string {
  const { _key, isi } = paragraf;
  const paragrafNode: ParagrafNode = { _key, parentBagian, _structureType: 'paragraf' };
  const isiStr = isi.pasals.map(pasalToMdWith(parentBagian));
  const uri = getUri(paragrafNode);
  return `\n## [Paragraf ${_key}](${uri})\n${isiStr}\n`;
}

const pasalToMdWith = curry(pasalToMd);
function pasalToMd(pasalParent: PasalParentNode, pasal: Pasal): string {
  const { _key, isi } = pasal;
  const parentDocumentNode = getPasalParentDocument(pasalParent);
  const pasalNode: PasalNode = {
    _key,
    parentDocumentNode,
    _structureType: 'pasal',
  };
  const isiStr: string = pasalContentToMd(isi, pasalNode);
  const uri = getUri(pasalNode);
  return `\n### [Pasal ${_key}](${uri})\n${isiStr}\n`;
}

function pasalContentToMd(isi: IsiPasal, pasalNode: PasalNode): string {
  switch (isi._type) {
    case 'ayats':
      return isi.ayats.map((a) => ayatToMd(a, pasalNode)).join('\n');
    case 'points':
      return pointsToMd(isi, pasalNode);
    case 'referenceText':
      return referenceToMd(isi);
    case 'amenderPoints':
      return amendPointsToMd(isi);
  }
}

function amendPointsToMd(amendPoints: AmendPoints): string {
  const { _description: description, isi, parentDocument } = amendPoints;
  const isiMd = isi.map(amendPointToMdWith(parentDocument)).join('\n');
  return `${description.text}\n${isiMd}`;
}

const amendPointToMdWith = curry(amendPointToMd);
function amendPointToMd(documentNode: DocumentNode, amendPoint: AmendedPoint): string {
  if (amendPoint._operation === 'delete')
    return amendDeletePasalPointToMd(documentNode, amendPoint);
  if (amendPoint._operation === 'update')
    return amendUpdatePasalPointToMd(documentNode, amendPoint);
  if (amendPoint._operation === 'insert')
    return amendInsertPasalPointToMd(documentNode, amendPoint);
  assertNever(amendPoint);
}

function amendDeletePasalPointToMd(
  parentDocumentNode: DocumentNode,
  amendPoint: AmenderDeletePoint
): string {
  const { _nomorKey, deletedPasal } = amendPoint;
  const pasalNode: PasalNode = {
    _structureType: 'pasal',
    _key: deletedPasal._key,
    parentDocumentNode,
  };
  const pasalUri = getUri(pasalNode);
  return `* ${_nomorKey}. [Pasal ${deletedPasal._key}](${pasalUri}) dihapus.`;
}

const s8 = '        ';

function amendUpdatePasalPointToMd(
  parentDocumentNode: DocumentNode,
  amendPoint: AmenderUpdatePoint
): string {
  const { description, _nomorKey, updatedPasal: amendedPasal } = amendPoint;
  const pasalNode: PasalNode = {
    _structureType: 'pasal',
    _key: amendedPasal._key,
    parentDocumentNode,
  };
  const pasalUri = getUri(pasalNode);
  const descriptionMd = referenceToMd(description);
  const isiMd = toIndentedAmend(pasalContentToMd(amendedPasal.isi, pasalNode));
  return `* ${_nomorKey}. ${descriptionMd}
${s8}>\n${s8}> [Pasal ${amendedPasal._key}](${pasalUri})\n\n${isiMd}`;
}

function toIndentedAmend(str: string): string {
  return str
    .split('\n')
    .map((str) => `${s8}> ${str}`)
    .join('\n');
}

function amendInsertPasalPointToMd(
  parentDocumentNode: DocumentNode,
  amendPoint: AmenderInsertPoint
): string {
  const { insertedPasals: amendedPasals, description, _nomorKey } = amendPoint;
  const descriptionMd = referenceToMd(description);
  const isiMd: string = chain(amendedPasals)
    .map((amendedPasal) => {
      const pasalNode: PasalNode = {
        _structureType: 'pasal',
        _key: amendedPasal._key,
        parentDocumentNode,
      };
      const pasalUri = getUri(pasalNode);
      const isiMd = toIndentedAmend(pasalContentToMd(amendedPasal.isi, pasalNode));
      return `${s8}>\n${s8}> [Pasal ${amendedPasal._key}](${pasalUri})\n\n${isiMd}`;
    })
    .join('\n\n')
    .value();
  return `* ${_nomorKey}. ${descriptionMd}\n${isiMd}`;
}

function ayatToMd(ayat: Ayat, parentPasal: PasalNode): string {
  const { _key, isi } = ayat;
  const ayatNode: AyatNode = { _key, parentPasal, _structureType: 'ayat' };
  const isiStr = isi._type === 'points' ? pointsToMd(isi, ayatNode) : referenceToMd(isi);
  const uri = getUri(ayatNode);

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
  const { isi, _key } = point;
  const pointNode: PointNode = { _key, parentPoints: parent, _structureType: 'point' };
  const isiStr =
    isi._type === 'points' ? pointsToMd(isi, pointNode, depth + 1) : referenceToMd(isi);
  const indent = repeat(' ', depth * 4);
  const uri = getUri(pointNode);

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
  const uris = sortedReferences.map(({ node }) => getUri(node));
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

jsonToMd({ overwrite: true });

import { PasalContent } from '../../legal/component/pasal';
import { assertNever } from 'assert-never';
import { map, flatten, compact, isNil, repeat, curry, chain } from 'lodash';
import { toRoman } from 'roman-numerals';
import { nodeToName, DocumentNode } from '../../legal/document';
import * as fs from 'fs';
import { nodeToUri } from '../../legal';
import { Ayat, AyatNode } from '../../legal/component/ayat';
import { Bab, BabNode } from '../../legal/component/bab';
import { Bagian, BagianNode } from '../../legal/component/bagian';
import { Paragraf, ParagrafNode } from '../../legal/component/paragraf';
import {
  PasalParentNode,
  PasalNode,
  getPasalParentDocument,
  Pasal,
} from '../../legal/component/pasal';
import { Point, PointNode, Points } from '../../legal/component/point';
import { ReferenceText } from '../../legal/reference';
import { Document } from '../../legal/document/index';
import { getDocumentData, nodeToFile } from '../../data';
import {
  AmenderDeletePoint,
  AmendedPoint,
  AmenderInsertPoint,
  AmenderPoints,
  AmenderUpdatePoint,
  AmendedPasal,
} from '../../legal/component/amend';
import * as yaml from 'js-yaml';

type Option = { overwrite: boolean };
export function jsonToMd(option: Option): void {
  const jsonNodes = getDocumentData('yaml');
  jsonNodes.forEach((jsonNode) => handleJson(jsonNode, option));
}

function handleJson(node: DocumentNode, option: Option): void {
  const { overwrite } = option;
  const jsonFile = nodeToFile('yaml', node);
  const { path: mdPath, exists: mdExists } = nodeToFile('mdv2', node);

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
    // mengingat,
    // menimbang,
    _node,
    babs,
  } = doc;
  const uri = nodeToUri(_node);
  const name = nodeToName(_node);
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
    // mengimbangToMd('Menimbang', menimbang, 'documentMenimbang', _node),
    // mengimbangToMd('Mengingat', mengingat, 'documentMengingat', _node),
    ...flatten(babs?.map((b) => babToMd(b, _node))),
  ];

  return compact(lines).join('\n');
}

// function mengimbangToMd(
//   title: string,
//   content: Metadata | undefined,
//   metadataType: 'documentMengingat' | 'documentMenimbang',
//   parentDocument: DocumentNode
// ): string {
//   if (isNil(content)) return '';
//   const metadataNode:
//  MetadataNode = { metadataType, parent: parentDocument, nodeType: 'metadata' };
//   const contentStr = !isNil(content.points)
//     ? pointsToMd(content.points, metadataNode)
//     : referenceToMd(content.text);
//   const uri = nodeToUri(metadataNode);
// return `\n# [${title}](${uri})\n${contentStr}`;
// }

function babToMd(bab: Bab, parent: DocumentNode): string {
  const babNode: BabNode = { key: bab.key, parent, nodeType: 'bab' };
  const contentStr: string =
    bab.content.type === 'pasals'
      ? bab.content.pasalArr.map(pasalToMdWith(babNode)).join('\n')
      : bab.content.bagianArr.map(bagianToMdWith(babNode)).join('\n');
  const romanKey = toRoman(bab.key);
  const babUri = nodeToUri(babNode);

  return `\n# [BAB ${romanKey}: ${bab.title}](${babUri})\n${contentStr} \n`;
}

const bagianToMdWith = curry(bagianToMd);
function bagianToMd(parent: BabNode, bagian: Bagian): string {
  const bagianNode: BagianNode = { key: bagian.key, parent, nodeType: 'bagian' };
  const contentStr =
    bagian.content.type === 'pasals'
      ? bagian.content.pasalArr.map(pasalToMdWith(parent))
      : bagian.content.paragrafArr.map(paragrafToMdWith(bagianNode));
  const uri = nodeToUri(bagianNode);
  return `\n## [Bagian ${bagian.key}](${uri})\n${contentStr}\n`;
}

const paragrafToMdWith = curry(paragrafToMd);
function paragrafToMd(parent: BagianNode, paragraf: Paragraf): string {
  const paragrafNode: ParagrafNode = { key: paragraf.key, parent, nodeType: 'paragraf' };
  const contentStr = paragraf.content.pasalArr.map(pasalToMdWith(parent));
  const uri = nodeToUri(paragrafNode);
  return `\n## [Paragraf ${paragraf.key}](${uri})\n${contentStr}\n`;
}

const pasalToMdWith = curry(pasalToMd);
function pasalToMd(pasalParent: PasalParentNode, pasal: Pasal): string {
  const parentDocumentNode = getPasalParentDocument(pasalParent);
  const pasalNode: PasalNode = { key: pasal.key, parentDoc: parentDocumentNode, nodeType: 'pasal' };
  const uri = nodeToUri(pasalNode);
  const contentStr: string = pasalContentToMd(pasal.content, pasalNode);
  return `\n### [Pasal ${pasal.key}](${uri})\n${contentStr}\n`;
}

function pasalContentToMd(content: PasalContent, pasalNode: PasalNode): string {
  if (content.type === 'ayats') return content.ayatArr.map(ayatToMdWith(pasalNode)).join('\n');
  if (content.type === 'points') return pointsToMd(content, pasalNode);
  if (content.type === 'referenceText') return referenceToMd(content);
  if (content.type === 'amenderPoints') return amenderPointsToMd(content);
  assertNever(content);
}

function amenderPointsToMd(amendPoints: AmenderPoints): string {
  const { description, amendedPointArr, parent } = amendPoints;
  const contentMd = amendedPointArr.map(amendPointToMdWith(parent)).join('\n');
  return `${description.text}\n${contentMd}`;
}

const amendPointToMdWith = curry(amendPointToMd);
function amendPointToMd(documentNode: DocumentNode, amendPoint: AmendedPoint): string {
  if (amendPoint.operation === 'delete') return amendDeletePasalPointToMd(documentNode, amendPoint);
  if (amendPoint.operation === 'update') return amendUpdatePasalPointToMd(documentNode, amendPoint);
  if (amendPoint.operation === 'insert') return amendInsertPasalPointToMd(documentNode, amendPoint);
  assertNever(amendPoint);
}

function amendDeletePasalPointToMd(
  parentDocumentNode: DocumentNode,
  amendPoint: AmenderDeletePoint
): string {
  const { key: _nomorKey, deletedNode: deletedPasal } = amendPoint;
  const pasalNode: PasalNode = {
    nodeType: 'pasal',
    key: deletedPasal.key,
    parentDoc: parentDocumentNode,
  };
  const pasalUri = nodeToUri(pasalNode);
  return `* ${_nomorKey}. [Pasal ${deletedPasal.key}](${pasalUri}) dihapus.`;
}

const s8 = '        ';

function amendUpdatePasalPointToMd(
  parentDocumentNode: DocumentNode,
  amendPoint: AmenderUpdatePoint
): string {
  const { updatedPasal } = amendPoint;
  const pasalNode: PasalNode = {
    nodeType: 'pasal',
    key: updatedPasal.key,
    parentDoc: parentDocumentNode,
  };
  const pasalUri = nodeToUri(pasalNode);
  const descriptionMd = referenceToMd(amendPoint.description);
  const contentMd = toIndentedAmend(pasalContentToMd(updatedPasal.content, pasalNode));
  return `* ${amendPoint.key}. ${descriptionMd}
${s8}>\n${s8}> [Pasal ${updatedPasal.key}](${pasalUri})\n\n${contentMd}`;
}

function toIndentedAmend(str: string): string {
  return str
    .split('\n')
    .map((str) => `${s8}> ${str}`)
    .join('\n');
}

function amendInsertPasalPointToMd(
  parentDoc: DocumentNode,
  amendPoint: AmenderInsertPoint
): string {
  const descriptionMd = referenceToMd(amendPoint.description);
  const contentMd: string = chain(amendPoint.amendedPasalArr)
    .map(amendedPasalToMdWith(parentDoc))
    .join('\n\n')
    .value();
  return `* ${amendPoint.key}. ${descriptionMd}\n${contentMd}`;
}

const amendedPasalToMdWith = curry(amendedPasalToMd);
function amendedPasalToMd(parentDoc: DocumentNode, amendedPasal: AmendedPasal): string {
  const pasalNode: PasalNode = { nodeType: 'pasal', key: amendedPasal.key, parentDoc };
  const pasalUri = nodeToUri(pasalNode);
  const contentMd = toIndentedAmend(pasalContentToMd(amendedPasal.content, pasalNode));
  return `${s8}>\n${s8}> [Pasal ${amendedPasal.key}](${pasalUri})\n\n${contentMd}`;
}

const ayatToMdWith = curry(ayatToMd);
function ayatToMd(parentPasal: PasalNode, ayat: Ayat): string {
  const ayatNode: AyatNode = { key: ayat.key, parent: parentPasal, nodeType: 'ayat' };
  const ayatUri = nodeToUri(ayatNode);
  const contentStr =
    ayat.content.type === 'points'
      ? pointsToMd(ayat.content, ayatNode)
      : referenceToMd(ayat.content);
  return `\n#### [Ayat (${ayat.key})](${ayatUri})\n${contentStr}`;
}

function pointsToMd(
  points: Points,
  parent: PointNode | AyatNode | PasalNode,
  // | MetadataNode
  depth = 0
): string {
  const contentStr = points.content.map(pointToMdWith({ parent, depth })).join('\n');
  const descriptionStr = referenceToMd(points.description);
  return `${descriptionStr}\n${contentStr}`;
}

const pointToMdWith = curry(pointToMd);
function pointToMd(
  context: {
    parent: PointNode | AyatNode | PasalNode;
    // | MetadataNode
    depth: number;
  },
  point: Point
): string {
  const { parent, depth } = context;
  const pointNode: PointNode = { key: point.key, parent: parent, nodeType: 'point' };
  const uri = nodeToUri(pointNode);
  const contentStr =
    point.content.type === 'points'
      ? pointsToMd(point.content, pointNode, depth + 1)
      : referenceToMd(point.content);
  const indent = repeat(' ', depth * 4);
  return `${indent}* [${point.key}.](${uri}) ${contentStr}`;
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
  const uris = sortedReferences.map(({ node }) => nodeToUri(node));
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

// jsonToMd({ overwrite: true });

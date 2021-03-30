import {
  PasalDeleteAmenderPoint,
  PasalInsertAmenderPoint,
  PasalUpdateAmenderPoint,
  PasalVersion,
  Point,
  PointSet,
} from '../../legal/component';
import assertNever from 'assert-never';
import * as yaml from 'js-yaml';
import { compact, curry, chain, repeat, isNil, flatMap } from 'lodash';
import { readFileSync, writeFileSync } from 'node:fs';
import { toRoman } from 'roman-numerals';
import { getDocumentData, nodeToFile } from '../../data';
import { nodeToUri } from '../../legal';
import { Bab, Bagian, Paragraf, Pasal, Ayat, Text, BabSet } from '../../legal/component';
import { DocumentNode, nodeToName, Document } from '../../legal/document';

type Option = { overwrite: boolean };
export function jsonToMd(option: Option): void {
  const jsonNodes = getDocumentData('yaml');
  jsonNodes.forEach(handleJsonWith(option));
}

const handleJsonWith = curry(handleJson);
function handleJson(option: Option, node: DocumentNode): void {
  const { overwrite } = option;
  const jsonFile = nodeToFile('yaml', node);
  const { path: mdPath, exists: mdExists } = nodeToFile('mdv2', node);

  try {
    if (!overwrite && mdExists) {
      console.log(`Skipped json-to-md ${mdPath}`);
      return;
    }

    const json = yaml.load(readFileSync(jsonFile.path, 'utf8')) as Document;
    const md = _jsonToMd(json);

    writeFileSync(mdPath, md);

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
    _dokumen,
    // mengingat,
    // menimbang,
    node: _node,
    babSet,
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
    // ...map(_denganPersetujuan, (d) => metadata('Dengan Persetujuan', d)),
    // mengimbangToMd('Menimbang', menimbang, 'documentMenimbang', _node),
    // mengimbangToMd('Mengingat', mengingat, 'documentMengingat', _node),
    // ...flatten(babSet?.map((b) => babToMd(b, _node))),
    ...babSetToMd(babSet),
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

function babSetToMd(babSet: BabSet): string[] {
  return flatMap(babSet.elements, babToMd);
}

function babToMd(bab: Bab): string {
  const contentStr: string =
    bab.content.type === 'pasalSet'
      ? bab.content.elements.map(pasalToMd).join('\n')
      : bab.content.elements.map(bagianToMd).join('\n');
  const romanKey = toRoman(bab.node.key);
  const babUri = nodeToUri(bab.node);

  return `\n# [BAB ${romanKey}: ${bab.title}](${babUri})\n${contentStr} \n`;
}

function bagianToMd(bagian: Bagian): string {
  const contentStr =
    bagian.content.type === 'pasalSet'
      ? bagian.content.elements.map(pasalToMd)
      : bagian.content.elements.map(paragrafToMd);
  const uri = nodeToUri(bagian.node);
  return `\n## [Bagian ${bagian.node.key}](${uri})\n${contentStr}\n`;
}

function paragrafToMd(paragraf: Paragraf): string {
  const contentStr = paragraf.pasalSet.elements.map(pasalToMd);
  const uri = nodeToUri(paragraf.node);
  return `\n## [Paragraf ${paragraf.node.key}](${uri})\n${contentStr}\n`;
}

function pasalToMd(pasal: Pasal): string {
  const uri = nodeToUri(pasal.node);
  const contentStr: string = pasalVersionToMd(pasal.version);
  return `\n### [Pasal ${pasal.node.key}](${uri})\n${contentStr}\n`;
}

function pasalVersionToMd({ content }: PasalVersion): string {
  if (content.type === 'ayatSet') return content.elements.map(ayatToMd).join('\n');
  if (content.type === 'pointSet') return pointSetToMd(content);
  if (content.type === 'text') return textToMd(content);
  assertNever(content);
}

function amendedPasalVersionToMd(pasalVersion: PasalVersion): string {
  const pasalUri = nodeToUri(pasalVersion.node);
  const contentMd = pasalVersionToMd(pasalVersion)
    .split('\n')
    .map((str) => `        > ${str}`)
    .join('\n');

  return (
    `        >` +
    `\n        > [Pasal ${pasalVersion.node.parentPasalNode.key}](${pasalUri})` +
    `\n\n${contentMd}`
  );
}

function ayatToMd(ayat: Ayat): string {
  const ayatUri = nodeToUri(ayat.node);
  const contentStr =
    ayat.content.type === 'pointSet' ? pointSetToMd(ayat.content) : textToMd(ayat.content);
  return `\n#### [Ayat (${ayat.node.key})](${ayatUri})\n${contentStr}`;
}

function pointSetToMd(points: PointSet, depth = 0): string {
  const contentStr = points.elements.map(pointToMdWith(depth)).join('\n');
  const descriptionStr = textToMd(points.description);
  return `${descriptionStr}\n${contentStr}`;
}

const pointToMdWith = curry(pointToMd);
function pointToMd(depth: number, point: Point): string {
  const uri = nodeToUri(point.node);
  const contentStr = pointContentToMd(point.content, depth + 1);
  const indent = repeat(' ', depth * 4);
  return `${indent}* [${point.node.key}.](${uri}) ${contentStr}`;
}

function pointContentToMd(
  component:
    | PointSet
    | PasalDeleteAmenderPoint
    | PasalUpdateAmenderPoint
    | PasalInsertAmenderPoint
    | Text,
  depth: number
): string {
  if (component.type === 'pointSet') return pointSetToMd(component, depth);
  if (component.type === 'text') return textToMd(component);
  if (component.type === 'pasalDeleteAmenderPoint') {
    const pasalUri = nodeToUri(component.deletedPasalVersionNode);
    const pasalKey = component.deletedPasalVersionNode.parentPasalNode.key;
    return `* ${component.node.key}. [Pasal ${pasalKey}](${pasalUri}) dihapus.`;
  }
  if (component.type === 'pasalUpdateAmenderPoint') {
    const descriptionMd = textToMd(component.description);
    const contentMd = amendedPasalVersionToMd(component.updatedPasalVersion);
    return `* ${component.node.key}. ${descriptionMd}\n${contentMd}`;
  }
  if (component.type === 'pasalInsertAmenderPoint') {
    const descriptionMd = textToMd(component.description);
    const contentMd: string = chain(component.insertedPasalVersionArr)
      .map(amendedPasalVersionToMd)
      .join('\n\n')
      .value();
    return `* ${component.node.key}. ${descriptionMd}\n${contentMd}`;
  }
  assertNever(component);
}

function metadata(key: string, value: string | number | undefined): string | undefined {
  if (isNil(value)) return undefined;
  return `|${key}|${value}|`;
}

function splitAt(slicable: string, indices: number[]): string[] {
  return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
}

function textToMd(ref: Text): string {
  const { references, textString: text } = ref;
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

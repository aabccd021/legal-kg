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
import { compact, curry, chain, repeat, isNil, flatMap, isUndefined } from 'lodash';
import { readFileSync, writeFileSync } from 'fs';
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
  const mdFile = nodeToFile('mdv2', node);

  try {
    if (!overwrite && mdFile.exists) {
      console.log(`Skipped json-to-md ${mdFile.path}`);
      return;
    }

    const json = yaml.load(readFileSync(jsonFile.path, 'utf8')) as Document;
    const md = _jsonToMd(json);

    writeFileSync(mdFile.path, md);

    console.log(`Finished json-to-md ${mdFile.path}`);
  } catch (e) {
    console.log(`Error json-to-md ${mdFile.path}`);
    console.log(e);
  }
}

function _jsonToMd(doc: Document): string {
  const {
    pemutus,
    tentang,
    salinan,
    memutuskan,
    tempatDitetapkan,
    tanggalDitetapkan,
    tempatDiundangkan,
    tanggalDiundangkan,
    sekretaris,
    dokumen,
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
    metadata('Name', name),
    metadata('Pemutus', pemutus),
    metadata('Tentang', tentang),
    metadata('Salinan', salinan),
    metadata('Memutuskan', memutuskan),
    metadata('Tempat Disahkan', doc.disahkan.location),
    metadata('Tanggal Disahkan', doc.disahkan.date.date),
    metadata('Bulan Disahkan', doc.disahkan.date.month),
    metadata('Tahun Disahkan', doc.disahkan.date.year),
    metadata('Tempat Ditetapkan', tempatDitetapkan),
    metadata('Tanggal Ditetapkan', tanggalDitetapkan),
    metadata('Jabatan Pengesah', doc.disahkan.jabatanPengesah),
    metadata('Nama Pengesah', doc.disahkan.pengesah),
    metadata('Tempat Diundangkan', tempatDiundangkan),
    metadata('Tanggal Diundangkan', tanggalDiundangkan),
    metadata('Sekretaris', sekretaris),
    metadata('Dokumen', dokumen),
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
  if (isUndefined(content)) return '';
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
function pointToMd(
  depth: number,
  point: Point | PasalDeleteAmenderPoint | PasalUpdateAmenderPoint | PasalInsertAmenderPoint
): string {
  if (point.type === 'point') {
    const uri = nodeToUri(point.node);
    const contentStr = pointContentToMd(point.content, depth + 1);
    const indent = repeat(' ', depth * 4);
    return `${indent}* [${point.node.key}.](${uri}) ${contentStr}`;
  }
  if (point.type === 'pasalDeleteAmenderPoint') {
    const pasalUri = nodeToUri(point.deletedPasalVersion.node);
    const pasalKey = point.deletedPasalVersion.node.parentPasalNode.key;
    return `* ${point.node.key}. [Pasal ${pasalKey}](${pasalUri}) dihapus.`;
  }
  if (point.type === 'pasalUpdateAmenderPoint') {
    const descriptionMd = textToMd(point.description);
    const contentMd = amendedPasalVersionToMd(point.updatedPasalVersion);
    return `* ${point.node.key}. ${descriptionMd}\n${contentMd}`;
  }
  if (point.type === 'pasalInsertAmenderPoint') {
    const descriptionMd = textToMd(point.description);
    const contentMd: string = chain(point.insertedPasalVersionArr)
      .map(amendedPasalVersionToMd)
      .join('\n\n')
      .value();
    return `* ${point.node.key}. ${descriptionMd}\n${contentMd}`;
  }
  assertNever(point);
}

function pointContentToMd(component: PointSet | Text, depth: number): string {
  if (component.type === 'pointSet') return pointSetToMd(component, depth);
  if (component.type === 'text') return textToMd(component);
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

jsonToMd({ overwrite: true });

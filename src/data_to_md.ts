import { Mengingat } from './component';
import {
  Menimbang,
  PasalDeleteAmenderPoint,
  PasalInsertAmenderPoint,
  PasalUpdateAmenderPoint,
  PasalVersion,
  Point,
  PointSet,
} from './component';
import assertNever from 'assert-never';
import * as yaml from 'js-yaml';
import { compact, curry, chain, repeat, isNil, flatMap, isUndefined } from 'lodash';
import { readFileSync, writeFileSync } from 'fs';
import { toRoman } from 'roman-numerals';
import { Bab, Bagian, Paragraf, Pasal, Ayat, Text, Document, BabSet } from './component';
import { DocumentNode, nodeToName } from './document';
import { getDocumentData, nodeToFile, shouldOverwrite } from './util';
import { nodeToUri } from './uri';

export function jsonToMd(): void {
  const jsonNodes = getDocumentData('data');
  jsonNodes.forEach(handleJson);
}

function handleJson(node: DocumentNode): void {
  console.log('\nstart', node);

  const jsonFile = nodeToFile('data', node);
  const mdFile = nodeToFile('md', node);

  if (!shouldOverwrite() && mdFile.exists) {
    console.log('skipped because exists');
    return;
  }

  try {
    const documentFile = readFileSync(jsonFile.path, 'utf8');
    if (documentFile.length === 0) {
      console.log(`empty ${jsonFile.path}`);
      return;
    }

    const json = yaml.load(documentFile) as Document;
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
    metadata: {
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
      denganPersetujuan,
      mengingat,
      menimbang,
    },
    node: _node,
    content,
  } = doc;
  const uri = nodeToUri(_node);
  const name = nodeToName(_node);
  const lines: (string | undefined)[] = [
    `# [${name}](${uri})`,
    `\n| Nama | Data |`,
    `| ------ | ----- |`,
    metadataToStr('Name', name),
    metadataToStr('Pemutus', pemutus),
    metadataToStr('Tentang', tentang),
    metadataToStr('Salinan', salinan),
    metadataToStr('Memutuskan', memutuskan),
    metadataToStr('Tempat Disahkan', doc.disahkan.location),
    metadataToStr('Tanggal Disahkan', doc.disahkan.date.date),
    metadataToStr('Bulan Disahkan', doc.disahkan.date.month),
    metadataToStr('Tahun Disahkan', doc.disahkan.date.year),
    metadataToStr('Tempat Ditetapkan', tempatDitetapkan),
    metadataToStr('Tanggal Ditetapkan', tanggalDitetapkan),
    metadataToStr('Jabatan Pengesah', doc.disahkan.jabatanPengesah),
    metadataToStr('Nama Pengesah', doc.disahkan.pengesah),
    metadataToStr('Tempat Diundangkan', tempatDiundangkan),
    metadataToStr('Tanggal Diundangkan', tanggalDiundangkan),
    metadataToStr('Sekretaris', sekretaris),
    metadataToStr('Dokumen', dokumen),
    metadataToStr('Dengan Persetujuan', denganPersetujuan),
    // ...map(_denganPersetujuan, (d) => metadata('Dengan Persetujuan', d)),
    // mengimbangToMd('Menimbang', menimbang, 'menimbang', _node),
    menimbangToMd(menimbang),
    mengingatToMd(mengingat),
    // mengimbangToMd('Mengingat', mengingat, 'mengingat', _node),
    // ...flatten(babSet?.map((b) => babToMd(b, _node))),
    ...(content.type === 'babSet' ? babSetToMd(content) : content.elements.map(pasalToMd)),
  ];

  return compact(lines).join('\n');
}

function menimbangToMd(menimbang?: Menimbang): string {
  if (isUndefined(menimbang)) return '';
  const content =
    menimbang.content.type === 'daftarHuruf'
      ? daftarHurufToMd(menimbang.content)
      : textToMd(menimbang.content);
  return `# [Menimbang](${nodeToUri(menimbang.node)})\n${content}`;
}

function mengingatToMd(mengingat?: Mengingat): string {
  if (isUndefined(mengingat)) return '';
  const content =
    mengingat.content.type === 'daftarHuruf'
      ? daftarHurufToMd(mengingat.content)
      : textToMd(mengingat.content);
  return `# [Mengingat](${nodeToUri(mengingat.node)})\n${content}`;
}

function babSetToMd(babSet: BabSet): string[] {
  return flatMap(babSet.elements, babToMd);
}

function babToMd(bab: Bab): string {
  const contentStr: string =
    bab.content.type === 'daftarPasal'
      ? bab.content.elements.map(pasalToMd).join('\n')
      : bab.content.elements.map(bagianToMd).join('\n');
  const romanKey = toRoman(bab.node.key);
  const babUri = nodeToUri(bab.node);

  return `\n# [BAB ${romanKey}: ${bab.title}](${babUri})\n${contentStr} \n`;
}

function bagianToMd(bagian: Bagian): string {
  const contentStr =
    bagian.content.type === 'daftarPasal'
      ? bagian.content.elements.map(pasalToMd)
      : bagian.content.elements.map(paragrafToMd);
  const uri = nodeToUri(bagian.node);
  return `\n## [${bagian.title}](${uri})\n${contentStr}\n`;
}

function paragrafToMd(paragraf: Paragraf): string {
  const contentStr = paragraf.daftarPasal.elements.map(pasalToMd);
  const uri = nodeToUri(paragraf.node);
  return `\n## [${paragraf.title}](${uri})\n${contentStr}\n`;
}

function pasalToMd(pasal: Pasal): string {
  const uri = nodeToUri(pasal.node);
  const contentStr: string = pasalVersionToMd(pasal.version);
  return `\n### [Pasal ${pasal.node.key}](${uri})\n${contentStr}\n`;
}

function pasalVersionToMd({ content }: PasalVersion): string {
  if (isUndefined(content)) return '';
  if (content.type === 'ayatSet') return content.elements.map(ayatToMd).join('\n');
  if (content.type === 'daftarHuruf') return daftarHurufToMd(content);
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
    ayat.content.type === 'daftarHuruf' ? daftarHurufToMd(ayat.content) : textToMd(ayat.content);
  return `\n#### [Ayat (${ayat.node.key})](${ayatUri})\n${contentStr}`;
}

function daftarHurufToMd(points: PointSet, depth = 0): string {
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
  if (component.type === 'daftarHuruf') return daftarHurufToMd(component, depth);
  if (component.type === 'text') return textToMd(component);
  assertNever(component);
}

function metadataToStr(key: string, value: string | number | undefined): string | undefined {
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

jsonToMd();

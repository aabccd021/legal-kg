import { assertNever } from 'assert-never';
import { map, flatten, compact, isNil, repeat, isArray } from 'lodash';
import { toRoman } from 'roman-numerals';
import {
  LegalDocument,
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
  MetadataTrace,
  getMetadataUri,
  getBabUri,
  BabTrace,
  BagianTrace,
  getBagianUri,
  ParagrafTrace,
  getParagrafUri,
  PasalTrace,
  getPasalUri,
  AyatTrace,
  getAyatUri,
  PointTrace,
  getPointUri,
} from '../../uri/document-structure';
import { getLegalName, getLegalUri, DocumentTrace } from '../../uri/document-type';
import { DataDir, getLegalData, getDocFilePath } from '../utils';
import * as fs from 'fs';

function json2md(): void {
  const legalDir = 'maintained_legals';
  const jsonDir: DataDir = { legalDir, dataType: 'json' };
  const mdDir: DataDir = { legalDir, dataType: 'md' };

  const legals = getLegalData(jsonDir);
  legals.forEach((legal) => {
    const jsonPath = getDocFilePath(legal, jsonDir);
    const mdPath = getDocFilePath(legal, mdDir);

    const jsonString = fs.readFileSync(jsonPath).toString();
    const json = JSON.parse(jsonString) as LegalDocument;
    const md = _json2md(json);

    fs.writeFileSync(mdPath, md);

    console.log(`Finished json2md ${mdPath}`);
  });
}

function _json2md(doc: LegalDocument): string {
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
    _trace: _docTrace,
    babs,
  } = doc;
  const uri = getLegalUri(_docTrace);
  const name = getLegalName(_docTrace);
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
    mengimbang2md('Menimbang', menimbang, 'menimbang', _docTrace),
    mengimbang2md('Mengingat', mengingat, 'mengingat', _docTrace),
    ...flatten(babs?.map((b) => bab2md(b, _docTrace))),
  ];

  return compact(lines).join('\n');
}

function mengimbang2md(
  title: string,
  isi: Mengimbang | undefined,
  type: 'menimbang' | 'mengingat',
  parentTrace: DocumentTrace
): string {
  if (isNil(isi)) return '';
  const { points, text } = isi;
  const trace: MetadataTrace = { ...parentTrace, metadataType: type, _metadataTrace: true };
  const isiStr = !isNil(points) ? points2md(points, trace) : reference2md(text);
  const uri = getMetadataUri(trace);

  return `\n# [${title}](${uri})\n${isiStr}`;
}

function bab2md(bab: Bab, parenttrace: DocumentTrace): string {
  const { _key, _judul, isi, text } = bab;
  const trace = { ...parenttrace, bab: _key };
  const isiStr: string = !isNil(isi) ? isiBab2md(isi, trace) : text;
  const romanKey = toRoman(_key);
  const babUri = getBabUri(trace);

  return `\n# [BAB ${romanKey}: ${_judul}](${babUri})\n${isiStr} \n`;
}

function isiBab2md(isi: Bagian[] | Pasal[], trace: BabTrace): string {
  if (isPasals(isi)) return isi.map((p) => pasal2md(p, trace)).join('\n');
  if (isBagians(isi)) return isi.map((b) => bagian2md(b, trace)).join('\n');
  assertNever(isi);
}

function bagian2md(bagian: Bagian, parentTrace: BabTrace): string {
  const { _key, isi } = bagian;
  const trace: BagianTrace = { ...parentTrace, bagian: _key };
  const isiStr = isPasals(isi)
    ? isi.map((p) => pasal2md(p, trace))
    : isi.map((p) => paragraf2md(p, trace));
  const uri = getBagianUri(trace);

  return `\n## [Bagian ${_key}](${uri})\n${isiStr}\n`;
}

function paragraf2md(paragraf: Paragraf, parentTrace: BagianTrace): string {
  const { _key, isi } = paragraf;
  const trace: ParagrafTrace = { ...parentTrace, paragraf: _key };
  const isiStr = isi.map((p) => pasal2md(p, trace));
  const uri = getParagrafUri(trace);

  return `\n## [Paragraf ${_key}](${uri})\n${isiStr}\n`;
}

function pasal2md(pasal: Pasal, parentTrace: DocumentTrace): string {
  const { _key, isi, text } = pasal;
  const trace: PasalTrace = { ...parentTrace, pasal: _key, _pasalTraceType: true };
  const isiStr: string = !isNil(isi) ? pasalContent2md(isi, trace) : reference2md(text);
  const uri = getPasalUri(trace);

  return `\n### [Pasal ${_key}](${uri})\n${isiStr}\n`;
}

function pasalContent2md(isi: Points | Ayat[], trace: PasalTrace): string {
  if (isArray(isi) && isAyats(isi)) return isi.map((a) => ayat2md(a, trace)).join('\n');

  return points2md(isi, trace);
}

function ayat2md(ayat: Ayat, parentTrace: PasalTrace): string {
  const { _key, isi, text } = ayat;
  const trace: AyatTrace = { ...parentTrace, ayat: _key, _ayatTraceType: true };
  const isiStr = !isNil(isi) ? points2md(isi, trace) : reference2md(text);
  const uri = getAyatUri(trace);

  return `\n#### [Ayat (${_key})](${uri})\n${isiStr}`;
}

function points2md(
  points: Points,
  parent: PointTrace | AyatTrace | PasalTrace | MetadataTrace,
  depth = 0
): string {
  const { _description, isi } = points;
  const isiStr = isi.map((x) => point2md(x, parent, depth)).join('\n');
  const description = reference2md(_description);

  return `${description}\n${isiStr}`;
}

function point2md(
  point: Point,
  parent: PointTrace | AyatTrace | PasalTrace | MetadataTrace,
  depth: number
): string {
  const { isi, _key, text } = point;
  const trace: PointTrace = { point: _key, _pointTraceType: true, parent };
  const isiStr = !isNil(isi) ? points2md(isi, trace, depth + 1) : reference2md(text);
  const indent = repeat(' ', depth * 4);
  const uri = getPointUri(trace);

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
  const uris = sortedReferences.map(({ trace: uri }) => uri);
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

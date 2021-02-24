import { compact, flatMap, isEmpty, isNil, isUndefined, mapValues } from 'lodash';
import { toArabic } from 'roman-numerals';
import { DocumentNode } from '../../../legal/document';
import { Document } from '../../../legal/document/index';
import { Ayat } from '../../../legal/structure/ayat';
import { Bab } from '../../../legal/structure/bab';
import { Bagian } from '../../../legal/structure/bagian';
import { Metadata } from '../../../legal/structure/metadata';
import { Paragraf } from '../../../legal/structure/paragraf';
import { Pasal } from '../../../legal/structure/pasal';
import { Points, Point } from '../../../legal/structure/point';
import { ReferenceText } from '../../../legal/reference';
const padaTaggalRegexp = /^pada tanggal/;
const mengingatRegex = /^Mengingat\s*:/;
const menimbangRegex = /(^Menimbang\s*:?)/;

export function textToRawJson(text: string, documentNode: DocumentNode): Document {
  const lines = text.split('\n');
  const extractors: Extractor<keyof Document>[] = [
    ['_salinan', /^SALINAN/, 'optional'],
    ['_name', /^(UNDANG-UNDANG REPUBLIK INDONESIA|PERATURAN GUBERNUR)/, 'optional'],
    ['_nomor', /^NOMOR/, 'optional'],
    ['_tentang', /^TENTANG$/, 'optional', 'trim'],
    ['_pemutus', /^DENGAN RAHMAT TUHAN YANG MAHA ESA$/, 'optional', 'trim'],
    ['menimbang', menimbangRegex, 'optional'],
    ['mengingat', mengingatRegex, 'optional'],
    ['_denganPersetujuan', /^Dengan persetujuan bersama antara$/, 'optional'],
    ['_memutuskan', /^MEMUTUSKAN\s*:\s*/, 'optional', 'trim'],
    ['babs', babStartRegexp, 'required'],
    ['_tempatDitetapkan', /^Ditetapkan di /, 'optional', 'trim'],
    ['_tanggalDitetapkan', padaTaggalRegexp, 'optional', 'trim'],
    ['_tempatDisahkan', /^Disahkan di /, 'optional', 'trim'],
    ['_tanggalDisahkan', padaTaggalRegexp, 'optional', 'trim'],
    ['_jabatanPengesah', /^(GUBERNUR|PRESIDEN)/, 'optional'],
    ['_namaPengesah', /^ttd$/, 'optional', 'trim'],
    ['_tempatDiundangkan', /^Diundangkan di/, 'optional', 'trim'],
    ['_sekretaris', /^SEKRETARIS/, 'optional'],
    ['_dokumen', /^(LEMBARAN NEGARA|BERITA DAERAH)/, 'optional'],
    ['salinanSesuaiDenganAslinya', /^Salinan/, 'optional'],
    ['penjelasan', /^PENJELASAN/, 'optional'],
  ];
  const extract_result = extractLines(lines, extractors);
  const nomor_tahun = extract_result._nomor?.[0]
    ?.toLowerCase()
    .replace('nomor', '')
    .replace('tahun', '')
    .split(' ')
    .filter((x) => x !== '')
    .map((x) => parseInt(x));
  const doc: Document = {
    ...mapValues(extract_result, (x) => x?.join(' ').trim()),
    _node: documentNode,
    babs: getBabs(extract_result.babs),
    _pemutus: extract_result._pemutus?.join(' ').slice(0, -1).trim(),
    _sekretaris: extract_result._sekretaris?.filter((x) => x !== 'ttd').join(' '),
    _nomor: nomor_tahun?.[0],
    _tahun: nomor_tahun?.[1],
    _tanggalDiundangkan: extract_result._tempatDiundangkan?.[1]
      ?.replace(padaTaggalRegexp, '')
      .trim(),
    _tempatDiundangkan: extract_result._tempatDiundangkan?.[0]?.trim(),
    _denganPersetujuan: extract_result._denganPersetujuan?.filter((x) => x !== 'DAN').slice(1),
    mengingat: toMengimbang(extract_result.mengingat, mengingatRegex),
    menimbang: toMengimbang(extract_result.menimbang, menimbangRegex),
    penjelasan: extract_result.penjelasan,
  };

  return doc;
}

function toMengimbang(lines: string[] | undefined, regex: RegExp): Metadata | undefined {
  if (isNil(lines)) return undefined;
  const points = getPoints(removeKeyFromLines(lines, regex));
  const text = stringToEmptyReference(lines.join(' '));

  return { text, points };
}

// Babs
const babStartRegexp = /^BAB /;

function getBabKey(line?: string): number | undefined {
  if (isNil(line)) {
    return undefined;
  }

  try {
    return toArabic(line.replace(babStartRegexp, ''));
  } catch {
    return undefined;
  }
}

function getBabs(lines?: string[]): Bab[] | undefined {
  if (isNil(lines) || getBabKey(lines[0]) !== 1) {
    return undefined;
  }
  const babsLines = extractIncLines(lines, getBabKey);

  return babsLines.map(toBabs);
}

function toBabs({ _key, lines }: { _key: number; lines: string[] }): Bab {
  const extractors: Extractor<'keyJudul' | 'isiLines'>[] = [
    ['keyJudul', /.*/, 'required'],
    ['isiLines', /[a-z]+/, 'required'],
  ];
  const { keyJudul, isiLines } = extractLines(lines, extractors);

  if (!keyJudul || !isiLines) {
    throw Error(`JUDUL OR ISI NOT FOUND: ${keyJudul} ${isiLines}`);
  }
  const _judul = keyJudul.slice(1).join(' ');
  const isi = getBagians(isiLines) ?? getPasals(isiLines);
  const text = lines.join(' ');

  return { _type: 'bab', _key, _judul, isi, text };
}

/**
 * Bagians
 */
const bagianRegex = /^Bagian /;

function getBagianKey(line?: string): number | undefined {
  if (!line || !bagianRegex.test(line)) {
    return undefined;
  }
  const bagianKeyStr = line.replace(bagianRegex, '');
  if (bagianKeyStr === 'Kesatu' || bagianKeyStr === 'Pertama') return 1;
  if (bagianKeyStr === 'Kedua') return 2;
  if (bagianKeyStr === 'Ketiga') return 3;
  if (bagianKeyStr === 'Keempat') return 4;
  if (bagianKeyStr === 'Kelima') return 5;
  if (bagianKeyStr === 'Keenam') return 6;
  if (bagianKeyStr === 'Ketujuh') return 7;
  if (bagianKeyStr === 'Kedelapan') return 8;
  if (bagianKeyStr === 'Kesembilan') return 9;
  throw Error(`Bagian key ${bagianKeyStr} is unknown on line: ${line}`);
}

function getBagians(linas: string[]): Bagian[] | undefined {
  const firstBagianKey = getBagianKey(linas[0]);
  if (firstBagianKey !== 1) return undefined;
  const bagiansLines = extractIncLines(linas, getBagianKey);

  return bagiansLines.map(_linesToBagian);
}

function _linesToBagian({ _key, lines }: IncLines): Bagian {
  const extractors: Extractor<'keyJudul' | 'pasalStart' | 'paragrafStart'>[] = [
    ['keyJudul', /.*/, 'required'],
    ['pasalStart', pasalRegex, 'optional'],
    ['paragrafStart', paragrafRegex, 'optional'],
  ];
  const { keyJudul, pasalStart, paragrafStart } = extractLines(lines.slice(1), extractors);

  if (!keyJudul) {
    throw Error(`${lines}`);
  }
  const isiLines = flatMap(compact([pasalStart, paragrafStart]));
  const isi = getParagrafs(isiLines) ?? getPasals(isiLines);
  const text = lines.join(' ');
  const _judul = removeKeyFromLines(keyJudul, bagianRegex).join(' ');

  return { _type: 'bagian', _key, _judul, isi, text };
}

/**
 * Paragraf
 */
const paragrafRegex = /^Paragraf /;

function getParagrafKey(line?: string): number | undefined {
  if (isNil(line)) return undefined;
  if (!paragrafRegex.test(line)) return undefined;

  return safeParseInt(line?.replace(paragrafRegex, ''));
}

function getParagrafs(lines: string[]): Paragraf[] | undefined {
  const [firstLine] = lines;
  const firstKey = getParagrafKey(firstLine);
  if (firstKey !== 1) return undefined;
  const paragrafLines = extractIncLines(lines, getParagrafKey);

  return paragrafLines.map(_linesToParagraf);
}

function _linesToParagraf(incLines: IncLines): Paragraf {
  const { _key, lines } = incLines;
  const extractors: Extractor<'keyJudul' | 'pasalLines'>[] = [
    ['keyJudul', /.*/, 'required'],
    ['pasalLines', pasalRegex, 'optional'],
  ];
  const { keyJudul, pasalLines } = extractLines(lines.slice(1), extractors);
  if (!keyJudul) throw Error();
  if (!pasalLines) throw Error();
  const _judul = removeKeyFromLines(keyJudul, paragrafRegex).join(' ');
  const isi = getPasals(pasalLines);
  const text = lines.join(' ');

  return { _type: 'paragraf', _key, _judul, isi, text };
}

/**
 * Pasal
 */
// dirty
const pasalRegex = /^Pasa(l|i)\s?/;

function getPasalKey(line?: string): number | undefined {
  return !line || pasalRegex.test(line) ? safeParseInt(line?.replace(pasalRegex, '')) : undefined;
}

function getPasals(lines: string[]): Pasal[] {
  const [firstLine] = lines;
  const firstKey = getPasalKey(firstLine);
  if (isNil(firstKey)) throw Error(firstLine);
  const pasalsLines = extractIncLines(lines, getPasalKey);

  return pasalsLines.map(_linesToPasal);
}

function _linesToPasal({ _key, lines }: IncLines): Pasal {
  const isiLines = lines.slice(1);
  const isi = getAyats(isiLines) ?? getPoints(isiLines);
  const text = stringToEmptyReference(isiLines.join(' '));

  return { _type: 'pasal', _key, isi, text };
}

/**
 * Ayat
 */
const ayatRegexp = /^\([0-9]+\)/;

// dirty
function getAyatKey(line?: string, prevKey?: number): number | undefined {
  if (isUndefined(line)) return undefined;
  const firstMatch = line?.match(ayatRegexp)?.[0];
  if (!isUndefined(firstMatch)) {
    // `(42)` -> 42
    return safeParseInt(firstMatch?.slice(1, -1));
  }
  if (!isUndefined(prevKey)) {
    const dirtyAyatRegexp = /^\([0-9]+ /;
    const firstDirtyMatches = line?.match(dirtyAyatRegexp)?.[0];
    if (!isUndefined(firstDirtyMatches)) {
      // `(21 ` -> 2
      const cleanedKey = safeParseInt(line.split(' ')?.[0]?.slice(1, -1));
      if (!isUndefined(cleanedKey) && cleanedKey === prevKey + 1) {
        return cleanedKey;
      }
    }
  }
  return undefined;
}

function getAyats(lines: string[]): Ayat[] | undefined {
  const firstKey = getAyatKey(lines[0]);
  if (firstKey !== 1) return undefined;
  const ayatsLines = extractIncLines(lines, getAyatKey);

  return ayatsLines.map(_linesToAyat);
}

function _linesToAyat({ _key, lines }: IncLines): Ayat {
  const linesWithoutKey = removeKeyFromLines(lines, ayatRegexp);
  const isi = getPoints(linesWithoutKey);
  const text = stringToEmptyReference(linesWithoutKey.join(' '));

  return { _type: 'ayat', _key, isi, text };
}

/**
 * Point
 */
const numPointRegexp = /^[0-9]+\s?[.)]/;

function getNumPointKey(line?: string): number | undefined {
  const matches = line?.match(numPointRegexp);
  const firstMatch = matches?.[0];

  return safeParseInt(firstMatch);
}

const alphaPointRegexp = /^[a-z][.)]/;

function getAlphaPointKey(line?: string): number | undefined {
  const matches = line?.match(alphaPointRegexp);
  const firstMatch = matches?.[0];

  return firstMatch?.charCodeAt(0);
}

function getPoints(lines: string[]): Points | undefined {
  for (const [lineIdx, line] of lines.entries()) {
    const isi = lines.slice(lineIdx);
    const descriptionLines = lines.slice(0, lineIdx);
    const description = descriptionLines.join(' ');

    if (getNumPointKey(line) === 1) {
      return _getPoints('numPoint', isi, description, getNumPointKey, numPointRegexp);
    }

    if (getAlphaPointKey(line) === 'a'.charCodeAt(0)) {
      return _getPoints(
        'alphaPoint',
        isi,
        description,
        getAlphaPointKey,
        alphaPointRegexp,
        String.fromCharCode
      );
    }
  }

  return undefined;
}

function _getPoints(
  _type: 'numPoint' | 'alphaPoint',
  isiLines: string[],
  __description: string,
  getKeyInt: (string: string) => number | undefined,
  regexp: RegExp,
  getKey: (int: number) => number | string = (number) => number
): Points {
  const pointsLines = extractIncLines(isiLines, getKeyInt);
  const isi = pointsLines.map(({ _key, lines }) => {
    const __key = getKey(_key);
    const linesWithoutKey = removeKeyFromLines(lines, regexp);
    const isi = getPoints(linesWithoutKey);
    const text = stringToEmptyReference(linesWithoutKey.join(' '));
    const point: Point = { _type, _key: __key, isi, text };

    return point;
  });
  const textLines = [__description, ...isiLines];
  const text = textLines.filter((x) => !isEmpty(x)).join(' ');
  const _description = stringToEmptyReference(__description);

  return { _type: 'points', _description, text, isi };
}

type Extractor<T> =
  | [T, RegExp, 'optional' | 'required']
  | [T, RegExp, 'optional' | 'required', 'trim'];

function extractLines<T extends string>(
  lines: string[],
  extractors: Extractor<T>[]
): { [P in T]?: string[] } {
  let curExtractorIdx = 0;
  const result: { [P in T]?: string[] } = {};

  for (let line of lines) {
    for (const [candidateExtractorIdx, candidateExtractor] of extractors.entries()) {
      if (candidateExtractorIdx <= curExtractorIdx) continue;
      const [, extractorRegexp, optionalOption, trimOption] = candidateExtractor;

      if (extractorRegexp.test(line)) {
        curExtractorIdx = candidateExtractorIdx;
        if (trimOption === 'trim') line = line.replace(extractorRegexp, '');
      } else if (optionalOption !== 'optional') {
        break;
      }
    }
    const extractorName = extractors[curExtractorIdx]?.[0];

    if (extractorName) {
      const extractorLines = result[extractorName] ?? [];
      result[extractorName] = [...extractorLines, line];
    } else {
      throw Error(`Index out of range ${curExtractorIdx}`);
    }
  }

  return result;
}

type IncLines = { _key: number; lines: string[] };

function extractIncLines(
  lines: string[],
  keyOf: (string: string, prev?: number) => number | undefined
): IncLines[] {
  const elements: IncLines[] = [{ _key: -1, lines: [] }];
  let prevKey: number | undefined = undefined;

  for (const line of lines) {
    const lineKey = keyOf(line, prevKey);

    if (!isNil(lineKey)) {
      if (!prevKey || lineKey === prevKey + 1) {
        prevKey = lineKey;
        const newElement = { _key: lineKey, lines: [] };
        elements.push(newElement);
      }
    }
    elements[elements.length - 1]?.lines.push(line);
  }

  return elements.filter(({ lines, _key }) => !isEmpty(lines) && _key !== -1);
}

function safeParseInt(string?: string): number | undefined {
  if (isNil(string)) return undefined;

  try {
    // dirty
    const parseResult = parseInt(string.replaceAll('T', '7'));
    if (isNaN(parseResult)) return undefined;

    return parseResult;
  } catch {
    return undefined;
  }
}

function removeKeyFromLines(lines: string[] | undefined, keyRegexp: RegExp): string[] {
  if (isNil(lines)) throw Error();
  const [firstLine] = lines;
  const firstLineWithoutKey = firstLine?.replace(keyRegexp, '').trim();
  const restOfLines = lines.slice(1);
  const resultLines = [firstLineWithoutKey, ...restOfLines];

  return compact(resultLines).filter(isNotEmpty);
}

function isNotEmpty(string: string): boolean {
  return !isEmpty(string);
}

function stringToEmptyReference(text: string): ReferenceText {
  return { _type: 'referenceText', references: [], text };
}

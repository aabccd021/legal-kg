// import { curry, isEmpty, isUndefined } from 'lodash';
// import { Ayat } from '../../../legal/structure/ayat';
// import { Pasal } from '../../../legal/structure/pasal';
// import { Point, Points } from '../../../legal/structure/point';
// const padaTaggalRegexp = /^pada tanggal [12]?[0-9]/;
// const padaTaggalExtractRegexp = /^pada tanggal/;
// const mengingatRegex = /^Mengingat\s*:/;
// const menimbangRegex = /(^Menimbang\s*:?)/;

// import { isEmpty } from 'lodash';
// import { Ayat } from '../../../legal/structure/ayat';
// import { Pasal } from '../../../legal/structure/pasal';
// import { Points } from '../../../legal/structure/point';
// import { safeParseInt } from '../pdf_data_to_json/parse_key_from_spans';

// export function textToRawJson(text: string, documentNode: DocumentNode): Document {
//   const lines = text.split('\n');
//   const extractors: Extractor<keyof Document>[] = [
//     ['_salinan', /^SALINAN/, 'optional'],
//     ['_name', /^(UNDANG-UNDANG REPUBLIK INDONESIA|PERATURAN GUBERNUR)/, 'optional'],
//     ['_nomor', /^NOMOR/, 'optional'],
//     ['_tentang', /^TENTANG$/, 'optional', 'trim'],
//     ['_pemutus', /^DENGAN RAHMAT TUHAN YANG MAHA ESA$/, 'optional', 'trim'],
//     ['menimbang', menimbangRegex, 'optional'],
//     ['mengingat', mengingatRegex, 'optional'],
//     ['_denganPersetujuan', /^Dengan persetujuan bersama antara$/, 'optional'],
//     ['_memutuskan', /^MEMUTUSKAN\s*:\s*/, 'optional', 'trim'],
//     ['babs', babStartRegexp, 'required'],
//     ['_tempatDitetapkan', /^Ditetapkan di /, 'optional', 'trim'],
//     ['_tanggalDitetapkan', padaTaggalRegexp, 'optional', padaTaggalExtractRegexp],
//     ['_tempatDisahkan', /^Disahkan di /, 'optional', 'trim'],
//     ['_tanggalDisahkan', padaTaggalRegexp, 'optional', padaTaggalExtractRegexp],
//     ['_jabatanPengesah', /^(GUBERNUR|PRESIDEN)/, 'optional'],
//     ['_namaPengesah', /^ttd$/, 'optional', 'trim'],
//     ['_tempatDiundangkan', /^Diundangkan di/, 'optional', 'trim'],
//     ['_sekretaris', /^SEKRETARIS/, 'optional'],
//     ['_dokumen', /^(LEMBARAN NEGARA|BERITA DAERAH)/, 'optional'],
//     ['salinanSesuaiDenganAslinya', /^Salinan sesuai dengan aslinya/, 'optional'],
//     ['penjelasan', /^PENJELASAN/, 'optional'],
//   ];
//   const extract_result = extractLines(lines, extractors);
//   const nomor_tahun = extract_result._nomor?.[0]
//     ?.toLowerCase()
//     .replace('nomor', '')
//     .replace('tahun', '')
//     .split(' ')
//     .filter((x) => x !== '')
//     .map((x) => parseInt(x));
//   const doc: Document = {
//     ...mapValues(extract_result, (x) => x?.join(' ').trim()),
//     _node: documentNode,
//     babs: getBabs(extract_result.babs),
//     _pemutus: extract_result._pemutus?.join(' ').slice(0, -1).trim(),
//     _sekretaris: extract_result._sekretaris?.filter((x) => x !== 'ttd').join(' '),
//     _nomor: nomor_tahun?.[0],
//     _tahun: nomor_tahun?.[1],
//     _tanggalDiundangkan: extract_result._tempatDiundangkan?.[1]
//       ?.replace(padaTaggalExtractRegexp, '')
//       .trim(),
//     _tempatDiundangkan: extract_result._tempatDiundangkan?.[0]?.trim(),
//     _denganPersetujuan: extract_result._denganPersetujuan?.filter((x) => x !== 'DAN').slice(1),
//     mengingat: toMengimbang(extract_result.mengingat, mengingatRegex),
//     menimbang: toMengimbang(extract_result.menimbang, menimbangRegex),
//     penjelasan: extract_result.penjelasan,
//   };

//   return doc;
// }

// function toMengimbang(lines: string[] | undefined, regex: RegExp): Metadata | undefined {
//   if (isNil(lines)) return undefined;
//   const points = getPoints(removeKeyFromLines(lines, regex));
//   const text = stringToEmptyReference(lines.join(' '));

//   return { text, points };
// }

// // Babs
// const babStartRegexp = /^BAB /;

// export function getBabKey(line?: string): number | undefined {
//   if (isNil(line)) {
//     return undefined;
//   }

//   try {
//     return toArabic(line.replace(babStartRegexp, ''));
//   } catch {
//     return undefined;
//   }
// }

// function getBabs(lines?: string[]): Bab[] | undefined {
//   if (isNil(lines) || getBabKey(lines[0]) !== 1) {
//     return undefined;
//   }
//   const babsLines = extractIncLines(lines, getBabKey);

//   return babsLines.map(toBabs);
// }

// function toBabs({ _key, lines }: { _key: number; lines: string[] }): Bab {
//   const extractors: Extractor<'keyJudul' | 'isiLines'>[] = [
//     ['keyJudul', /.*/, 'required'],
//     ['isiLines', /[a-z]+/, 'required'],
//   ];
//   const { keyJudul, isiLines } = extractLines(lines, extractors);

//   if (!keyJudul || !isiLines) {
//     throw Error(`JUDUL OR ISI NOT FOUND: ${keyJudul} ${isiLines}`);
//   }
//   const _judul = keyJudul.slice(1).join(' ');
//   const isi = getBagians(isiLines) ?? getPasals(isiLines);
//   // const text = lines.join(' ');

//   return { _type: 'bab', _key, _judul, isi };
// }

// /**
//  * Bagians
//  */
// const bagianRegex = /^Bagian /;

// function getBagianKey(line?: string): number | undefined {
//   if (!line || !bagianRegex.test(line)) {
//     return undefined;
//   }
//   const bagianKeyStr = line.replace(bagianRegex, '');
//   if (bagianKeyStr === 'Kesatu' || bagianKeyStr === 'Pertama') return 1;
//   if (bagianKeyStr === 'Kedua') return 2;
//   if (bagianKeyStr === 'Ketiga') return 3;
//   if (bagianKeyStr === 'Keempat') return 4;
//   if (bagianKeyStr === 'Kelima') return 5;
//   if (bagianKeyStr === 'Keenam') return 6;
//   if (bagianKeyStr === 'Ketujuh') return 7;
//   if (bagianKeyStr === 'Kedelapan') return 8;
//   if (bagianKeyStr === 'Kesembilan') return 9;
//   if (bagianKeyStr === 'Kesepuluh') return 10;
//   if (bagianKeyStr === 'Kesebelas') return 11;
//   throw Error(`Bagian key ${bagianKeyStr} is unknown on line: ${line}`);
// }

// function getBagians(linas: string[]): Bagian[] | undefined {
//   const firstBagianKey = getBagianKey(linas[0]);
//   if (firstBagianKey !== 1) return undefined;
//   const bagiansLines = extractIncLines(linas, getBagianKey);

//   return bagiansLines.map(_linesToBagian);
// }

// function _linesToBagian({ _key, lines }: IncLines): Bagian {
//   const extractors: Extractor<'keyJudul' | 'pasalStart' | 'paragrafStart'>[] = [
//     ['keyJudul', /.*/, 'required'],
//     ['pasalStart', pasalRegex, 'optional'],
//     ['paragrafStart', paragrafRegex, 'optional'],
//   ];
//   const { keyJudul, pasalStart, paragrafStart } = extractLines(lines.slice(1), extractors);

//   if (!keyJudul) {
//     throw Error(`${lines}`);
//   }
//   const isiLines = flatMap(compact([pasalStart, paragrafStart]));
//   const isi = getParagrafs(isiLines) ?? getPasals(isiLines);
//   // const text = lines.join(' ');
//   const _judul = removeKeyFromLines(keyJudul, bagianRegex).join(' ');

//   return { _type: 'bagian', _key, _judul, isi };
// }

// /**
//  * Paragraf
//  */
// const paragrafRegex = /^Paragraf /;

// function getParagrafKey(line?: string): number | undefined {
//   if (isNil(line)) return undefined;
//   if (!paragrafRegex.test(line)) return undefined;

//   return safeParseInt(line?.replace(paragrafRegex, ''));
// }

// function getParagrafs(lines: string[]): Paragraf[] | undefined {
//   const [firstLine] = lines;
//   const firstKey = getParagrafKey(firstLine);
//   if (firstKey !== 1) return undefined;
//   const paragrafLines = extractIncLines(lines, getParagrafKey);

//   return paragrafLines.map(_linesToParagraf);
// }

// function _linesToParagraf(incLines: IncLines): Paragraf {
//   const { _key, lines } = incLines;
//   const extractors: Extractor<'keyJudul' | 'pasalLines'>[] = [
//     ['keyJudul', /.*/, 'required'],
//     ['pasalLines', pasalRegex, 'optional'],
//   ];
//   const { keyJudul, pasalLines } = extractLines(lines.slice(1), extractors);
//   if (!keyJudul) throw Error();
//   if (!pasalLines) throw Error();
//   const _judul = removeKeyFromLines(keyJudul, paragrafRegex).join(' ');
//   const isi = getPasals(pasalLines);
//   // const text = lines.join(' ');

//   return { _type: 'paragraf', _key, _judul, isi };
// }

// /**
//  * Pasal
//  */
// // dirty
// const pasalRegex = /^Pasa(l|i)\s?/;

// function getPasalKey(line?: string): number | undefined {
//   if (isUndefined(line)) return undefined;
//   if (pasalRegex.test(line)) {
//     // dirty
//     const keyStr = line.replace(pasalRegex, '');
//     const goodResult = safeParseInt(keyStr);
//     if (!isUndefined(goodResult)) return goodResult;
//   }
//   return undefined;
// }

// function getPasals(lines: string[]): Pasal[] {
//   const [firstLine] = lines;
//   if (isNil(getPasalKey(firstLine))) throw Error(firstLine);

//   return extractIncLines(lines, getPasalKey, isAmendLines).map(_linesToPasal);
// }

// function isAmendLines(_lines: string[]): boolean {
//   const x = amendPasalRegex.test(_lines.slice(1).join(' '));
//   if (x) console.log(_lines[1]);
//   return x;
// }

// const amendPasalRegex = /^Beberapa ketentuan dalam Undang-Undang/;

// function _linesToPasal(incLines: IncLines): Pasal {
//   const { _key, lines } = incLines;
//   const isiLines = lines.slice(1);
//   const isi =
//     getAyats(isiLines) ?? getPoints(isiLines) ?? stringToEmptyReference(isiLines.join(' '));
//   return { _type: 'pasal', _key, isi };
// }

// // function getAmendPoints(lines: string[]): Points | undefined {
// //   if (!amendPasalRegex.test(lines.join(' '))) return undefined;
// //   return chain(lines)
// //     .reduce<AmendDescAcc>(
// //       (prev, line) => {
// //         const descLines = prev.isDone ? prev.descLines : [...prev.descLines, line];
// //         const isiLines = prev.isDone ? [...prev.isiLines, line] : prev.isiLines;
// //         const isDone = prev.isDone
// //           ? true
// //           : /sebagai berikut/.test(`${prev.descLines.slice(-1)[0]} ${line}`);
// //         return { descLines, isiLines, isDone };
// //       },
// //       { descLines: [], isiLines: [], isDone: false }
// //     )
// //     .thru(({ descLines, isiLines }) =>
// //       _getPoints('numPoint', isiLines, descLines.join(' '), () => true)
// //     )
// //     .value();
// // }

// // type AmendDescAcc = {
// //   descLines: string[];
// //   isiLines: string[];
// //   isDone: boolean;
// // };

// /**
//  * Ayat
//  */
// const ayatRegexp = /^\([0-9]+\)/;

// // dirty
// function getAyatKey(line?: string, prevKey?: number): number | undefined {
//   if (isUndefined(line)) return undefined;
//   const firstMatch = line?.match(ayatRegexp)?.[0];
//   if (!isUndefined(firstMatch)) {
//     // `(42)` -> 42
//     return safeParseInt(firstMatch?.slice(1, -1));
//   }
//   if (!isUndefined(prevKey)) {
//     const dirtyAyatRegexp = /^\([0-9]+ /;
//     const firstDirtyMatches = line?.match(dirtyAyatRegexp)?.[0];
//     if (!isUndefined(firstDirtyMatches)) {
//       // `(21 ` -> 2
//       const cleanedKey = safeParseInt(line.split(' ')?.[0]?.slice(1, -1));
//       if (!isUndefined(cleanedKey) && cleanedKey === prevKey + 1) {
//         return cleanedKey;
//       }
//     }
//   }
//   return undefined;
// }

// function getAyats(lines: string[]): Ayat[] | undefined {
//   const firstKey = getAyatKey(lines[0]);
//   if (firstKey !== 1) return undefined;
//   const ayatsLines = extractIncLines(lines, getAyatKey);

//   return ayatsLines.map(_linesToAyat);
// }

// function _linesToAyat({ _key, lines }: IncLines): Ayat {
//   const linesWithoutKey = removeKeyFromLines(lines, ayatRegexp);
//   const isi = getPoints(linesWithoutKey);
//   const text = stringToEmptyReference(linesWithoutKey.join(' '));

//   return { _type: 'ayat', _key, isi, text };
// }

// /**
//  * Point
//  */
// // I to handle 1
// const numPointRegexp = ;

// function getNumPointKey(line?: string): number | undefined {
//   const numberExtractRegexp = ;
//   const numberStr =
// line?.match(/^[0-9I]+\s?[0-9]?([.)]|$)/)?.[0]?.match(/^[0-9I]+\s?[0-9]?/)?.[0];

//   return safeParseInt(numberStr);
// }

// const alphaPointRegexp = /^[a-z][.)]/;

// function getAlphaPointKey(line?: string): number | undefined {
//   const matches = line?.match(alphaPointRegexp);
//   const firstMatch = matches?.[0];

//   return firstMatch?.charCodeAt(0);
// }

// function getPoints(lines: string[]): Points | undefined {
//   for (const [lineIdx, line] of lines.entries()) {
//     const isi = lines.slice(lineIdx);
//     const descriptionLines = lines.slice(0, lineIdx);
//     const description = descriptionLines.join(' ');

//     if (getNumPointKey(line) === 1) {
//       return _getPoints('numPoint', isi, description);
//     }

//     if (getAlphaPointKey(line) === 'a'.charCodeAt(0)) {
//       return _getPoints('alphaPoint', isi, description);
//     }
//   }

//   return undefined;
// }

// function getGetKeyInt(
//   _type: 'numPoint' | 'alphaPoint'
// ): {
//   regexp: RegExp;
//   getKeyInt: (string: string) => number | undefined;
//   getKey?: (int: number) => number | string;
// } {
//   switch (_type) {
//     case 'numPoint':
//       return { regexp: numPointRegexp, getKeyInt: getNumPointKey };
//     case 'alphaPoint':
//       return {
// regexp: alphaPointRegexp, getKeyInt: getAlphaPointKey, getKey: String.fromCharCode };
//   }
// }

// function _getPoints(
//   _type: 'numPoint' | 'alphaPoint',
//   isiLines: string[],
//   __description: string,
// ): Points {
// const toDetect = isiLines.slice(10).join(' ') ?? '';
// const skip: [boolean, number] | undefined = amendRegex.test(toDetect) ? [true, 2] : undefined;
// if (!isUndefined(skip)) {
//   console.log(toDetect);
//   console.log('===');
// }
// const isi = getPointsContent(_type, isiLines);
// const textLines = [__description, ...isiLines];
// const text = textLines.filter((x) => !isEmpty(x)).join(' ');
// const _description = stringToEmptyReference(__description);

// return { _type: 'points', _description, text, isi };
// }

// function getPointsContent(
//   _type: 'numPoint' | 'alphaPoint',
//   isiLines: string[],
// ): Point[] {
//   const { getKeyInt } = getGetKeyInt(_type);
//   return extractIncLines(isiLines, getKeyInt, shouldSkip).map(getPointIsi(_type));
// }

// const getPointIsi = curry(_getPointIsi);

// function _getPointIsi(_type: 'numPoint' | 'alphaPoint', { _key, lines }: IncLines): Point {
//   const { getKey, regexp } = getGetKeyInt(_type);
//   const __key = isUndefined(getKey) ? _key : getKey(_key);
//   const linesWithoutKey = removeKeyFromLines(lines, regexp);
//   const isi = getPoints(linesWithoutKey);
//   const text = stringToEmptyReference(linesWithoutKey.join(' '));
//   const point: Point = { _type, _key: __key, isi, text };

//   return point;
// }

// type Extractor<T> =
//   | [T, RegExp, 'optional' | 'required']
//   | [T, RegExp, 'optional' | 'required', 'trim']
//   | [T, RegExp, 'optional' | 'required', RegExp];

// function extractLines<T extends string>(
//   lines: string[],
//   extractors: Extractor<T>[]
// ): { [P in T]?: string[] } {
//   let curExtractorIdx = 0;
//   const result: { [P in T]?: string[] } = {};

//   for (let line of lines) {
//     for (const [candidateExtractorIdx, candidateExtractor] of extractors.entries()) {
//       if (candidateExtractorIdx <= curExtractorIdx) continue;
//       const [, extractorRegexp, optionalOption, trimOption] = candidateExtractor;

//       if (extractorRegexp.test(line)) {
//         curExtractorIdx = candidateExtractorIdx;
//         if (!isUndefined(trimOption)) {
//           if (trimOption === 'trim') {
//             line = line.replace(extractorRegexp, '');
//           } else {
//             line = line.replace(trimOption, '');
//           }
//         }
//       } else if (optionalOption !== 'optional') {
//         break;
//       }
//     }
//     const extractorName = extractors[curExtractorIdx]?.[0];

//     if (extractorName) {
//       const extractorLines = result[extractorName] ?? [];
//       result[extractorName] = [...extractorLines, line];
//     } else {
//       throw Error(`Index out of range ${curExtractorIdx}`);
//     }
//   }

//   return result;
// }

// type IncLines = { _key: number; lines: string[] };

// function extractIncLines(
//   lines: string[],
//   keyOf: (string: string, prev?: number) => number | undefined,
//   shouldSkip?: (lines: string[]) => boolean
// ): IncLines[] {
//   const elements: IncLines[] = [{ _key: -1, lines: [] }];
//   let prevKey: number | undefined = undefined;
//   let skipKey: number | undefined = undefined;
//   let shouldBlockSkip: boolean | undefined = undefined;

//   lines.forEach((line, _idx) => {
//     const lineKey = keyOf(line, prevKey);

//     if (!isNil(lineKey)) {
//       if (!prevKey || lineKey === prevKey + 1) {
//         if (!prevKey) {
//           skipKey = lineKey + 1;
//         }
//         if (isUndefined(shouldSkip)) {
//           prevKey = lineKey;
//           const newElement = { _key: lineKey, lines: [] };
//           elements.push(newElement);
//         } else {
//           shouldBlockSkip ??= shouldSkip(lines.slice(_idx));
//           if (!shouldBlockSkip || lineKey !== skipKey) {
//             prevKey = lineKey;
//             const newElement = { _key: lineKey, lines: [] };
//             elements.push(newElement);
//           } else if (lineKey === skipKey) {
//             skipKey++;
//             shouldBlockSkip = shouldSkip(lines.slice(_idx));
//           }
//         }
//       }
//     }
//     elements[elements.length - 1]?.lines.push(line);
//   });

//   return elements.filter(({ lines, _key }) => !isEmpty(lines) && _key !== -1);
// }

// function safeParseInt(string: string | undefined): number | undefined {
//   if (isNil(string)) return undefined;

//   const correctionMap = {
//     I: '1',
//     T: '7',
//   };

//   try {
//     const initialString = string.replaceAll(' ', '');
//     const clearString = chain(correctionMap)
//       .toPairs()
//       .reduce((prev, [dirty, clean]) => prev.replaceAll(dirty, clean), initialString)
//       .value();

//     const parseResult = parseInt(clearString);

//     if (!/^[0-9]+$/.test(clearString) && clearString.includes('15')) {
//       return undefined;
//     }

//     if (isNaN(parseResult)) return undefined;

//     return parseResult;
//   } catch {
//     return undefined;
//   }
// }

// function removeKeyFromLines(lines: string[] | undefined, keyRegexp: RegExp): string[] {
//   if (isNil(lines)) throw Error();
//   const [firstLine] = lines;
//   const firstLineWithoutKey = firstLine?.replace(keyRegexp, '').trim();
//   const restOfLines = lines.slice(1);
//   const resultLines = [firstLineWithoutKey, ...restOfLines];

//   return compact(resultLines).filter(isNotEmpty);
// }

// function isNotEmpty(string: string): boolean {
//   return !isEmpty(string);
// }

// function stringToEmptyReference(text: string): ReferenceText {
//   return { _type: 'referenceText', references: [], text };
// }

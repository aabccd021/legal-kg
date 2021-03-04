import { isUndefined, max, min } from 'lodash';
import { DocumentNode } from '../legal/document/index';
import { getDocumentData, getDocumentFilePath } from '../data';
import { readFileSync, writeFileSync } from 'fs';
import { Accumulator, neverNum, Span, toSpansWith } from '../util';
import { toArabic } from 'roman-numerals';

function pdfDataToJson(): void {
  getDocumentData('pdf-data').forEach(writeToJson);
  console.log('\ndone');
}

function writeToJson(pdfNode: DocumentNode): void {
  console.log('start', pdfNode);
  const dataFile = getDocumentFilePath(pdfNode, 'pdf-data');
  const jsonFile = getDocumentFilePath(pdfNode, 'jsonv2');
  const spans: Span[] = JSON.parse(readFileSync(dataFile.path).toString());
  const rawJson = spans.reduce<Accumulator<ExtractedKey>>(toSpansWith(reduceFlag), {
    spans: {},
    flag: 'preBab',
  });
  const log = rawJson.spans.babs?.reduce(toFoo, {
    bab: 0,
    bagian: 0,
    paragraf: 0,
    pasal: 0,
    xlsAfterPasal: [],
  });
  const output = {
    bab: log?.bab,
    bagian: log?.bagian,
    paragraf: log?.paragraf,
    pasal: log?.pasal,
    xlrange: (max(log?.xlsAfterPasal) ?? neverNum()) - (min(log?.xlsAfterPasal) ?? neverNum()),
    xlsAfterPasal: [],
    preBab: rawJson.spans.preBab?.length,
    babs: rawJson.spans.babs?.length,
    penjelasan: rawJson.spans.penjelasan?.length,
  };
  writeFileSync(jsonFile.path, JSON.stringify(output, undefined, 2));
}

type ExtractedKey = 'preBab' | 'babs' | 'penjelasan';

function reduceFlag(oldFlag: ExtractedKey, span: Span): ExtractedKey {
  if (oldFlag === 'preBab' && isBabSpansStart(span)) return 'babs';
  if (oldFlag === 'babs' && isPenjelasanSpansStart(span)) return 'penjelasan';
  return oldFlag;
}

function isBabSpansStart(span: Span): boolean {
  return span.str.replaceAll(' ', '') === 'BABI';
}
function isPenjelasanSpansStart(span: Span): boolean {
  return span.str.replaceAll('', '') === 'PENJELASAN';
}

type Acc = {
  bab: number;
  bagian: number;
  paragraf: number;
  pasal: number;
  xlsAfterPasal: number[];
};

function toFoo(acc: Acc, span: Span, idx: number, spans: Span[]): Acc {
  const { bab, bagian, paragraf, pasal, xlsAfterPasal } = acc;

  const newBabKey = babKeyOfSpan(span);
  if (newBabKey === bab + 1) return { ...acc, bab: newBabKey };

  const newBagianKey = bagianKeyOfSpan(span);
  if (newBagianKey === bagian + 1 || newBagianKey === 1) return { ...acc, bagian: newBagianKey };

  const newParagrafKey = paragrafKeyOfSpan(span);
  if (newParagrafKey === paragraf + 1 || newParagrafKey === 1)
    return { ...acc, paragraf: newParagrafKey };

  const newPasalKey = pasalKeyOfSpan(span);
  const xlAfterPasal = spans.slice(idx)[0]?.xL;
  const newXLAfterPasal: number[] =
    isUndefined(newPasalKey) || isUndefined(xlAfterPasal)
      ? xlsAfterPasal
      : [...xlsAfterPasal, xlAfterPasal];
  if (newPasalKey === pasal + 1)
    return { ...acc, pasal: newPasalKey, xlsAfterPasal: newXLAfterPasal };

  return { ...acc, xlsAfterPasal: newXLAfterPasal };
}

function babKeyOfSpan(span: Span): number | undefined {
  try {
    return toArabic(span.str.replace(/^BAB ?/, ''));
  } catch {
    return undefined;
  }
}

function bagianKeyOfSpan(span: Span): number | undefined {
  const { str } = span;
  if (!/^Bagian /.test(str)) return undefined;
  const keyStr = str.replace(/^Bagian /, '');
  if (keyStr === 'Kesatu' || keyStr === 'Pertama') return 1;
  if (keyStr === 'Kedua') return 2;
  if (keyStr === 'Ketiga') return 3;
  if (keyStr === 'Keempat') return 4;
  if (keyStr === 'Kelima') return 5;
  if (keyStr === 'Keenam') return 6;
  if (keyStr === 'Ketujuh') return 7;
  if (keyStr === 'Kedelapan') return 8;
  if (keyStr === 'Kesembilan') return 9;
  if (keyStr === 'Kesepuluh') return 10;
  if (keyStr === 'Kesebelas') return 11;
  throw Error(`Bagian key ${keyStr} is unknown on line: ${str}`);
}

function paragrafKeyOfSpan(span: Span): number | undefined {
  const { str } = span;
  if (!/^Paragraf /.test(str)) return undefined;
  return safeParseInt(str?.replace(/^Paragraf /, ''));
}

function pasalKeyOfSpan(span: Span): number | undefined {
  const { str } = span;
  if (/^Pasal ?/.test(str)) return safeParseInt(str.replace(/^Pasal ?/, ''));
  return undefined;
}

function safeParseInt(str: string | undefined): number | undefined {
  if (isUndefined(str)) return undefined;
  if (!/^[0-9]+$/.test(str)) return undefined;
  try {
    const parseResult = parseInt(str);
    if (isNaN(parseResult)) return undefined;
    return parseResult;
  } catch {
    return undefined;
  }
}

pdfDataToJson();

import { chain, curry, isUndefined, mean } from 'lodash';
import { DocumentNode } from '../legal/document/index';
import { getDocumentData, getDocumentFilePath } from '../data';
import { readFileSync, writeFileSync } from 'fs';
import { Accumulator, Span, toSpansWith } from '../util';
import {
  babKeyOfSpan,
  bagianKeyOfSpan,
  paragrafKeyOfSpan,
  pasalKeyOfSpan,
} from './parse_key_from_spans';

function pdfDataToJson(): void {
  getDocumentData('pdf-data').forEach(writeToJson);
  console.log('\ndone');
}

function writeToJson(pdfNode: DocumentNode): void {
  console.log('\nstart', pdfNode);
  const dataFile = getDocumentFilePath(pdfNode, 'pdf-data');
  const jsonFile = getDocumentFilePath(pdfNode, 'jsonv2');
  const spans: Span[] = JSON.parse(readFileSync(dataFile.path).toString());
  const rawJson = spans.reduce<Accumulator<ExtractedKey>>(toSpansWith(reduceFlag), {
    spans: {},
    flag: 'preBab',
  });
  const babsSpans = rawJson.spans.babs ?? [];
  const { bab, bagian, paragraf, pasal } = getKeys(babsSpans);

  writeFileSync(jsonFile.path, JSON.stringify({ bab, bagian, paragraf, pasal }, undefined, 2));
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
  pasal?: number;
  pasalXls: number[];
  afterNonPasal: boolean;
};

function getKeys(spans: Span[]): Acc {
  const initialAcc: Acc = {
    bab: 0,
    bagian: 0,
    paragraf: 0,
    pasalXls: [],
    afterNonPasal: false,
  };
  const hasAmendPasal = spansHasAmendPasal(spans);
  return spans.reduce(toKeysWith(hasAmendPasal), initialAcc);
}

const toKeysWith = curry(toKeys);

function toKeys(hasAmendPasal: boolean, acc: Acc, span: Span, idx: number, spans: Span[]): Acc {
  const { bab, bagian, paragraf, pasal, afterNonPasal, pasalXls } = acc;

  const newBabKey = babKeyOfSpan(span);
  if (newBabKey === bab + 1) return { ...acc, bab: newBabKey, afterNonPasal: true };

  const newBagianKey = bagianKeyOfSpan(span);
  if (newBagianKey === bagian + 1 || newBagianKey === 1)
    return { ...acc, bagian: newBagianKey, afterNonPasal: true };

  const newParagrafKey = paragrafKeyOfSpan(span);
  if (newParagrafKey === paragraf + 1 || newParagrafKey === 1) {
    return { ...acc, paragraf: newParagrafKey, afterNonPasal: true };
  }

  const newAfterPasal = spans[idx + 1];
  if (isUndefined(newAfterPasal)) return acc;
  const newPasalKey = pasalKeyOfSpan(span);

  if (isUndefined(pasal)) {
    if (newPasalKey === 1) {
      return {
        ...acc,
        pasal: newPasalKey,
        afterNonPasal: false,
        pasalXls: [...pasalXls, newAfterPasal.xL],
      };
    }
  } else if (newPasalKey === pasal + 1) {
    const delta = Math.abs(newAfterPasal.xL - mean(pasalXls));
    const newAcc: Acc = {
      ...acc,
      pasal: newPasalKey,
      afterNonPasal: false,
      pasalXls: [...pasalXls, newAfterPasal.xL],
    };
    if (
      !hasAmendPasal ||
      delta < 13 ||
      afterNonPasal ||
      newAfterPasal.str.startsWith('Beberapa ketentuan')
    ) {
      return newAcc;
    }

    const lastPasalXl = pasalXls.slice(-1)[0];
    if (!isUndefined(lastPasalXl) && Math.abs(newAfterPasal.xL - lastPasalXl) < 1) {
      console.log(`===IRREGULAR_PASAL ${newPasalKey}===`);
      console.log('span:', span);
      console.log('afterPasal:', newAfterPasal);
      console.log('delta:', delta);
      console.log('===\n');
      return newAcc;
    }
  }
  return acc;
}

function getStandardDeviation(array: number[]): number {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

function spansHasAmendPasal(spans: Span[]): boolean {
  return chain(spans)
    .reduce<number[]>((xls, span, idx, spans) => {
      if (isUndefined(pasalKeyOfSpan(span))) return xls;
      const afterPasal = spans[idx + 1];
      if (isUndefined(afterPasal)) return xls;
      return [...xls, afterPasal.xL];
    }, [])
    .thru(getStandardDeviation)
    .thru((std) => std > 6)
    .value();
}

pdfDataToJson();

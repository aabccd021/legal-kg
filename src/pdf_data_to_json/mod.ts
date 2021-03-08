import { chain, curry, isUndefined, mean, isEmpty } from 'lodash';
import { DocumentNode } from '../legal/document/index';
import { getDocumentData, getDocumentFilePath } from '../data';
import { readFileSync, writeFileSync } from 'fs';
import { Accumulator, lastOf, Span, toSpansWith } from '../util';
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
  const { babs: bab, bagians: bagian, paragrafs: paragraf, pasals: pasal } = getKeys(babsSpans);

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
  babs: SpanKeyIdx[];
  bagians: SpanKeyIdx[];
  paragrafs: SpanKeyIdx[];
  pasals: PasalSpanKeyIdx[];
  afterNonPasal: boolean;
};

function getKeys(spans: Span[]): Acc {
  const initialAcc: Acc = {
    babs: [],
    bagians: [],
    paragrafs: [],
    pasals: [],
    afterNonPasal: false,
  };
  const hasAmendPasal = spansHasAmendPasal(spans);
  return spans.reduce(toKeysWith(hasAmendPasal), initialAcc);
}

type SpanKeyIdx = { key: number; spanId: number };
type PasalSpanKeyIdx = SpanKeyIdx & { afterPasalXl: number };

const toKeysWith = curry(toKeys);

function toKeys(hasAmendPasal: boolean, acc: Acc, span: Span, idx: number, spans: Span[]): Acc {
  const { babs, bagians, paragrafs, pasals, afterNonPasal } = acc;

  const newBabKey = babKeyOfSpan(span);
  if (!isUndefined(newBabKey)) {
    if ((newBabKey === 1 && isEmpty(babs)) || newBabKey - 1 === lastOf(babs)?.key) {
      return {
        ...acc,
        afterNonPasal: true,
        babs: [...babs, { key: newBabKey, spanId: span.id }],
      };
    }
  }

  const newBagianKey = bagianKeyOfSpan(span);
  if (!isUndefined(newBagianKey)) {
    if (newBagianKey === 1 || newBagianKey - 1 === lastOf(bagians)?.key) {
      return {
        ...acc,
        afterNonPasal: true,
        bagians: [...bagians, { key: newBagianKey, spanId: span.id }],
      };
    }
  }

  const newParagrafKey = paragrafKeyOfSpan(span);
  if (!isUndefined(newParagrafKey)) {
    if (newParagrafKey === 1 || newParagrafKey - 1 === lastOf(paragrafs)?.key) {
      return {
        ...acc,
        paragrafs: [...paragrafs, { key: newParagrafKey, spanId: span.id }],
        afterNonPasal: true,
      };
    }
  }

  const newAfterPasal = spans[idx + 1];
  const newPasalKey = pasalKeyOfSpan(span);
  if (isUndefined(newAfterPasal) || isUndefined(newPasalKey)) return acc;

  const newAcc: Acc = {
    ...acc,
    afterNonPasal: false,
    pasals: [...pasals, { key: newPasalKey, spanId: span.id, afterPasalXl: newAfterPasal.xL }],
  };

  if (newPasalKey === 1 && isEmpty(pasals)) return newAcc;
  const lastPasal = lastOf(pasals);
  if (newPasalKey - 1 === lastPasal?.key) {
    if (
      !hasAmendPasal ||
      afterNonPasal ||
      newAfterPasal.str.startsWith('Beberapa ketentuan') ||
      Math.abs(newAfterPasal.xL - mean(pasals.map(({ afterPasalXl }) => afterPasalXl)))
    ) {
      return newAcc;
    }

    if (
      !isUndefined(lastPasal.afterPasalXl) &&
      Math.abs(newAfterPasal.xL - lastPasal.afterPasalXl) < 1
    ) {
      console.log(`===IRREGULAR_PASAL ${newPasalKey}===`);
      console.log('span:', span);
      console.log('afterPasal:', newAfterPasal);
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

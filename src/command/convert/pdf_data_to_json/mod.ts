import { SpanOf } from '../../../util';
import { DocumentNode } from '../../../legal/document/index';
import { getDocumentData, nodeToFile } from '../../../data';
import { readFileSync, writeFileSync } from 'fs';
import { Accumulator, Span, toSpansWith } from '../../../util';
import { babsSpansToKeyIds } from './scan';
import { chain, isUndefined } from 'lodash';
import { pasalKeyOfSpan } from './parse_key_from_spans';
import * as yaml from 'js-yaml';
import { spansToDocument } from './spans_to_component';

function pdfDataToJson(): void {
  getDocumentData('pdf-data').forEach(writeToJson);
  console.log('\ndone');
}

function writeToJson(documentNode: DocumentNode): void {
  console.log('\nstart', documentNode);

  console.time(`TIME ${JSON.stringify(documentNode)} init`);
  const dataFile = nodeToFile('pdf-data', documentNode);
  const jsonFile = nodeToFile('yaml', documentNode);
  const pdfSpans: Span[] = JSON.parse(readFileSync(dataFile.path).toString());
  console.timeEnd(`TIME ${JSON.stringify(documentNode)} init`);

  console.time(`TIME ${JSON.stringify(documentNode)} spans`);
  const documentSpans = documentSpansOf(pdfSpans);
  console.timeEnd(`TIME ${JSON.stringify(documentNode)} spans`);

  console.time(`TIME ${JSON.stringify(documentNode)} hasAmendPasal`);
  const hasAmendPasal = spansHasAmendPasal(documentSpans.babs);
  console.timeEnd(`TIME ${JSON.stringify(documentNode)} hasAmendPasal`);

  console.time(`TIME ${JSON.stringify(documentNode)} keyIds`);
  const keyIds = babsSpansToKeyIds(hasAmendPasal, documentSpans.babs);
  console.timeEnd(`TIME ${JSON.stringify(documentNode)} keyIds`);

  console.time(`TIME ${JSON.stringify(documentNode)} babs`);
  const document = spansToDocument({ hasAmendPasal, keyIds, documentNode }, documentSpans.babs);
  console.timeEnd(`TIME ${JSON.stringify(documentNode)} babs`);

  console.time(`TIME ${JSON.stringify(documentNode)} detect`);
  // const detectedDocument = rawJsonToJson(document);
  console.timeEnd(`TIME ${JSON.stringify(documentNode)} detect`);

  writeFileSync(jsonFile.path, yaml.dump(document));
}

type DocumentExtractedKey = 'preBab' | 'babs' | 'penjelasan';

function documentSpansOf(spans: Span[]): SpanOf<DocumentExtractedKey> {
  const initialExtraction: Accumulator<DocumentExtractedKey> = {
    spans: { babs: [], preBab: [], penjelasan: [] },
    flag: 'preBab',
  };
  return spans.reduce(toSpansWith(reduceFlag), initialExtraction).spans;
}

function reduceFlag(oldFlag: DocumentExtractedKey, span: Span): DocumentExtractedKey {
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

function getStandardDeviation(array: number[]): number {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

pdfDataToJson();

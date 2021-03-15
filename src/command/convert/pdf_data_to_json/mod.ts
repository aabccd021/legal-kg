import { SpanOf } from '../../../util';
import { DocumentNode } from '../../../legal/document/index';
import { getDocumentData, getDocumentFilePath } from '../../../data';
import { readFileSync, writeFileSync } from 'fs';
import { Accumulator, Span, toSpansWith } from '../../../util';
import { babsSpansToKeyIds as keyIdsOfBabSpans } from './babs_spans_to_key_ids';
import { babsOfKeyIds } from './key_ids_to_babs';
import { chain, isUndefined } from 'lodash';
import { pasalKeyOfSpan } from './parse_key_from_spans';
import { Document } from '../../../legal/document/index';
import * as yaml from 'js-yaml';
import { rawJsonToJson } from './raw_json_to_json';

function pdfDataToJson(): void {
  getDocumentData('pdf-data').forEach(writeToJson);
  console.log('\ndone');
}

function writeToJson(documentNode: DocumentNode): void {
  console.log('\nstart', documentNode);

  console.time(`${JSON.stringify(documentNode)} init`);
  const dataFile = getDocumentFilePath(documentNode, 'pdf-data');
  const jsonFile = getDocumentFilePath(documentNode, 'yaml');
  const pdfSpans: Span[] = JSON.parse(readFileSync(dataFile.path).toString());
  console.timeEnd(`${JSON.stringify(documentNode)} init`);

  console.time(`${JSON.stringify(documentNode)} spans`);
  const documentSpans = documentSpansOf(pdfSpans);
  console.timeEnd(`${JSON.stringify(documentNode)} spans`);

  console.time(`${JSON.stringify(documentNode)} hasAmendPasal`);
  const hasAmendPasal = spansHasAmendPasal(documentSpans.babs);
  console.timeEnd(`${JSON.stringify(documentNode)} hasAmendPasal`);

  console.time(`${JSON.stringify(documentNode)} keyIds`);
  const babKeyIds = keyIdsOfBabSpans(hasAmendPasal, documentSpans.babs);
  console.timeEnd(`${JSON.stringify(documentNode)} keyIds`);

  console.time(`${JSON.stringify(documentNode)} babs`);
  const babs = babsOfKeyIds({ hasAmendPasal, keyIds: babKeyIds }, documentSpans.babs);
  console.timeEnd(`${JSON.stringify(documentNode)} babs`);

  console.time(`${JSON.stringify(documentNode)} detect`);
  const document: Document = { _node: documentNode, babs };
  const detectedDocument = rawJsonToJson(document);
  console.timeEnd(`${JSON.stringify(documentNode)} detect`);

  writeFileSync(jsonFile.path, yaml.dump(detectedDocument));
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

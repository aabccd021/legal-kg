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
import { rawJsonToJson } from './raw_json_to_json';

function pdfDataToJson(): void {
  getDocumentData('pdf-data').forEach(writeToJson);
  console.log('\ndone');
}

function writeToJson(documentNode: DocumentNode): void {
  console.log('\nstart', documentNode);
  const dataFile = getDocumentFilePath(documentNode, 'pdf-data');
  const jsonFile = getDocumentFilePath(documentNode, 'jsonv2');
  const pdfSpans: Span[] = JSON.parse(readFileSync(dataFile.path).toString());
  const documentSpans = documentSpansOf(pdfSpans);
  const hasAmendPasal = spansHasAmendPasal(documentSpans.babs);
  const babKeyIds = keyIdsOfBabSpans(hasAmendPasal, documentSpans.babs);
  const babs = babsOfKeyIds({ hasAmendPasal, keyIds: babKeyIds }, documentSpans.babs);
  const document: Document = { _node: documentNode, babs };
  const detectedDocument = rawJsonToJson(document);
  writeFileSync(jsonFile.path, JSON.stringify(detectedDocument, undefined, 2));
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

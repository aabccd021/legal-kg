import { SpanOf } from './../util';
import { DocumentNode } from '../legal/document/index';
import { getDocumentData, getDocumentFilePath } from '../data';
import { readFileSync, writeFileSync } from 'fs';
import { Accumulator, Span, toSpansWith } from '../util';
import { babsSpansToKeyIds as keyIdsOfBabSpans } from './babs_spans_to_key_ids';

function pdfDataToJson(): void {
  getDocumentData('pdf-data').forEach(writeToJson);
  console.log('\ndone');
}

function writeToJson(pdfNode: DocumentNode): void {
  console.log('\nstart', pdfNode);
  const dataFile = getDocumentFilePath(pdfNode, 'pdf-data');
  const jsonFile = getDocumentFilePath(pdfNode, 'jsonv2');
  const pdfSpans: Span[] = JSON.parse(readFileSync(dataFile.path).toString());
  const documentSpans = documentSpansOf(pdfSpans);
  const babKeyIds = keyIdsOfBabSpans(documentSpans.babs);
  writeFileSync(jsonFile.path, JSON.stringify(babKeyIds, undefined, 2));
  // const babs = babsOfKeyIds(babKeyIds, documentSpans.babs);
  // writeFileSync(jsonFile.path, JSON.stringify(babs, undefined, 2));
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

pdfDataToJson();

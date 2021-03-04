import { curry } from 'lodash';
import { DocumentNode } from '../legal/document/index';
import { getDocumentData, getDocumentFilePath } from '../data';
import { readFileSync, writeFileSync } from 'fs';
import { Span } from '../util';

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
  console.log(`babSpans: ${rawJson.spans.babs?.length}`);
  writeFileSync(jsonFile.path, JSON.stringify(rawJson, undefined, 2));
}

type ExtractedKey = 'preBab' | 'babs';

type Accumulator<T extends string> = { spans: { [P in T]?: Span[] }; flag: T };

const toSpansWith = curry(toSpans);

function toSpans<T extends string>(
  reduceFlag: (oldFlag: T, span: Span) => T,
  acc: Accumulator<T>,
  span: Span
): Accumulator<T> {
  const { flag, spans } = acc;
  const newFlag = reduceFlag(flag, span);
  const newSpan = [...(spans[newFlag] ?? []), span];
  const newSpans = { ...spans, [newFlag]: newSpan };
  return { ...acc, flag: newFlag, spans: newSpans };
}

function reduceFlag(oldFlag: ExtractedKey, span: Span): ExtractedKey {
  if (oldFlag === 'preBab' && isBabSpansStart(span)) return 'babs';
  return oldFlag;
}

function isBabSpansStart(span: Span): boolean {
  return span.str.replaceAll(' ', '') === 'BABI';
}

pdfDataToJson();

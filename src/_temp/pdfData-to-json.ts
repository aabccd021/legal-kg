import { DocumentNode } from '../legal/document/index';
import { getDocumentData, getDocumentFilePath } from '../data';
import { readFileSync, writeFileSync } from 'fs';
import { Span } from '../util';
import assertNever from 'assert-never';
import stringify from 'json-stable-stringify';

function pdfDataToJson(): void {
  getDocumentData('pdf-data').forEach(writeToJson);
  console.log('done');
}

function writeToJson(pdfNode: DocumentNode): void {
  console.log('start', pdfNode);
  const dataFile = getDocumentFilePath(pdfNode, 'pdf-data');
  const jsonFile = getDocumentFilePath(pdfNode, 'jsonv2');
  const spans: Span[] = JSON.parse(readFileSync(dataFile.path).toString());
  const initialAcc: Accumulator = {
    document: {
      preBab: [],
      babs: [],
    },
    flag: 'preBab',
  };
  const rawJson = spans.reduce<Accumulator>(toRawJson, initialAcc);
  console.log(`babSpans: ${rawJson.document.babs.length}`);
  writeFileSync(jsonFile.path, stringify(rawJson, { space: 2 }));
}

type Document = {
  preBab: Span[];
  babs: Span[];
};

type Flag = keyof Document;

type Accumulator = {
  document: Document;
  flag: Flag;
};

function toRawJson(acc: Accumulator, span: Span): Accumulator {
  const { flag, document } = acc;
  const newFlag = processFlag(flag, span);
  if (newFlag === 'preBab') {
    const newPreBab: Span[] = [...document.preBab, span];
    const newDocument: Document = { ...document, preBab: newPreBab };
    return { ...acc, document: newDocument };
  }
  if (newFlag === 'babs') {
    const newBabs: Span[] = [...document.babs, span];
    const newDocument: Document = { ...document, babs: newBabs };
    return { ...acc, document: newDocument };
  }
  assertNever(newFlag);
}

function processFlag(oldFlag: Flag, span: Span): Flag {
  if (oldFlag === 'preBab' && span.str.replaceAll(' ', '') === 'BABI') {
    return 'babs';
  }
  return oldFlag;
}

pdfDataToJson();

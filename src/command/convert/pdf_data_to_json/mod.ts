import { SpanOf } from '../../../util';
import { DocumentNode, Document, Disahkan } from '../../../legal/document/index';
import { getDocumentData, nodeToFile } from '../../../data';
import { readFileSync, writeFileSync } from 'fs';
import { Accumulator, Span, toSpansWith } from '../../../util';
import { babsSpansToKeyIds } from './scan';
import { chain, isUndefined } from 'lodash';
import { pasalKeyOfSpan, safeParseInt } from './parse_key_from_spans';
import * as yaml from 'js-yaml';
import { spansToBabSet, spansToMetadata, spansToStr } from './spans_to_component';

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
  const documentSpans = documentSpansOf(pdfSpans);
  const hasAmendPasal = spansHasAmendPasal(documentSpans.babs);
  const keyIds = babsSpansToKeyIds(hasAmendPasal, documentSpans.babs);
  const disahkan = spansToDisahkan(documentSpans.disahkan);
  const context = { hasAmendPasal, keyIds, documentNode, disahkan };
  const document: Document = {
    node: documentNode,
    metadata: spansToMetadata(context, documentSpans.preBab),
    opText: spansToStr(documentSpans.preBab),
    babSet: spansToBabSet(context, documentSpans.babs),
    disahkan,
  };
  // const detectedDocument = rawJsonToJson(document);
  console.timeEnd(`TIME ${JSON.stringify(documentNode)} init`);

  writeFileSync(jsonFile.path, yaml.dump(document, { lineWidth: 100 }));
}

type DocumentExtractedKey = 'preBab' | 'babs' | 'penjelasan' | 'disahkan';

function spansToDisahkan(spans: Span[]): Disahkan {
  const [, , location] = spans[0]?.str?.split(' ') ?? [];
  const [, , dateStr, monthStr, yearStr] = spans[1]?.str?.split(' ') ?? [];
  const date = safeParseInt(dateStr);
  const year = safeParseInt(yearStr);
  if (isUndefined(location) || isUndefined(date) || isUndefined(year)) {
    throw Error(`${{ location, date, year }}`);
  }
  const jabatanPengesah = spans[2]?.str;
  const pengesah = spans[4]?.str;
  return {
    date: {
      nodeType: 'date',
      month: monthToNumber(monthStr),
      date,
      year,
    },
    location,
    pengesah,
    jabatanPengesah,
  };
}

function monthToNumber(monthStr: string | undefined): number {
  if (monthStr === 'Januari') return 1;
  if (monthStr === 'Februari') return 2;
  if (monthStr === 'Maret') return 3;
  if (monthStr === 'April') return 4;
  if (monthStr === 'Mei') return 5;
  if (monthStr === 'Juni') return 6;
  if (monthStr === 'Juli') return 7;
  if (monthStr === 'Agustus') return 8;
  if (monthStr === 'September') return 9;
  if (monthStr === 'Oktober') return 10;
  if (monthStr === 'November') return 11;
  if (monthStr === 'Desember') return 12;
  throw Error(`unknwon month ${monthStr}`);
}

function documentSpansOf(spans: Span[]): SpanOf<DocumentExtractedKey> {
  const initialExtraction: Accumulator<DocumentExtractedKey> = {
    spans: { babs: [], preBab: [], penjelasan: [], disahkan: [] },
    flag: 'preBab',
  };
  return spans.reduce(toSpansWith(reduceFlag), initialExtraction).spans;
}

function reduceFlag(oldFlag: DocumentExtractedKey, span: Span): DocumentExtractedKey {
  if (oldFlag === 'preBab' && isBabSpansStart(span)) return 'babs';
  if (oldFlag === 'babs' && isDisahkanStart(span)) return 'disahkan';
  if (oldFlag === 'disahkan' && isPenjelasanSpansStart(span)) return 'penjelasan';
  return oldFlag;
}

function isBabSpansStart(span: Span): boolean {
  return span.str.replaceAll(' ', '') === 'BABI';
}
function isPenjelasanSpansStart(span: Span): boolean {
  return span.str.replaceAll('', '') === 'PENJELASAN';
}

function isDisahkanStart(span: Span): boolean {
  return span.str.startsWith('Disahkan di') && span.xL > 300;
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

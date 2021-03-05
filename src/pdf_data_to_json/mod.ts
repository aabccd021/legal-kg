import { isUndefined } from 'lodash';
import { DocumentNode } from '../legal/document/index';
import { getDocumentData, getDocumentFilePath } from '../data';
import { readFileSync, writeFileSync } from 'fs';
import { Accumulator, Span, toSpansWith } from '../util';
import { getBabsThresholds } from '../pdf_data_to_json/get_document_thresholds';
import { pasalKeyOfSpan } from './parse_key_from_spans';

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
  const babsSpans = rawJson.spans.babs ?? [];
  const thresholds = getBabsThresholds(babsSpans);
  const { amendPasal: amendPasalThreshold } = thresholds;
  if (!isUndefined(amendPasalThreshold)) {
    babsSpans?.forEach((span, idx, spans) => {
      if (!isUndefined(pasalKeyOfSpan(span))) {
        const spanAfterPasal = spans.slice(idx + 1)[0];
        if (!isUndefined(spanAfterPasal) && spanAfterPasal?.xL > amendPasalThreshold) {
          console.log(spanAfterPasal.pageNum);
          console.log(span.str);
          console.log(spanAfterPasal.str);
          console.log();
        }
      }
    });
  }
  writeFileSync(jsonFile.path, JSON.stringify(thresholds, undefined, 2));
}

type ExtractedKey = 'preBab' | 'babs' | 'penjelasan';

// type Acc = {
//   bab: number;
//   bagian: number;
//   paragraf: number;
//   pasal: number;
//   xlsAfterPasal: number[];
// };

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

// function toFoo(acc: Acc, span: Span, idx: number, spans: Span[]): Acc {
//   const { bab, bagian, paragraf, pasal, xlsAfterPasal } = acc;

//   const newBabKey = babKeyOfSpan(span);
//   if (newBabKey === bab + 1) return { ...acc, bab: newBabKey };

//   const newBagianKey = bagianKeyOfSpan(span);
//   if (newBagianKey === bagian + 1 || newBagianKey === 1) return { ...acc, bagian: newBagianKey };

//   const newParagrafKey = paragrafKeyOfSpan(span);
//   if (newParagrafKey === paragraf + 1 || newParagrafKey === 1)
//     return { ...acc, paragraf: newParagrafKey };

//   const newPasalKey = pasalKeyOfSpan(span);
//   const xlAfterPasal = spans.slice(idx)[0]?.xL;
//   const newXLAfterPasal: number[] =
//     isUndefined(newPasalKey) || isUndefined(xlAfterPasal)
//       ? xlsAfterPasal
//       : [...xlsAfterPasal, xlAfterPasal];
//   if (newPasalKey === pasal + 1)
//     return { ...acc, pasal: newPasalKey, xlsAfterPasal: newXLAfterPasal };

//   return { ...acc, xlsAfterPasal: newXLAfterPasal };
// }

pdfDataToJson();

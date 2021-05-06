import { readFileSync, writeFileSync } from 'fs';
import { getDocumentData, nodeToFile, shouldOverwrite, Span } from './util';
import { babsSpansToKeyIds } from './span_to_data/scan';
import { chain, isUndefined, mapValues, maxBy, reduce } from 'lodash';
import { pasalKeyOfSpan, safeParseInt } from './span_to_data/parse_key_from_spans';
import * as yaml from 'js-yaml';
import { spansToBabSet, spansToMetadata, spansToStr } from './span_to_data/spans_to_component';
import { Disahkan, Document } from './component';
import { DocumentNode } from './document';
import { detectInDocument } from './span_to_data/detect';
import { yamlToTriples } from './data_to_ttl/data-to-triples';
import { triplesToTtl } from './data_to_ttl/triples-to-ttl';

function spanToData(): void {
  [
    ...getDocumentData('span-mixed'),
    ...getDocumentData('span-normalized'),
    ...getDocumentData('span-raw'),
  ].forEach(writeToData);
  console.log('\ndone');
}

function writeToData(node: DocumentNode): void {
  console.log('\nstart', node);

  const dataFile = nodeToFile('data', node);

  const spanRawFile = nodeToFile('span-raw', node);
  const spanNormalizedFile = nodeToFile('span-normalized', node);
  const spanMixedFile = nodeToFile('span-mixed', node);
  const ttlFile = nodeToFile('ttl', node);

  if (!shouldOverwrite() && dataFile.exists && ttlFile.exists) {
    console.log('skipped because exists');
    return;
  }

  // select docs with most nodes
  const docs = [spanRawFile, spanNormalizedFile, spanMixedFile].map((file) => {
    try {
      const pdfSpans = yaml.load(readFileSync(file.path, 'utf8')) as Span[];
      const documentSpans = documentSpansOf(pdfSpans);
      console.log(mapValues(documentSpans, (v) => v.length));
      const hasAmendPasal = spansHasAmendPasal(documentSpans.babs);
      const keyIds = babsSpansToKeyIds(hasAmendPasal, documentSpans.babs);
      const disahkan = spansToDisahkan(documentSpans.disahkan);
      const context = { hasAmendPasal, keyIds, documentNode: node, disahkan };
      const document: Document = {
        node: node,
        metadata: spansToMetadata(context, documentSpans.preBab),
        opText: spansToStr(documentSpans.preBab),
        babSet: spansToBabSet(context, documentSpans.babs),
        disahkan,
      };
      const detectedDocument: Document = detectInDocument(document);
      const triples = yamlToTriples(detectedDocument);
      return {
        document: detectedDocument,
        triples,
      };
    } catch (e) {
      console.warn(e);
      return {
        document: undefined,
        triples: [],
      };
    }
  });

  console.log(docs.map((d) => d.triples.length));

  const choosen = maxBy(docs, ({ triples }) => triples.length);

  if (!choosen) throw Error();

  writeFileSync(dataFile.path, yaml.dump(choosen.document, { lineWidth: 100 }));
  writeFileSync(ttlFile.path, triplesToTtl(choosen.triples));
}

function spansToDisahkan(spans: Span[]): Disahkan {
  const [, , location] = spans[0]?.str?.split(' ') ?? [];
  const [dateStr, monthStr, yearStr] =
    spans[1]?.str?.replaceAll('pada', '')?.replaceAll('tanggal', '')?.trim().split(' ') ?? [];
  const date = safeParseInt(dateStr);
  const year = safeParseInt(yearStr);
  if (isUndefined(location) || isUndefined(date) || isUndefined(year)) {
    throw Error(`${JSON.stringify({ location, date, year })}`);
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

type DocumentSection = 'preBab' | 'babs' | 'penjelasan' | 'disahkan';
type DocumentAcc = {
  section: DocumentSection;
  spans: {
    [K in DocumentSection]: Span[];
  };
};

function documentSpansOf(spans: Span[]): { [K in DocumentSection]: Span[] } {
  const initialExtraction: DocumentAcc = {
    spans: { babs: [], preBab: [], penjelasan: [], disahkan: [] },
    section: 'preBab',
  };
  return reduce<Span, DocumentAcc>(
    spans,
    (acc, span) => {
      const [newSection, newSpan] = getNewSection(acc.section, span);
      return {
        section: newSection,
        spans: {
          ...acc.spans,
          [newSection]: [...acc.spans[newSection], ...newSpan],
        },
      };
    },
    initialExtraction
  ).spans;
}

function getNewSection(prevSection: DocumentSection, span: Span): [DocumentSection, Span[]] {
  if (prevSection === 'preBab' && span.str.replaceAll(' ', '') === 'BABI') {
    return ['babs', [span]];
  }
  // handle if BAB I not detected, detect using KETENTUAN UMUM
  // TODO: handle
  if (prevSection === 'preBab' && span.str === 'KETENTUAN UMUM') {
    const fakeSpan = { ...span, str: 'BAB I' };
    return ['babs', [fakeSpan, span]];
  }
  if (
    prevSection === 'babs' &&
    (span.str.startsWith('Disahkan di') || span.str.startsWith('Ditetapkan di')) &&
    span.xL > 250
  ) {
    return ['disahkan', [span]];
  }
  if (prevSection === 'disahkan' && span.str === 'PENJELASAN') {
    return ['penjelasan', [span]];
  }
  return [prevSection, [span]];
}

// function reduceFlag(oldFlag: DocumentSection, span: Span): DocumentSection {
//   if (oldFlag === 'preBab' && isBabSpansStart(span)) return 'babs';
//   if (oldFlag === 'preBab' && span.str === 'KETENTUAN UMUM') return 'babs';
//   if (oldFlag === 'babs' && isDisahkanStart(span)) return 'disahkan';
//   if (oldFlag === 'disahkan' && isPenjelasanSpansStart(span)) return 'penjelasan';
//   return oldFlag;
// }

// function isBabSpansStart(span: Span): boolean {
//   return span.str.replaceAll(' ', '') === 'BABI';
// }
// function isPenjelasanSpansStart(span: Span): boolean {
//   return span.str.replaceAll('', '') === 'PENJELASAN';
// }

// function isDisahkanStart(span: Span): boolean {
//   return span.str.startsWith('Disahkan di') && span.xL > 300;
// }

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

spanToData();

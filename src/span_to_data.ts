import { readFileSync, writeFileSync } from 'fs';
import { getDocumentData, nodeToFile, shouldOverwrite, Span } from './util';
import { babsSpansToKeyIds } from './span_to_data/scan';
import { chain, isUndefined, mapValues, maxBy, reduce } from 'lodash';
import { pasalKeyOfSpan, safeParseInt } from './span_to_data/parse_key_from_spans';
import * as yaml from 'js-yaml';
import { spansToContent, spansToMetadata } from './span_to_data/spans_to_component';
import { Disahkan, Document } from './component';
import { DocumentNode } from './document';
import { detectInDocument } from './span_to_data/detect';
import { yamlToTriples } from './data_to_ttl/data-to-triples';
import { triplesToTtl } from './data_to_ttl/triples-to-ttl';

function spanToData(): void {
  // yarn generate:data { \"nodeType\": \"document\", \"docType\": \"noTahun\", \"docCategory\": \"uu\", \"tahun\": 1947, \"nomor\": 36 }
  // yarn generate:data { \"nodeType\": \"document\", \"docType\": \"noTahun\", \"docCategory\": \"uu\", \"tahun\": 2020, \"nomor\": 1 }
  const [, , ...args] = process.argv;
  const argStr = args.join(' ');
  console.log(`'${argStr}'`);
  if (argStr) {
    const parsed = JSON.parse(argStr);
    console.log(parsed);
    writeToData(parsed);
  } else {
    getDocumentData('span-raw').forEach(writeToData);
  }
  console.log('\ndone');
}

function writeToData(node: DocumentNode): void {
  console.log('\nstart', node);

  const dataFile = nodeToFile('data', node);

  const spanRawFile = nodeToFile('span-raw', node);
  const spanNormalizedFile = nodeToFile('span-normalized', node);
  const spanMixedFile = nodeToFile('span-mixed', node);
  const ttlFile = nodeToFile('ttl', node);

  if (dataFile.exists) {
    console.log('skipped because exists');
    return;
  }

  // select docs with most nodes
  const docs = [spanRawFile, spanNormalizedFile, spanMixedFile].map((file) => {
    try {
      const pdfSpans = yaml.load(readFileSync(file.path, 'utf8')) as Span[];
      const { spans: documentSpans, rootOrganizer } = documentSpansOf(pdfSpans);
      console.log(mapValues(documentSpans, (v) => v.length));
      console.log({ rootOrganizer });
      const hasAmendPasal = spansHasAmendPasal(documentSpans.babs);
      const keyIds = babsSpansToKeyIds(hasAmendPasal, rootOrganizer, documentSpans.babs);
      // console.log(keyIds);
      const disahkan = spansToDisahkan(documentSpans.disahkan);
      const context = { hasAmendPasal, keyIds, documentNode: node, disahkan, rootOrganizer };
      const document: Document = {
        node: node,
        metadata: spansToMetadata(context, documentSpans.preBab),
        content: spansToContent(context, documentSpans.babs),
        disahkan,
      };
      const detectedDocument: Document = detectInDocument(document);
      const triples = yamlToTriples(detectedDocument);
      return {
        document: detectedDocument,
        triples,
      };
    } catch (e) {
      console.log(e);
      return {
        document: undefined,
        triples: [],
      };
    }
  });

  console.log(docs.map((d) => d.triples.length));

  const choosen = maxBy(docs, ({ triples }) => triples.length);

  if (!choosen || !choosen.document) {
    console.log(`${node} can't be converted to data`);
    writeFileSync(dataFile.path, '');
    return;
  }

  writeFileSync(dataFile.path, yaml.dump(choosen.document, { lineWidth: 100 }));
  writeFileSync(ttlFile.path, triplesToTtl(choosen.triples));
}

function spansToDisahkan(spans: Span[]): Disahkan {
  const [, , location] = spans[0]?.str?.split(' ') ?? [];
  const [dateStr, monthStr, yearStr] =
    spans[1]?.str
      ?.toLocaleLowerCase()
      .replaceAll('pada', '')
      ?.replaceAll('tanggal', '')
      ?.trim()
      .split(' ') ?? [];
  const date = safeParseInt(dateStr);
  const year = safeParseInt(yearStr);
  if (isUndefined(location) || isUndefined(date) || isUndefined(year)) {
    throw Error(
      `${JSON.stringify({
        location,
        date,
        year,
        spans0: spans[0],
        spans1: spans[1],
        arr: [dateStr, monthStr, yearStr],
      })}`
    );
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
  if (monthStr === 'januari') return 1;
  if (monthStr === 'februari') return 2;
  if (monthStr === 'maret') return 3;
  if (monthStr === 'april') return 4;
  if (monthStr === 'mei') return 5;
  if (monthStr === 'juni') return 6;
  if (monthStr === 'juli') return 7;
  if (monthStr === 'agustus') return 8;
  if (monthStr === 'september') return 9;
  if (monthStr === 'oktober') return 10;
  if (monthStr === 'november') return 11;
  if (monthStr === 'desember') return 12;
  throw Error(`unknwon month ${monthStr}`);
}

type DocumentSection = 'preBab' | 'babs' | 'penjelasan' | 'disahkan';
type DocumentAcc = {
  rootOrganizer?: 'bab' | 'pasal';
  section: DocumentSection;
  spans: {
    [K in DocumentSection]: Span[];
  };
};

function documentSpansOf(
  spans: Span[]
): { spans: { [K in DocumentSection]: Span[] }; rootOrganizer: 'bab' | 'pasal' } {
  const initialExtraction: DocumentAcc = {
    spans: { babs: [], preBab: [], penjelasan: [], disahkan: [] },
    section: 'preBab',
  };
  const { spans: newSpans, rootOrganizer } = reduce<Span, DocumentAcc>(
    spans,
    (acc, span) => {
      const { newSection, newSpan, rootOrganizer } = getNewSection(acc.section, span);
      return {
        section: newSection,
        spans: {
          ...acc.spans,
          [newSection]: [...acc.spans[newSection], ...newSpan],
        },
        rootOrganizer: acc.rootOrganizer ?? rootOrganizer,
      };
    },
    initialExtraction
  );
  if (!rootOrganizer) throw Error();
  return {
    spans: newSpans,
    rootOrganizer,
  };
}

function getNewSection(
  prevSection: DocumentSection,
  span: Span
): { newSection: DocumentSection; newSpan: Span[]; rootOrganizer?: 'pasal' | 'bab' } {
  if (prevSection === 'preBab') {
    if (span.str.replaceAll(' ', '') === 'BABI')
      return { newSection: 'babs', newSpan: [span], rootOrganizer: 'bab' };
    if (span.str.replaceAll(' ', '') === 'Pasal1')
      return { newSection: 'babs', newSpan: [span], rootOrganizer: 'pasal' };
    if (span.str.replaceAll(' ', '') === 'PasalI')
      return { newSection: 'babs', newSpan: [span], rootOrganizer: 'pasal' };
    if (span.str === 'KETENTUAN UMUM') {
      const fakeSpan = { ...span, str: 'BAB I' };
      return { newSection: 'babs', newSpan: [fakeSpan, span], rootOrganizer: 'bab' };
    }
  }
  if (
    prevSection === 'babs' &&
    (span.str.startsWith('Disahkan di') || span.str.startsWith('Ditetapkan di')) &&
    span.xL > 250
  ) {
    return { newSection: 'disahkan', newSpan: [span] };
  }
  if (prevSection === 'disahkan' && span.str === 'PENJELASAN') {
    return { newSection: 'penjelasan', newSpan: [span] };
  }
  return { newSection: prevSection, newSpan: [span] };
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

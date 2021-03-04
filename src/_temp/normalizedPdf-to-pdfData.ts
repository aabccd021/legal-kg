import { DocumentNode } from '../legal/document/index';
import { writeFileSync } from 'fs';
import { PDFExtract, PDFExtractPage, PDFExtractText } from 'pdf.js-extract';
import { getDocumentData, getDocumentFilePath } from '../data';
import { chain, curry, isUndefined, isEmpty } from 'lodash';
import { bothFilter, neverNum, Span } from '../util';

const pdfExtract = new PDFExtract();

async function normalizedPdfToPdfData(): Promise<void> {
  for (const pdf of getDocumentData('normalized-pdf')) {
    await toPdfJson(pdf);
  }
  console.log('===DONE');
}

async function toPdfJson(pdfNode: DocumentNode): Promise<void> {
  console.log('start', pdfNode);
  const pdfFile = getDocumentFilePath(pdfNode, 'normalized-pdf');
  const jsonFile = getDocumentFilePath(pdfNode, 'pdf-data');
  const { pages } = await pdfExtract.extract(pdfFile.path);
  const cleanPages: Span[] = pages.flatMap(toPageWithoutNoise);
  writeFileSync(jsonFile.path, JSON.stringify(cleanPages, undefined, 2));
}

/**
 * Remove noise
 */
function toPageWithoutNoise(page: PDFExtractPage, _pageIdx: number): Span[] {
  return chain(page.content)
    .reduce<SpanMap>(toSpanMap, {})
    .thru(toSpansWith(_pageIdx + 1))
    .filter(isNotHeader)
    .thru(withoutLeftFooter)
    .thru(withoutRightFooter)
    .value();
}

/**
 * Group Spans
 */
type SpanMap = { [name: string]: { y: number; texts: PDFExtractText[] } };

function toSpanMap(map: SpanMap, text: PDFExtractText): SpanMap {
  const key = `${text.y}`;
  const group = map[key];
  const y = group?.y ?? text.y;
  const texts: PDFExtractText[] = [...(group?.texts ?? []), text];
  const newGroup = { y, texts };

  return { ...map, [key]: newGroup };
}

/**
 * Group to span array
 */
const toSpansWith = curry(toSpans);

function toSpans(pageNum: number, map: SpanMap): Span[] {
  return chain(map)
    .values()
    .sort((a, b) => a.y - b.y)
    .flatMap(groupToSpanWith(pageNum))
    .filter((span) => !isEmpty(span.str))
    .value();
}

/**
 * Group to span
 */
const groupToSpanWith = curry(groupToSpan);

function groupToSpan(pageNum: number, group: { y: number; texts: PDFExtractText[] }): Span {
  const { texts, y } = group;

  const sortedTexts = texts.sort((a, b) => a.x - b.x);

  const str = sortedTexts
    .map(({ str }) => str.trim())
    .join(' ')
    .trim()
    .replace(/ {1,}/g, ' ');

  const xL = sortedTexts[0]?.x ?? neverNum();

  const lastText = sortedTexts.slice(-1)[0];
  const xR = (lastText?.x ?? neverNum()) + (lastText?.width ?? neverNum());

  return { xL, xR, y, str, pageNum };
}

/**
 * Filter Header
 */
function isNotHeader(span: Span): boolean {
  const { xL, xR, y, str } = span;

  // is header
  if (y < 210 && xL > 250 && xR < 400 && str !== 'PENJELASAN') {
    // debug
    if (
      str.length > 5 &&
      !['PRESIDEN', 'REPUBLIK INDONESIA'].includes(str.replaceAll(',', '')) &&
      !/-? ?[0-9A-Z]+ ?-?/.test(str)
    ) {
      console.log(`\n===REMOVED_IRREGULAR_HEADER===PAGE_${span.pageNum}===`);
      console.log(str);
    }
    return false;
  }
  return true;
}

/**
 * Left Footer
 */
function withoutLeftFooter(spans: Span[]): Span[] {
  const { left, right } = bothFilter(spans, isLeftFooter);

  // only choose last candidate as footer
  const footer = right.slice(-1)[0];

  // debug
  if (!isUndefined(footer) && !footer.str.startsWith('SK')) {
    console.log(`\n===REMOVED_IRREGULAR_LEFT_FOOTER===PAGE_${footer.pageNum}===`);
    console.log(JSON.stringify(right, undefined, 2));
  }

  return [...left, ...right.slice(0, -1)].sort(byY);
}

function isLeftFooter(span: Span): boolean {
  return span.y > 900 && span.xL < 45;
}

/**
 * Right Footer
 */
function withoutRightFooter(spans: Span[]): Span[] {
  const { left, right } = bothFilter(spans, isRightFooter);

  // only choose last candidate as footer
  const footer = right.slice(-1)[0];

  // debug
  if (!isUndefined(footer) && !footer.str.endsWith('..')) {
    console.log(`\n===REMOVED_IRREGULAR_RIGHT_FOOTER===PAGE_${footer.pageNum}===`);
    console.log(JSON.stringify(right, undefined, 2));
  }

  return [...left, ...right.slice(0, -1)].sort(byY);
}

function isRightFooter(span: Span): boolean {
  return span.y > 800 && span.xL > 350 && span.xR > 500;
}

/**
 * Util
 */
function byY(a: Span, b: Span): number {
  return a.y - b.y;
}

normalizedPdfToPdfData();

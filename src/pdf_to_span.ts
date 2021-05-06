import { getDocumentData, nodeToFile, shouldOverwrite, UnindexedSpan } from './util';
import { DocumentNode } from './document/index';
import { writeFileSync } from 'fs';
import { PDFExtract, PDFExtractPage, PDFExtractText } from 'pdf.js-extract';
import { chain, curry, isUndefined, isEmpty, filter, zip, countBy, maxBy, toPairs } from 'lodash';
import { bothFilter, neverNum, Span } from './util';
import * as yaml from 'js-yaml';

const pdfExtract = new PDFExtract();

async function normalizedPdfToPdfData(): Promise<void> {
  for (const pdf of getDocumentData('normalized-pdf')) {
    await toPdfJson(pdf);
  }
  console.log('===DONE');
}

async function toPdfJson(node: DocumentNode): Promise<void> {
  console.log('start', node);

  const pdfFile = nodeToFile('pdf', node);
  const normalizedPdfFile = nodeToFile('normalized-pdf', node);
  const pdfDataFile = nodeToFile('pdf-data', node);

  if (!shouldOverwrite() && pdfDataFile.exists) {
    console.log('skipped because exists');
    return;
  }
  // const rawDetected = nodeToFile('pdf-detect', node);
  const { pages } = await pdfExtract.extract(pdfFile.path);
  const { pages: normalizedPages } = await pdfExtract.extract(normalizedPdfFile.path);
  // writeFileSync(rawDetected.path, JSON.stringify(pages, undefined, 2));
  // TODO: able to select merge map
  const mergedPages = chain(zip(pages, normalizedPages)).map(mergePage).compact().value();
  const hasHeader = getHasHeader(mergedPages);
  const cleanPages: Span[] = mergedPages
    .flatMap((page, pageidx) => toPageWithoutNoise(page, pageidx, hasHeader))
    .map((span, index) => ({ ...span, id: index }));
  writeFileSync(pdfDataFile.path, yaml.dump(cleanPages, { lineWidth: 80 }));
}

function mergePage(
  pages: [PDFExtractPage | undefined, PDFExtractPage | undefined]
): PDFExtractPage | undefined {
  const [page0, page1] = pages;
  if (isUndefined(page0) || isUndefined(page1)) return undefined;
  const candidates = page0.content.filter(
    (text0) =>
      // fill number TODO: give example
      ((/^[0-9]+\.\s?$/.test(text0.str) && text0.str.split('.')[0] !== '1' && text0.x < 280) ||
        // fill bab TODO: give example
        text0.str.startsWith('BAB')) &&
      page1.content.every((text1) => !hasSamePos(text0, text1))
  );
  const newContent = [...page1.content, ...candidates];
  return { ...page1, content: newContent };
}

function hasSamePos(text1: PDFExtractText, text2: PDFExtractText): boolean {
  return Math.abs(text1.x - text2.x) < 5 && Math.abs(text1.y - text2.y) < 5;
}

/**
 * Remove noise
 */
function toPageWithoutNoise(
  page: PDFExtractPage,
  _pageIdx: number,
  hasHeader: boolean
): UnindexedSpan[] {
  const spans = chain(page.content)
    .reduce<SpanMap>(toSpanMap, {})
    .thru(toSpansWith(_pageIdx + 1))
    .value();

  const spansAfterHeader = hasHeader ? spans.filter(isNotHeader) : spans;
  return chain(spansAfterHeader).thru(withoutLeftFooter).thru(withoutRightFooter).value();
}

/**
 * Group Spans
 */
type SpanMap = { [name: string]: SpanGroup };
type SpanGroup = { y: number; texts: PDFExtractText[] };

function toSpanMap(map: SpanMap, text: PDFExtractText): SpanMap {
  const groupY = getGroupY(map, text);
  const groupKey = isUndefined(groupY) ? `${text.y}` : `${groupY}`;
  const group = map[groupKey];
  const y = group?.y ?? text.y;
  const texts: PDFExtractText[] = [...(group?.texts ?? []), text];
  const newGroup = { y, texts };

  return { ...map, [groupKey]: newGroup };
}

function getGroupY(map: SpanMap, text: PDFExtractText): number | undefined {
  const group = filter(map, (group) => {
    const firstTextInGroup = group.texts[0];
    return !isUndefined(firstTextInGroup) && Math.abs(firstTextInGroup.y - text.y) < 5;
  });
  if (group.length > 1) console.log(` too many group`, group);
  return group[0]?.y;
}

/**
 * Group to span array
 */
const toSpansWith = curry(toSpans);

function toSpans(pageNum: number, map: SpanMap): UnindexedSpan[] {
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

function groupToSpan(
  pageNum: number,
  group: { y: number; texts: PDFExtractText[] }
): UnindexedSpan {
  const { texts, y } = group;

  const sortedTexts = texts.sort((a, b) => a.x - b.x);

  const str = sortedTexts
    .map(({ str }) => str.trim())
    .join(' ')
    .trim()
    .replace(/ {1,}/g, ' '); // TODO: show example

  const xL = sortedTexts[0]?.x ?? neverNum();

  const lastText = sortedTexts.slice(-1)[0];
  const xR = (lastText?.x ?? neverNum()) + (lastText?.width ?? neverNum());

  return { xL, xR, y, str, pageNum };
}

/**
 * Filter Header
 */
function isNotHeader(span: UnindexedSpan): boolean {
  const { xL, xR, y, str } = span;

  // is header
  if (y < 220 && xL > 200 && xR < 450 && str !== 'PENJELASAN') {
    // debug
    if (
      str.length > 5 &&
      !['PRESIDEN', 'REPUBLIK INDONESIA'].includes(str.replaceAll(',', '')) &&
      !/-? ?[0-9A-Z]+ ?-?/.test(str) // TODO: show example
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
function withoutLeftFooter(spans: UnindexedSpan[]): UnindexedSpan[] {
  const { left, right } = bothFilter(spans, isLeftFooter);

  // only choose last candidate as footer
  const footer = right.slice(-1)[0];

  // debug
  if (
    !isUndefined(footer) &&
    // TODO: show example
    !footer.str.startsWith('SK')
  ) {
    console.log(`\n===REMOVED_IRREGULAR_LEFT_FOOTER===PAGE_${footer.pageNum}===`);
    console.log(JSON.stringify(right, undefined, 2));
  }

  return [...left, ...right.slice(0, -1)].sort(byY);
}

function isLeftFooter(span: UnindexedSpan): boolean {
  return span.y > 900 && span.xL < 45;
}

/**
 * Right Footer
 */
function withoutRightFooter(spans: UnindexedSpan[]): UnindexedSpan[] {
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

function isRightFooter(span: UnindexedSpan): boolean {
  return span.y > 800 && span.xL > 350 && span.xR > 500;
}

/**
 * Util
 */
function byY(a: UnindexedSpan, b: UnindexedSpan): number {
  return a.y - b.y;
}

function getHasHeader(pages: PDFExtractPage[]): boolean {
  const firstStrs = pages.map((page) => page.content[0]?.str);
  const counted = countBy(firstStrs);
  const maxHeader = maxBy(toPairs(counted), ([, count]) => count) ?? [undefined, 0];
  const sameHeaderRatio = maxHeader[1] / pages.length;
  console.log(`header proposition: ${sameHeaderRatio}`);
  return sameHeaderRatio > 0.1;
}

normalizedPdfToPdfData();

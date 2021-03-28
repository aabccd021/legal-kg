import { UnindexedSpan } from '../../util';
import { DocumentNode } from '../../legal/document/index';
import { writeFileSync } from 'fs';
import { PDFExtract, PDFExtractPage, PDFExtractText } from 'pdf.js-extract';
import { getDocumentData, nodeToFilePath } from '../../data';
import { chain, curry, isUndefined, isEmpty, filter, zip } from 'lodash';
import { bothFilter, neverNum, Span } from '../../util';

const pdfExtract = new PDFExtract();

async function normalizedPdfToPdfData(): Promise<void> {
  for (const pdf of getDocumentData('normalized-pdf')) {
    await toPdfJson(pdf);
  }
  console.log('===DONE');
}

async function toPdfJson(node: DocumentNode): Promise<void> {
  console.log('start', node);
  const pdfFile = nodeToFilePath('pdf', node);
  const normalizedPdfFile = nodeToFilePath('normalized-pdf', node);
  const jsonFile = nodeToFilePath('pdf-data', node);
  const { pages } = await pdfExtract.extract(pdfFile.path);
  const { pages: normalizedPages } = await pdfExtract.extract(normalizedPdfFile.path);
  const mergedPages = chain(zip(pages, normalizedPages)).map(mergePage).compact().value();
  const cleanPages: Span[] = mergedPages
    .flatMap(toPageWithoutNoise)
    .map((span, index) => ({ ...span, id: index }));
  writeFileSync(jsonFile.path, JSON.stringify(cleanPages, undefined, 2));
}

function mergePage(
  pages: [PDFExtractPage | undefined, PDFExtractPage | undefined]
): PDFExtractPage | undefined {
  const [page0, page1] = pages;
  if (isUndefined(page0) || isUndefined(page1)) return undefined;
  const candidates = page0.content.filter(
    (text0) =>
      /^[0-9]+\.\s?$/.test(text0.str) &&
      text0.str.split('.')[0] !== '1' &&
      text0.x < 280 &&
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
function toPageWithoutNoise(page: PDFExtractPage, _pageIdx: number): UnindexedSpan[] {
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
  if (group.length > 1) throw Error(' too many group');
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
    .replace(/ {1,}/g, ' ');

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
function withoutLeftFooter(spans: UnindexedSpan[]): UnindexedSpan[] {
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

normalizedPdfToPdfData();

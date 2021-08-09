import { chain, curry, filter, isEmpty, isUndefined } from 'lodash';
import { PDFExtractPage, PDFExtractText } from 'pdf.js-extract';
import { UnindexedSpan, neverNum, bothFilter } from './util';

type SpanMap = { [name: string]: SpanGroup };
type SpanGroup = { y: number; texts: PDFExtractText[] };

export function mergePage(
  pages: [PDFExtractPage | undefined, PDFExtractPage | undefined]
): PDFExtractPage | undefined {
  const [page0, page1] = pages;
  if (isUndefined(page0) || isUndefined(page1)) return undefined;
  const candidates = page0.content.filter(
    (text0) =>
      ((/^[0-9]+\.\s?$/.test(text0.str) && text0.str.split('.')[0] !== '1' && text0.x < 280) ||
        text0.str.startsWith('BAB')) &&
      page1.content.every((text1) => !hasSamePos(text0, text1))
  );
  const newContent = [...page1.content, ...candidates];
  return { ...page1, content: newContent };
}

function hasSamePos(text1: PDFExtractText, text2: PDFExtractText): boolean {
  return Math.abs(text1.x - text2.x) < 5 && Math.abs(text1.y - text2.y) < 5;
}

export function toPageWithoutNoise(page: PDFExtractPage, _pageIdx: number): UnindexedSpan[] {
  const spans = chain(page.content)
    .reduce<SpanMap>(toSpanMap, {})
    .thru(toSpansWith(_pageIdx + 1))
    .value();

  return chain(spans).filter(isNotHeader).thru(withoutLeftFooter).thru(withoutRightFooter).value();
  // return spans;
}

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
  const { y, str } = span;

  // is header
  const isHeader =
    y < 220 && (['PRESIDEN', 'REPUBLIK INDONESIA'].includes(str) || /- ?[0-9]+ ?-/.test(str));
  return !isHeader;
}

/**
 * Left Footer
 */
export function withoutLeftFooter(spans: UnindexedSpan[]): UnindexedSpan[] {
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
export function withoutRightFooter(spans: UnindexedSpan[]): UnindexedSpan[] {
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

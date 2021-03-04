import { DocumentNode } from '../legal/document/index';
import { writeFileSync } from 'fs';
import { PDFExtract, PDFExtractPage, PDFExtractText } from 'pdf.js-extract';
import { getDocumentData, getDocumentFilePath } from '../data';
import { chain, curry, isEmpty } from 'lodash';
import { bothFilter, neverNum, Span } from '../util';

const pdfExtract = new PDFExtract();

async function normalizedPdfToPdfData(): Promise<void> {
  for (const pdf of getDocumentData('normalized-pdf')) {
    await toPdfJson(pdf, { useNormalized: true });
    // await toPdfJson(pdf, { useNormalized: false });
  }
  console.log('===DONE');
}

async function toPdfJson(
  pdfNode: DocumentNode,
  { useNormalized }: { useNormalized: boolean }
): Promise<void> {
  console.log(`start, useNormalized: ${useNormalized}`, pdfNode);
  const pdfFile = getDocumentFilePath(pdfNode, useNormalized ? 'normalized-pdf' : 'pdf');
  const jsonFile = getDocumentFilePath(pdfNode, useNormalized ? 'normalized-pdf-data' : 'pdf-data');
  const { pages } = await pdfExtract.extract(pdfFile.path);
  const cleanPages: Span[] = pages.flatMap(toPageWithoutNoise);
  writeFileSync(jsonFile.path, JSON.stringify(cleanPages, undefined, 2));
}

function toPageWithoutNoise(page: PDFExtractPage, _pageIdx: number): Span[] {
  return chain(page.content)
    .reduce<SpanMap>(toSpanMap, {})
    .thru(toSpansWith(_pageIdx + 1))
    .filter(isNotHeader)
    .filter(isNotLeftFooter)
    .value();
}
type SpanMap = {
  [name: string]: {
    y: number;
    texts: PDFExtractText[];
  };
};

function toSpanMap(map: SpanMap, text: PDFExtractText): SpanMap {
  const key = `${text.y}`;
  const group = map[key];
  const y = group?.y ?? text.y;
  const texts: PDFExtractText[] = [...(group?.texts ?? []), text];
  const newGroup = { y, texts };

  return { ...map, [key]: newGroup };
}

const toSpansWith = curry(toSpans);

function toSpans(pageNum: number, map: SpanMap): Span[] {
  return chain(map)
    .values()
    .sort((a, b) => a.y - b.y)
    .flatMap(groupToSpanWith(pageNum))
    .value();
}

const groupToSpanWith = curry(groupToSpan);

function groupToSpan(pageNum: number, group: { y: number; texts: PDFExtractText[] }): Span {
  const { texts, y } = group;
  const sortedTexts = texts.sort((a, b) => a.x - b.x);
  const str = sortedTexts.map(({ str }) => str.trim().replace(/ {1,}/g, ' ')).join(' ');
  const xL = sortedTexts[0]?.x ?? neverNum();
  const lastText = sortedTexts.slice(-1)[0];
  const xR = (lastText?.x ?? neverNum()) + (lastText?.width ?? neverNum());
  return { xL, xR, y, str, pageNum };
}

function isNotHeader(span: Span): boolean {
  const { xL, xR, y, str } = span;
  const denyList = ['PENJELASAN'];
  if (y < 210 && xL > 250 && xR < 400 && !denyList.includes(str)) {
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

function isNotLeftFooter(span: Span): boolean {
  const { xL, y } = span;
  if (y > 900 && xL < 45) {
    if (!span.str.startsWith('SK')) {
      console.log(`\n===REMOVED_IRREGULAR_LEFT_FOOTER===PAGE_${span.pageNum}===`);
      console.log(span.str);
    }
    return false;
  }
  return true;
}

function removeRightFooter(_pageNum: number, texts: PDFExtractText[]): PDFExtractText[] {
  const { left, right: footer } = bothFilter(texts, isRightFooter);
  if (!isEmpty(footer)) {
    const footerText = footer.map(({ str }) => str).join(' ');
    if (!footerText.includes('...')) {
      console.log('\n===REMOVED RIGHT FOOTER===PAGE', _pageNum);
      console.log(footerText);
    }
  }
  return left;
}

function isRightFooter(text: PDFExtractText, texts: PDFExtractText[]): boolean {
  const { x, y } = text;
  return y > 800 && x > 400 && texts.filter((text) => text.y === y).length < 4;
}

// function textOf(pages: PDFExtractPage[]): string {
//   return pages
//     .flatMap(({ content }) => content)
//     .flatMap(({ str }) => str)
//     .join('\n');
// }
normalizedPdfToPdfData();

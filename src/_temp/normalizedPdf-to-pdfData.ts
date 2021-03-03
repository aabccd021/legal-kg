import { DocumentNode } from '../legal/document/index';
import { writeFileSync } from 'fs';
import { PDFExtract, PDFExtractPage, PDFExtractText } from 'pdf.js-extract';
import { getDocumentData, getDocumentFilePath, getTempFilePath } from '../data';
import { chain, curry, isEmpty } from 'lodash';
import { bothFilter, neverNum, Span } from '../util';

const pdfExtract = new PDFExtract();

async function normalizedPdfToPdfData(): Promise<void> {
  for (const pdf of getDocumentData('normalized-pdf')) {
    await toPdfJson(pdf);
  }
}

async function toPdfJson(pdfNode: DocumentNode): Promise<void> {
  console.log('start', pdfNode);
  const pdfFile = getDocumentFilePath(pdfNode, 'pdf');
  const tempJSONFile = getTempFilePath(pdfNode, 'normalized-pdf-temp', '.json');
  const jsonFile = getDocumentFilePath(pdfNode, 'pdf-data');
  const { pages } = await pdfExtract.extract(pdfFile.path);
  writeFileSync(tempJSONFile.path, JSON.stringify(pages[0], undefined, 2));
  const cleanPages: Span[] = pages.flatMap(toPageWithoutNoise);
  writeFileSync(jsonFile.path, JSON.stringify(cleanPages, undefined, 2));
}

function toPageWithoutNoise(page: PDFExtractPage, _pageIdx: number): Span[] {
  const { content } = page;
  const pageNum = _pageIdx + 1;
  const noHeader = content
    .filter((text, _, texts) => !isHeader(pageNum, text, texts))
    .filter((text, _, texts) => !isLeftFooter(pageNum, text, texts));
  const noRightFooter = removeRightFooter(pageNum, noHeader);
  return chain(noRightFooter).reduce<SpanMap>(toSpanMap, {}).thru(toSpansWith(pageNum)).value();
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

// function byPosition(a: PDFExtractText, b: PDFExtractText): number {
//   const yDelta = a.y - b.y;
//   if (yDelta !== 0) return yDelta;
//   return a.x - b.x;
// }

function isHeader(_pageNum: number, text: PDFExtractText, texts: PDFExtractText[]): boolean {
  const { x, y, str } = text;
  const sameLineTexts = texts.filter((text) => text.y === y);
  const denyList = ['PENJELASAN'];
  if (y < 210 && x > 250 && x < 320 && sameLineTexts.length < 4 && !denyList.includes(str.trim())) {
    if (!['PRESIDEN', 'REPUBLIK', 'INDONESIA', '-'].includes(str.trim())) {
      if (str.trim().length > 4) {
        console.log('\n===REMOVED HEADER===PAGE', _pageNum);
        console.log(str);
      }
    }
    return true;
  }
  return false;
}

function isLeftFooter(_pageNum: number, text: PDFExtractText, _texts: PDFExtractText[]): boolean {
  const { x, y } = text;
  if (y > 900 && x < 90) {
    const trimmed = text.str.trim();
    if (
      !['sk', 'no'].includes(trimmed.toLowerCase()) &&
      !(/[0-9]+/.test(trimmed) && trimmed.length === 6)
    ) {
      console.log('\n===REMOVED LEFT FOOTER===PAGE', _pageNum);
      console.log(trimmed);
    }
    return true;
  }
  return false;
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

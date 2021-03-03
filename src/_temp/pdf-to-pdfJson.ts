import { DocumentNode } from './../legal/document/index';
import { writeFileSync } from 'fs';
import { PDFExtract, PDFExtractPage, PDFExtractText } from 'pdf.js-extract';
import { getDocumentData, getDocumentFilePath } from '../data';
import { isEmpty } from 'lodash';

const pdfExtract = new PDFExtract();

async function pdfToPdfJson(): Promise<void> {
  for (const pdf of getDocumentData('normalized-pdf')) {
    await toPdfJson(pdf);
  }
}

async function toPdfJson(pdfNode: DocumentNode): Promise<void> {
  console.log('start', pdfNode);
  const pdfFile = getDocumentFilePath(pdfNode, 'normalized-pdf');
  const jsonFile = getDocumentFilePath(pdfNode, 'pdf-data');
  const { pages } = await pdfExtract.extract(pdfFile.path);
  const cleanPages = pages.map(toPageWithoutNoise);
  writeFileSync(jsonFile.path, JSON.stringify(cleanPages, undefined, 2));
}

function toPageWithoutNoise(page: PDFExtractPage, _pageIdx: number): PDFExtractPage {
  const { content } = page;
  const pageNum = _pageIdx + 1;
  const noHeader = content.filter((text, _, texts) => !isHeader(pageNum, text, texts));
  const noLeftFooter = noHeader.filter((text, _, texts) => !isLeftFooter(pageNum, text, texts));
  const noRightFooter = removeRightFooter(pageNum, noLeftFooter);
  return { ...page, content: noRightFooter };
}

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
  const footer = texts.filter(isRightFooter);
  if (!isEmpty(footer)) {
    const footerText = footer.map(({ str }) => str).join(' ');
    if (!footerText.includes('...')) {
      console.log('\n===REMOVED RIGHT FOOTER===PAGE', _pageNum);
      console.log(footerText);
    }
  }
  return texts.filter((x, y, z) => !isRightFooter(x, y, z));
}

function isRightFooter(text: PDFExtractText, _: number, texts: PDFExtractText[]): boolean {
  const { x, y } = text;
  return y > 800 && x > 400 && texts.filter((text) => text.y === y).length < 4;
}

// function textOf(pages: PDFExtractPage[]): string {
//   return pages
//     .flatMap(({ content }) => content)
//     .flatMap(({ str }) => str)
//     .join('\n');
// }
pdfToPdfJson();

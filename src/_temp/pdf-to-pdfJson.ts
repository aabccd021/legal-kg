import { DocumentNode } from './../legal/document/index';
import { writeFileSync } from 'fs';
import { PDFExtract, PDFExtractPage, PDFExtractText } from 'pdf.js-extract';
import { getDocumentData, getDocumentFilePath } from '../data';

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
  console.log('\n===PAGE', _pageIdx + 1);
  const newContent = content.filter(isNotPageNoise);
  return { ...page, content: newContent };
}

function isNotPageNoise(text: PDFExtractText, _: number, texts: PDFExtractText[]): boolean {
  return !isHeader(text, texts);
}

function isHeader(text: PDFExtractText, texts: PDFExtractText[]): boolean {
  const { x, y, str } = text;
  const sameLineTexts = texts.filter((text) => text.y === y);
  const denyList = ['PENJELASAN'];
  if (y < 210 && x > 250 && x < 320 && sameLineTexts.length < 4 && !denyList.includes(str.trim())) {
    // if (!['PRESIDEN', 'REPUBLIK', 'INDONESIA', '-'].includes(str.trim())) {
    //   if (str.trim().length > 4) {
    //     console.log(str);
    //   }
    // }
    return true;
  }
  return false;
}

// function textOf(pages: PDFExtractPage[]): string {
//   return pages
//     .flatMap(({ content }) => content)
//     .flatMap(({ str }) => str)
//     .join('\n');
// }
pdfToPdfJson();

import { writeFileSync } from 'fs';
import { PDFExtract, PDFExtractPage, PDFExtractText } from 'pdf.js-extract';

const pdfExtract = new PDFExtract();

async function pdfToPdfJson(): Promise<void> {
  const { pages } = await pdfExtract.extract('maintained_documents/normalized-pdf/uu/2003/13.pdf');
  // writeFileSync('pagesx.json', JSON.stringify(pages, undefined, 2));
  // writeFileSync('pagesx.text', textOf(pages));
  const cleanPages = pages.map(toPageWithoutNoise);
  writeFileSync(
    'maintained_documents/pdf-data/uu/2003/13.json',
    JSON.stringify(cleanPages, undefined, 2)
  );
  // writeFileSync('clean_pagesx.text', textOf(cleanPages));
}

function toPageWithoutNoise(page: PDFExtractPage, _pageIdx: number): PDFExtractPage {
  const { content } = page;
  // console.log('\n===PAGE', _pageIdx + 1);
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

import { getDocumentData, nodeToFile, shouldOverwrite } from './util';
import { DocumentNode } from './document';
import { writeFileSync } from 'fs';
import { PDFExtract, PDFExtractPage } from 'pdf.js-extract';
import { chain, zip, compact } from 'lodash';
import { Span } from './util';
import * as yaml from 'js-yaml';
import { mergePage, toPageWithoutNoise } from './_pdf_to_span';

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
  const spanRawFile = nodeToFile('span-raw', node);
  const spanNormalizedFile = nodeToFile('span-normalized', node);
  const spanMixedFile = nodeToFile('span-mixed', node);

  if (
    !shouldOverwrite() &&
    spanRawFile.exists &&
    spanNormalizedFile.exists &&
    spanMixedFile.exists
  ) {
    console.log('skipped because exists');
    return;
  }
  if (pdfFile.exists) {
    const { pages: rawPages } = await pdfExtract.extract(pdfFile.path);
    writeFileSync(nodeToFile('pdf-scan', node).path, yaml.dump(rawPages));
  }
  if (normalizedPdfFile.exists) {
    const { pages: normalizedPages } = await pdfExtract.extract(normalizedPdfFile.path);
    writeFileSync(nodeToFile('normalized-pdf-scan', node).path, yaml.dump(normalizedPages));
  }

  const { pages: rawPages } = await pdfExtract.extract(pdfFile.path);
  const { pages: normalizedPages } = await pdfExtract.extract(normalizedPdfFile.path);
  const mixedPages =
    pdfFile.exists && normalizedPdfFile.exists
      ? chain(zip(rawPages, normalizedPages)).map(mergePage).compact().value()
      : undefined;

  const pages: [string, PDFExtractPage[]][] = compact([
    pdfFile.exists ? [spanRawFile.path, rawPages] : undefined,
    normalizedPdfFile.exists ? [spanNormalizedFile.path, normalizedPages] : undefined,
    mixedPages ? [spanMixedFile.path, mixedPages] : undefined,
  ]);

  pages.forEach(([path, pages]) => {
    // const hasHeader = getHasHeader(pages);
    const cleanPages: Span[] = pages
      .flatMap((page, pageidx) => toPageWithoutNoise(page, pageidx))
      .map((span, index) => ({ ...span, id: index }));
    writeFileSync(path, yaml.dump(cleanPages, { lineWidth: 80 }));
  });
}

/**
 * Remove noise
 */

/**
 * Group Spans
 */

// function getHasHeader(pages: PDFExtractPage[]): boolean {
//   const firstStrs = pages.map((page) => page.content[0]?.str);
//   const counted = countBy(firstStrs);
//   const maxHeader = maxBy(toPairs(counted), ([, count]) => count) ?? [undefined, 0];
//   const sameHeaderRatio = maxHeader[1] / pages.length;
//   console.log(`header proposition: ${sameHeaderRatio}`);
//   return sameHeaderRatio > 0.1;
// }

normalizedPdfToPdfData();

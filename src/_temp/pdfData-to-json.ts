import { DocumentNode } from '../legal/document/index';
import { getDocumentData } from '../data';

async function pdfDataToJson(): Promise<void> {
  for (const pdf of getDocumentData('normalized-pdf')) {
    await toPdfJson(pdf);
  }
}

async function toPdfJson(pdfNode: DocumentNode): Promise<void> {
  console.log('start', pdfNode);
}

pdfDataToJson();

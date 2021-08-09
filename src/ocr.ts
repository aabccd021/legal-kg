import { execOCR } from './exec_ocr';
import { getDocumentData, nodeToFile, shouldOverwrite } from './util';

async function ocr(): Promise<void> {
  const jsonNodes = getDocumentData('pdf');

  for (const node of jsonNodes) {
    console.log('\nstart', node);

    const rawPdfFile = nodeToFile('pdf', node);
    const normalizedPdfFile = nodeToFile('normalized-pdf', node);

    if (!shouldOverwrite() && normalizedPdfFile.exists) {
      console.log('skipped because exists');
      continue;
    }

    await execOCR(rawPdfFile.path, normalizedPdfFile.path);
  }
}

ocr();

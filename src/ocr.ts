import { exec } from 'child_process';
import { promisify } from 'util';
import { getDocumentData, nodeToFile, shouldOverwrite } from './util';

const awaitExec = promisify(exec);

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

    try {
      await awaitExec(
        `ocrmypdf` +
          ` -l ind` +
          ` --force-ocr` +
          ` --jobs 4` +
          ` --tesseract-config tesseract-config.cfg` +
          ` ${rawPdfFile.path} ${normalizedPdfFile.path}`
      );
    } catch (e) {
      console.log(e);
      continue;
    }
  }
}

ocr();

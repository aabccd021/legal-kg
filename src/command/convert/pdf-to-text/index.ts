import { isEmpty } from 'lodash';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { getDocumentData, getDocumentFilePath } from '../../../data';

export function pdf2txt(): void {
  const legals = getDocumentData('pdf');
  legals.forEach((legal) => {
    const pdfPath = getDocumentFilePath(legal, 'pdf');
    const textPath = getDocumentFilePath(legal, 'text');

    try {
      PyMuPDF(pdfPath, textPath);

      const rawText = fs.readFileSync(textPath).toString();
      const processedText = postProcess(rawText);
      fs.writeFileSync(textPath, processedText);

      console.log(`Finished pdf2text ${textPath}`);
    } catch {
      console.log(`Error pdf2text ${textPath}`);
    }
  });
}

function postProcess(raw: string): string {
  const lines = raw.split('\n');
  return lines
    .map((line) => line.trim())
    .filter((line) => !isEmpty(line))
    .join('\n');
}

function PyMuPDF(pdfPath: string, textPath: string): void {
  execSync(`/usr/bin/python3 script/pdf2text/PyMuPDF/index.py ${pdfPath} ${textPath}`);
}

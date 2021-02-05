import { isEmpty } from 'lodash';
import { getLegalData, DataDir, getDocFilePath } from '../utils';
import { execSync } from 'child_process';
import * as fs from 'fs';

async function pdf2txt() {
  const legalDir = 'maintained_legals';
  const pdfDir: DataDir = { legalDir, dataType: 'pdf' };
  const textDir: DataDir = { legalDir, dataType: 'text' };

  const legals = getLegalData(pdfDir);
  legals.forEach((legal) => {
    const pdfPath = getDocFilePath(legal, pdfDir);
    const textPath = getDocFilePath(legal, textDir);

    PyMuPDF(pdfPath, textPath);

    const rawText = fs.readFileSync(textPath).toString();
    const processedText = postProcess(rawText);
    fs.writeFileSync(textPath, processedText);

    console.log(`Finished pdf2text ${textPath}`);
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

pdf2txt();

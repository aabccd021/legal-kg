import { isEmpty } from 'lodash';
import { getDocumentData, DataDir, getDocFilePath } from '../utils';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { getConfig } from '../../utils';

async function pdf2txt() {
  const { dataDir } = getConfig();
  const pdfDir: DataDir = { dir: dataDir, dataType: 'pdf' };
  const textDir: DataDir = { dir: dataDir, dataType: 'text' };

  const legals = getDocumentData(pdfDir);
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

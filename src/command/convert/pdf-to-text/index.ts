import { isEmpty } from 'lodash';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { getDocumentData, getDocumentFilePath } from '../../../data';
import { DocumentNode } from '../../../legal/document';

type Option = { overwrite: boolean };
export function pdfToTxt(option: Option): void {
  const pdfs = getDocumentData('pdf');
  pdfs.forEach((pdf) => handlePdf(pdf, option));
}

function handlePdf(pdf: DocumentNode, option: Option): void {
  const { overwrite } = option;
  const pdfFile = getDocumentFilePath(pdf, 'pdf');
  const { path: textPath, exists: textExists } = getDocumentFilePath(pdf, 'text');
  try {
    if (!overwrite && textExists) {
      console.log(`Skipped pdf-to-text ${textPath}`);
      return;
    }

    PyMuPDF(pdfFile.path, textPath);

    const rawText = fs.readFileSync(textPath).toString();
    const processedText = postProcess(rawText);
    fs.writeFileSync(textPath, processedText);

    console.log(`Finished pdf-to-text ${textPath}`);
  } catch {
    console.log(`Error pdf-to-text ${textPath}`);
  }
}

function postProcess(raw: string): string {
  const lines = raw.split('\n');
  return lines
    .map((line) => line.trim())
    .filter((line) => !isEmpty(line))
    .join('\n');
}

function PyMuPDF(pdfPath: string, textPath: string): void {
  execSync(`/usr/bin/python3 script/pdf-to-text/PyMuPDF/index.py ${pdfPath} ${textPath}`);
}

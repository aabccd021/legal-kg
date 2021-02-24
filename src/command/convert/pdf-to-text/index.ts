import { execSync } from 'child_process';
import * as fs from 'fs';
import { chain, curry, isEmpty } from 'lodash';
import { getDocumentData, getDocumentFilePath } from '../../../data';
import { DocumentNode } from '../../../legal/document';

type Option = { overwrite: boolean };
export function pdfToTxt(option: Option): void {
  const pdfs = getDocumentData('pdf');
  pdfs.forEach(handlePdf(option));
}

const handlePdf = curry(_handlePdf);

function _handlePdf(option: Option, pdf: DocumentNode): void {
  const { overwrite } = option;
  const pdfFile = getDocumentFilePath(pdf, 'pdf');
  const { path: textPath, exists: textExists } = getDocumentFilePath(pdf, 'text');

  console.log(`Start processing ${textPath}`);
  try {
    if (!overwrite && textExists) {
      console.log(`Skipped pdf-to-text ${textPath}`);
      return;
    }

    PyMuPDF(pdfFile.path, textPath);

    const rawText = fs.readFileSync(textPath).toString();
    const processedText = postProcess(rawText.split('\n'));
    fs.writeFileSync(textPath, processedText.join('\n'));

    console.log(`Finished pdf-to-text ${textPath}`);
  } catch (e) {
    console.error(`Error pdf-to-text ${textPath}: ${e}`);
  }
  console.log();
}

function postProcess(lines: string[]): string[] {
  return chain(lines)
    .map((line) => line.trim())
    .filter((line) => !isEmpty(line))
    .reduce(removePageNoise, [])
    .value();
}

function removePageNoise(lines: string[], line: string): string[] {
  return /^-\s?[0-9]*\s?-/.test(line) ? lines.slice(0, -3) : [...lines, line];
}

function PyMuPDF(pdfPath: string, textPath: string): void {
  execSync(`/usr/bin/python3 script/pdf-to-text/PyMuPDF/index.py ${pdfPath} ${textPath}`);
  const rawText = fs.readFileSync(textPath).toString();
  const extraction: PyMuPDFPage[] = JSON.parse(rawText);
  const text = extraction
    .flatMap(({ blocks }) => chain(blocks).compact().sort(byLineYCoordinate).value())
    .flatMap((block) => block?.lines)
    .flatMap((line) => line?.spans?.map((span) => span?.text).join(''))
    .join('\n');
  fs.writeFileSync(textPath, text);
}

function byLineYCoordinate(a: Block, b: Block): number {
  return a.bbox[3] - b.bbox[3];
}

type Bbox = [number, number, number, number];

type Span = {
  size?: number;
  flags?: number;
  font?: string;
  color?: number;
  text?: string;
  origin?: [number, number];
  bbox?: number[];
};

type Line = Partial<{
  spans: Span[];
  wmode: number;
  dir: number[];
  bbox: number[];
}>;

type Block = {
  number?: number;
  type?: number;
  bbox: Bbox;
  lines?: Line[];
};

type PyMuPDFPage = Partial<{
  width: number;
  height: number;
  blocks: Block[];
}>;

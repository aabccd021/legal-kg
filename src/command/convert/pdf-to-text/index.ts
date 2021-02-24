import { execSync } from 'child_process';
import * as fs from 'fs';
import { chain, curry, isEmpty, isUndefined } from 'lodash';
import { getDocumentData, getDocumentFilePath, getTempFilePath } from '../../../data';
import { DocumentNode } from '../../../legal/document';

type Option = { overwrite: boolean };
export function pdfToTxt(option: Option): void {
  const pdfs = getDocumentData('pdf');
  pdfs.forEach(handlePdf(option));
}

const handlePdf = curry(_handlePdf);

function _handlePdf(option: Option, node: DocumentNode): void {
  console.log(`Start processing ${JSON.stringify(node)}`);
  const { overwrite } = option;
  const pdfFile = getDocumentFilePath(node, 'pdf');
  const { path: textPath, exists: textExists } = getDocumentFilePath(node, 'text');

  try {
    if (!overwrite && textExists) {
      console.log(`Skipped pdf-to-text ${textPath}`);
      return;
    }

    PyMuPDF(pdfFile.path, textPath, node);

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
    .value();
}

// function x(lines: string[], line: string): string[] {
//   return /^-\s?[0-9]*\s?-/.test(line) ? lines.slice(0, -3) : [...lines, line];
// }

function PyMuPDF(pdfPath: string, textPath: string, node: DocumentNode): void {
  const scannedJson = getTempFilePath(node, 'PyMuPDF', '.json');
  if (!scannedJson.exists) {
    execSync(`/usr/bin/python3 script/pdf-to-text/PyMuPDF/index.py ${pdfPath} ${scannedJson.path}`);
  }
  const rawText = fs.readFileSync(scannedJson.path).toString();
  const extraction: PyMuPDFPage[] = JSON.parse(rawText);
  const text = chain(extraction)
    .flatMap(({ blocks }) => chain(blocks).compact().sort(byLineYCoordinate).value())
    .reduce<Acc>(removePageNoise, { blocks: [], isAfterNoise: false })
    .thru(({ blocks }) => blocks)
    .flatMap((block) => block.lines)
    .flatMap((line) => line?.spans?.map((span) => span?.text).join(''))
    .join('\n')
    .value();
  fs.writeFileSync(textPath, text);
}

type Acc = {
  blocks: Block[];
  isAfterNoise: boolean;
};

function removePageNoise(acc: Acc, block: Block): Acc {
  const { blocks, isAfterNoise } = acc;

  const blockText = block.lines?.[0]?.spans?.map((span) => span.text).join('');
  if (isUndefined(blockText)) return acc;

  if (isAfterNoise) {
    const latestBlock = blocks?.slice(-1)[0];
    if (!isUndefined(latestBlock)) {
      const latestBlockLines = latestBlock.lines;
      if (!isUndefined(latestBlockLines)) {
        const latestLine = latestBlockLines.slice(-1)[0];
        if (!isUndefined(latestLine)) {
          const lineText = latestLine.spans?.map((span) => span.text).join('') ?? '';
          if (/^SK No/.test(lineText) || lineText.endsWith('. . .') || lineText.endsWith('...')) {
            const newLines: Line[] = latestBlockLines.slice(0, -1);
            const newLatestBlock: Block = { ...latestBlock, lines: newLines };
            return {
              blocks: [...blocks.slice(0, -1), newLatestBlock, block],
              isAfterNoise: true,
            };
          }
          const firstText = block.lines?.[0]?.spans?.[0]?.text;
          if (!isUndefined(firstText) && lineText.startsWith(firstText)) {
            return {
              blocks: [...blocks.slice(0, -1), block],
              isAfterNoise: true,
            };
          }
        }
      }
    }

    return { blocks: [...blocks, block], isAfterNoise: false };
  }

  const noiseRegexp = /^-\s?[0-9]*\s?-/;

  const blockTextIsNoise = noiseRegexp.test(blockText);
  if (blockTextIsNoise) {
    // console.log('blocktextisnoise');
    // console.log(blockText);
    return { blocks: blocks.slice(0, -2), isAfterNoise: true };
  }

  const hasNoiseText = block.lines?.some((line) =>
    line.spans?.some(({ text }) => noiseRegexp.test(text ?? ''))
  );
  if (hasNoiseText) {
    // console.log('hasnoisetext');
    // console.log(
    //   block.lines?.flatMap((line) => line.spans?.flatMap((span) => span.text)).join('===')
    // );
    // console.log();
    return { blocks, isAfterNoise: true };
  }

  return { blocks: [...blocks, block], isAfterNoise: false };
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

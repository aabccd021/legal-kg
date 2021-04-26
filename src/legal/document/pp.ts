import { isNumber } from 'lodash';
import { DataType, getDataTypeExtension } from '../../data';
import { _ConvertableDocumentHandler } from './_utils';
import * as fs from 'fs';
import path from 'path';

export type PPNode = {
  nodeType: 'document';
  docType: 'pp';
  tahun: number;
  nomor: number;
};

export const _pp: _ConvertableDocumentHandler<PPNode> = {
  getPath,
  getName,
  nodeOfPath,
  compare,
  getFiles,
};

/**
 * Get path
 */
function getPath(node: PPNode): string {
  const { tahun, nomor } = node;
  return `${tahun}/${nomor}`;
}

function nodeOfPath(path: string[]): PPNode {
  const [tahun, nomor] = path;
  if (!isNumber(tahun) || !isNumber(nomor)) {
    throw Error(`Unknown Perda Path ${path}`);
  }
  return { nodeType: 'document', docType: 'pp', tahun, nomor };
}

/**
 * Get name
 */
function getName(node: PPNode): string {
  const { tahun, nomor } = node;
  return `PERATURAN PEMERINTAH TAHUN ${tahun} NOMOR ${nomor}`;
}

/**
 * Compare
 */
function compare(a: PPNode, b: PPNode): number {
  const tahunDiff = a.tahun - b.tahun;
  if (tahunDiff !== 0) return tahunDiff;

  return a.nomor - b.nomor;
}

function getFiles(uuDir: string, dataType: DataType): PPNode[] {
  return fs.readdirSync(uuDir).flatMap((year) =>
    fs
      .readdirSync(path.join(uuDir, year))
      .map((pdfName) => path.basename(pdfName, getDataTypeExtension(dataType)))
      .filter((number) => parseInt(number) >= 0)
      .map((number) => ({
        nodeType: 'document',
        docType: 'pp',
        tahun: parseInt(year),
        nomor: parseInt(number),
      }))
  );
}

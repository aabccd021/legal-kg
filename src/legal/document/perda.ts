import assertNever from 'assert-never';
import path from 'path';
import { _ConvertableDocumentHandler } from './_utils';
import * as fs from 'fs';
import { DataType, getDataTypeExtension } from '../../data';
import { isNumber, isUndefined } from 'lodash';

export type Daerah = typeof DAERAHS[number];

export const DAERAHS = ['provinsi_dki_jakarta'] as const;

function isDaerahString(str: string | undefined): str is Daerah {
  if (isUndefined(str)) return false;
  return DAERAHS.includes(str as Daerah);
}

export type PerdaNode = {
  _structureType: 'document';
  _documentType: 'perda';
  daerah: Daerah;
  tahun: number;
  nomor: number;
};

export const _perda: _ConvertableDocumentHandler<PerdaNode> = {
  getPath,
  getName,
  nodeOfPath,
  compare,
  getFiles,
};

/**
 * Get path
 */
function getPath(node: PerdaNode): string {
  const { daerah, tahun, nomor } = node;
  return `${daerah}/${tahun}/${nomor}`;
}

function nodeOfPath(path: string[]): PerdaNode {
  const [daerah, tahun, nomor] = path;
  if (!isDaerahString(daerah) || !isNumber(tahun) || !isNumber(nomor)) {
    throw Error(`Unknown Perda Path ${path}`);
  }
  return { _structureType: 'document', _documentType: 'perda', daerah, tahun, nomor };
}

/**
 * Get name
 */
function getName(node: PerdaNode): string {
  const { daerah, tahun, nomor } = node;
  const daerahName = getPerdaDaerahName(daerah);
  return `PERATURAN ${daerahName} TAHUN ${tahun} NOMOR ${nomor}`;
}
function getPerdaDaerahName(daerah: Daerah): string {
  if (daerah === 'provinsi_dki_jakarta') return 'GUBERNUR DAERAH KHUSUS IBU KOTA JAKARTA';
  assertNever(daerah);
}

/**
 * Compare
 */
function compare(a: PerdaNode, b: PerdaNode): number {
  const daerahDiff = a.daerah.localeCompare(b.daerah);
  if (daerahDiff !== 0) return daerahDiff;

  const tahunDiff = a.tahun - b.tahun;
  if (tahunDiff !== 0) return tahunDiff;

  return a.nomor - b.nomor;
}

/**
 * Get Files
 */
function getFiles(dir: string, dataType: DataType): PerdaNode[] {
  return DAERAHS.flatMap((daerah) => {
    const daerahDir = path.join(dir, daerah);
    if (!fs.existsSync(daerahDir)) return [];
    return fs.readdirSync(daerahDir).flatMap((year) =>
      fs
        .readdirSync(path.join(daerahDir, year))
        .map((pdfName) => path.basename(pdfName, getDataTypeExtension(dataType)))
        .map((number) => ({
          _structureType: 'document',
          _documentType: 'perda',
          daerah,
          tahun: parseInt(year),
          nomor: parseInt(number),
        }))
    );
  });
}

import { assertNever } from 'assert-never';
import path from 'path';
import * as fs from 'fs';
import { parseInt } from 'lodash';
import {
  legalTypes,
  LegalType,
  daerahs,
  LegalTrace,
  PerdaTrace,
  UuTrace,
  getLegalPath,
} from '../uri/legal-type-uri';

export type DataType = 'pdf' | 'text' | 'json' | 'md' | 'ttl';
export type DataDir = { legalDir: string; dataType: DataType };
function getDataTypeExtension(dataType: DataType): string {
  const extension = _getDataTypeExtension(dataType);
  return `.${extension}`;
}
function _getDataTypeExtension(dataType: DataType): string {
  if (dataType === 'pdf') return 'pdf';
  if (dataType === 'text') return 'txt';
  if (dataType === 'json') return 'json';
  if (dataType === 'md') return 'md';
  if (dataType === 'ttl') return 'ttl';
  assertNever(dataType);
}

export function getDocFilePath(trace: LegalTrace, dataDir: DataDir): string {
  const { legalDir, dataType } = dataDir;
  const extension = getDataTypeExtension(dataType);
  const docPath = getLegalPath(trace);
  const filePath = `${legalDir}/${dataType}/${docPath}${extension}`;
  const fileDir = path.dirname(filePath);
  fs.mkdirSync(fileDir, { recursive: true });
  return filePath;
}

export function getLegalData(dataDir: DataDir): LegalTrace[] {
  const { legalDir, dataType } = dataDir;
  return legalTypes.flatMap((legalType) => toLegalID(legalType, legalDir, dataType));
}

function toLegalID(legalType: LegalType, legalDir: string, dataType: DataType): LegalTrace[] {
  const legalTypeDir = path.join(legalDir, dataType, legalType);
  if (!fs.existsSync(legalTypeDir)) return [];
  if (legalType === 'perda') return findFilePerdaTrace(legalTypeDir, dataType);
  if (legalType === 'uu') return findFileUuTraces(legalTypeDir, dataType);
  if (legalType === 'uud') throw Error('UUD not supported');
  assertNever(legalType);
}

function findFileUuTraces(uuDir: string, dataType: DataType): UuTrace[] {
  const extension = getDataTypeExtension(dataType);
  return fs.readdirSync(uuDir).flatMap((year) =>
    fs
      .readdirSync(path.join(uuDir, year))
      .map((pdfName) => path.basename(pdfName, `${extension}`))
      .map((number) => ({
        type: 'uu',
        tahun: parseInt(year),
        nomor: parseInt(number),
      }))
  );
}

function findFilePerdaTrace(dir: string, dataType: DataType): PerdaTrace[] {
  const extension = getDataTypeExtension(dataType);
  return daerahs.flatMap((daerah) => {
    const daerahDir = path.join(dir, daerah);
    if (!fs.existsSync(daerahDir)) return [];
    return fs.readdirSync(daerahDir).flatMap((year) =>
      fs
        .readdirSync(path.join(daerahDir, year))
        .map((pdfName) => path.basename(pdfName, `${extension}`))
        .map((number) => ({
          type: 'perda',
          daerah,
          tahun: parseInt(year),
          nomor: parseInt(number),
        }))
    );
  });
}

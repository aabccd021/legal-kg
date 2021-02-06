import { assertNever } from 'assert-never';
import path from 'path';
import * as fs from 'fs';
import { parseInt } from 'lodash';
import {
  DOCUMENT_TYPES,
  DocumentType,
  DAERAHS,
  DocumentNode,
  PerdaNode,
  UuNode,
  getDocumentPath,
} from '../uri/document-type';

export type DataType = 'pdf' | 'text' | 'json' | 'md' | 'ttl';
export type DataDir = { dir: string; dataType: DataType };
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

export function getDocFilePath(node: DocumentNode, dataDir: DataDir): string {
  const { dir, dataType } = dataDir;
  const extension = getDataTypeExtension(dataType);
  const docPath = getDocumentPath(node);
  const filePath = `${dir}/${dataType}/${docPath}${extension}`;
  const fileDir = path.dirname(filePath);
  fs.mkdirSync(fileDir, { recursive: true });
  return filePath;
}

export function getDocumentData(dataDir: DataDir): DocumentNode[] {
  const { dir, dataType } = dataDir;
  return DOCUMENT_TYPES.flatMap((docType) => toDocumentNode(docType, dir, dataType));
}

function toDocumentNode(
  documentType: DocumentType,
  dir: string,
  dataType: DataType
): DocumentNode[] {
  const documentTypeDir = path.join(dir, dataType, documentType);
  if (!fs.existsSync(documentTypeDir)) return [];
  if (documentType === 'perda') return findFilePerdaNode(documentTypeDir, dataType);
  if (documentType === 'uu') return findFileUuNode(documentTypeDir, dataType);
  if (documentType === 'uud') throw Error('UUD not supported');
  assertNever(documentType);
}

function findFileUuNode(uuDir: string, dataType: DataType): UuNode[] {
  const extension = getDataTypeExtension(dataType);
  return fs.readdirSync(uuDir).flatMap((year) =>
    fs
      .readdirSync(path.join(uuDir, year))
      .map((pdfName) => path.basename(pdfName, `${extension}`))
      .map((number) => ({
        documentType: 'uu',
        tahun: parseInt(year),
        nomor: parseInt(number),
      }))
  );
}

function findFilePerdaNode(dir: string, dataType: DataType): PerdaNode[] {
  const extension = getDataTypeExtension(dataType);
  return DAERAHS.flatMap((daerah) => {
    const daerahDir = path.join(dir, daerah);
    if (!fs.existsSync(daerahDir)) return [];
    return fs.readdirSync(daerahDir).flatMap((year) =>
      fs
        .readdirSync(path.join(daerahDir, year))
        .map((pdfName) => path.basename(pdfName, `${extension}`))
        .map((number) => ({
          documentType: 'perda',
          daerah,
          tahun: parseInt(year),
          nomor: parseInt(number),
        }))
    );
  });
}

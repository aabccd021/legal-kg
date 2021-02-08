import assertNever from 'assert-never';
import path from 'path';
import * as fs from 'fs';
import {
  DocumentNode,
  getDocumentPath,
  getConvertableDocumentFiles,
  CONVERTABLE_DOCUMENT_CATEGORY,
} from '../legal/document';

export type DataType = 'pdf' | 'text' | 'json' | 'md' | 'ttl';
export type DataDir = { dir: string; dataType: DataType };
export function getDataTypeExtension(dataType: DataType): string {
  const extension = getDataTypeExtensionStr(dataType);
  return `.${extension}`;
}
function getDataTypeExtensionStr(dataType: DataType): string {
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
  return CONVERTABLE_DOCUMENT_CATEGORY.flatMap((docType) =>
    getConvertableDocumentFiles(docType, dir, dataType)
  );
}

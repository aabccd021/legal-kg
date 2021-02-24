import assertNever from 'assert-never';
import * as fs from 'fs';
import {
  DocumentNode,
  getDocumentPath,
  getConvertableDocumentFiles,
  CONVERTABLE_DOCUMENT_CATEGORY,
} from '../legal/document';
import { getConfig } from '../config';
import path from 'path';

export type DataType = 'pdf' | 'text' | 'json' | 'md' | 'ttl';
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

export function getDocumentFilePath(
  node: DocumentNode,
  dataType: DataType
): { path: string; exists: boolean } {
  const { dataDir } = getConfig();
  const extension = getDataTypeExtension(dataType);
  const docPath = getDocumentPath(node);
  const filePath = `${dataDir}/${dataType}/${docPath}${extension}`;

  const fileDir = path.dirname(filePath);
  fs.mkdirSync(fileDir, { recursive: true });

  const exists = fs.existsSync(filePath);

  return { path: filePath, exists };
}

export function getTempFilePath(
  node: DocumentNode,
  name: string,
  extension: string
): { path: string; exists: boolean } {
  const { dataDir } = getConfig();
  const docPath = getDocumentPath(node);
  const filePath = `${dataDir}/temp/${name}/${docPath}${extension}`;

  const fileDir = path.dirname(filePath);
  fs.mkdirSync(fileDir, { recursive: true });

  const exists = fs.existsSync(filePath);

  return { path: filePath, exists };
}

export function getDocumentData(dataType: DataType): DocumentNode[] {
  const { dataDir } = getConfig();
  return CONVERTABLE_DOCUMENT_CATEGORY.flatMap((docType) =>
    getConvertableDocumentFiles(docType, dataDir, dataType)
  );
}

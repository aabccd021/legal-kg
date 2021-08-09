import { assertNever } from 'assert-never';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { reduce, isUndefined, join, curry } from 'lodash';
import path from 'path';
import { getConfig } from './config';
import {
  DocumentNode,
  getDocumentPath,
  CONVERTABLE_DOCUMENT_TYPE,
  getConvertableDocumentFiles,
} from './document';

export function bothFilter<T>(
  arr: T[],
  callback: (el: T, arr: T[]) => boolean
): BothFilterResult<T> {
  return reduce<T, BothFilterResult<T>>(
    arr,
    (acc, el) => {
      const isRight = callback(el, arr);
      const left = isRight ? acc.left : [...acc.left, el];
      const right = isRight ? [...acc.right, el] : acc.right;
      return { left, right };
    },
    { left: [], right: [] }
  );
}

type BothFilterResult<T> = {
  left: T[];
  right: T[];
};

export type UnindexedSpan = {
  xL: number;
  y: number;
  xR: number;
  pageNum: number;
  str: string;
};

export type Span = UnindexedSpan & {
  id: number;
};

export function neverNum(x?: string | number): number {
  throw Error(x?.toString());
}
export function neverString(x?: string): string {
  throw Error(x);
}

export function neverUndefined<T>(x: T | undefined, msg?: unknown): T {
  if (!isUndefined(x)) return x;
  throw Error(JSON.stringify(msg));
}

export function lastOf<T>(arr: T[]): T | undefined {
  return arr.slice(-1)[0];
}

export function toValue<T, K extends keyof T>(key: K): (obj: T) => T[K] {
  return function mapper(obj: T): T[K] {
    return obj[key];
  };
}

export function writeFile(path: string) {
  return function write(content: string): void {
    return writeFileSync(path, content);
  };
}

export function joinWith(joiner: string) {
  return function _join(strArr: string[]): string {
    return join(strArr, joiner);
  };
}

export function shouldOverwrite(): boolean {
  return process.argv.includes('--overwrite');
}

export type DataType =
  | 'pdf'
  | 'normalized-pdf'
  | 'span-raw'
  | 'span-normalized'
  | 'span-mixed'
  | 'data'
  | 'pdf-scan'
  | 'normalized-pdf-scan'
  | 'md'
  | 'query_result'
  | 'ttl';
export function getDataTypeExtension(dataType: DataType): string {
  const extension = getDataTypeExtensionStr(dataType);
  return `.${extension}`;
}
function getDataTypeExtensionStr(dataType: DataType): string {
  if (dataType === 'pdf') return 'pdf';
  if (dataType === 'normalized-pdf') return 'pdf';
  if (dataType === 'data') return 'yaml';
  if (dataType === 'md') return 'md';
  if (dataType === 'ttl') return 'ttl';
  if (dataType === 'query_result') return 'md';
  if (dataType === 'span-raw') return 'yaml';
  if (dataType === 'span-normalized') return 'yaml';
  if (dataType === 'span-mixed') return 'yaml';
  if (dataType === 'normalized-pdf-scan') return 'yaml';
  if (dataType === 'pdf-scan') return 'yaml';
  assertNever(dataType);
}

export const nodeToFileWith = curry(nodeToFile);
export function nodeToFile(
  dataType: DataType,
  node: DocumentNode
): { path: string; exists: boolean } {
  const { dataDir } = getConfig();
  const extension = getDataTypeExtension(dataType);
  const docPath = getDocumentPath(node);
  const filePath = `${dataDir}/${dataType}/${docPath}${extension}`;

  const fileDir = path.dirname(filePath);
  mkdirSync(fileDir, { recursive: true });

  const exists = existsSync(filePath);

  return { path: filePath, exists };
}

export function getDocumentData(dataType: DataType): DocumentNode[] {
  const { dataDir } = getConfig();
  return CONVERTABLE_DOCUMENT_TYPE.flatMap((docType) =>
    getConvertableDocumentFiles(docType, dataDir, dataType)
  );
}

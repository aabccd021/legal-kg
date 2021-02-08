import { ConvertableDocumentNode } from './index';
import { DocumentNode, ScrapableDocumentNode } from '.';
import { DataType } from '../../data';

export type _DocumentHandler<T extends DocumentNode> = {
  getPath: (node: T) => string;
  getName: (node: T) => string;
};

export type _ConvertableDocumentHandler<T extends ConvertableDocumentNode> = _DocumentHandler<T> & {
  getFiles: (dir: string, dataType: DataType) => T[];
};

export type _ScrapableDocumentHandler<
  T extends ScrapableDocumentNode
> = _ConvertableDocumentHandler<T> & {
  compare: (a: T, b: T) => number;
  lastPage: number;
  getPdfUrl: (downloadEl: string) => string;
  nameToNode: (name: string) => T;
};

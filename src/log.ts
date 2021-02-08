import * as fs from 'fs';
import stringify from 'json-stable-stringify';
import _, { isEqual } from 'lodash';
import {
  compareConvertableDocument,
  ConvertableDocumentNode,
  DocumentNode,
} from './legal/document';

export type DocumentLog = UpdateIndexSuccessDocumentLog | UpdateIndexErrorDocumentLog;

type LogDetail = {
  _node: ConvertableDocumentNode;
  detailUrl: string;
  pdfUrl: string;
  tentang: string;
};

type SuccessDocumentLog = {
  status: 'success';
  lastMethod: DocumentMethods | 'update-index';
};

type ErrorDocumentLog = {
  status: 'error';
  lastError: DocumentMethods;
  message?: unknown;
};

type UpdateIndexSuccessDocumentLog = LogDetail & (SuccessDocumentLog | ErrorDocumentLog);

type UpdateIndexErrorDocumentLog = {
  status: 'update-index-error';
  message?: unknown;
};

type DocumentMethods = 'download-pdf' | 'text-to-json' | 'json-to-ttl' | 'json-to-md';

const filePath = 'legal-log.json';

export function readLogs(): DocumentLog[] {
  try {
    return JSON.parse(fs.readFileSync(filePath).toString());
  } catch {
    return [];
  }
}

export function writeLogs(newLogs: DocumentLog[]): void {
  const errorLogs = _(newLogs)
    .map((log) => (log.status === 'update-index-error' ? log : undefined))
    .compact()
    .value();
  const successLogs = _(newLogs)
    .map((log) => (log.status === 'update-index-error' ? undefined : log))
    .compact()
    .value();

  const newNodes = successLogs.map(({ _node }) => _node);

  const oldLogs = errorLogs.length >= 1 ? getOldLogsWithoutUpdateIndexError() : readLogs();
  const oldLogsWithoutDuplicate = oldLogs.filter(duplicateNode(newNodes));

  const mergedLogs = [...oldLogsWithoutDuplicate, ...errorLogs, ...successLogs];
  const sortedLogs = mergedLogs.sort((a, b) => {
    if (a.status !== 'update-index-error' && b.status !== 'update-index-error') {
      return compareConvertableDocument(a._node, b._node);
    }
    return a.status === 'update-index-error' ? 1 : -1;
  });
  fs.writeFileSync(filePath, stringify(sortedLogs, { space: 2 }));
}

export function duplicateNode(nodes: DocumentNode[]): (log: DocumentLog) => boolean {
  return (log) => {
    if (log.status === 'update-index-error') return true;
    if (nodes.some((node) => isEqual(node, log._node))) return false;
    return true;
  };
}

function getOldLogsWithoutUpdateIndexError(): DocumentLog[] {
  return _(readLogs())
    .map((log) => (log.status === 'update-index-error' ? null : log))
    .compact()
    .value();
}

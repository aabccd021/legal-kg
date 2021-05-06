import * as fs from 'fs';
import stringify from 'json-stable-stringify';
import _, { isEqual } from 'lodash';
import {
  compareConvertableDocument,
  ConvertableDocumentNode,
  DocumentNode,
} from './document';

export type DocumentLog = ConvertDocumentLog | ErrorDocumentLog;

export type ConvertDocumentLog = {
  status: 'convert';
  _node: ConvertableDocumentNode;
  detailUrl: string;
  pdfUrl: string;
  tentang: string;
  downloadPdfError?: unknown;
  textToJsonError?: unknown;
  jsonToTtlError?: unknown;
  jsonToMdError?: unknown;
};

type ErrorDocumentLog = {
  status: 'update-index-error';
  message?: unknown;
};

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
  const convertLogs = _(newLogs).map(toConvertDocumentLog).compact().value();

  const newNodes = convertLogs.map(({ _node }) => _node);

  const oldLogs = errorLogs.length >= 1 ? getOldLogsWithoutUpdateIndexError() : readLogs();
  const oldLogsWithoutDuplicate = oldLogs.filter((log) => !includeLog(newNodes, log));

  const mergedLogs = [...oldLogsWithoutDuplicate, ...errorLogs, ...convertLogs];
  const sortedLogs = mergedLogs.sort(compareDocumentLog);
  fs.writeFileSync(filePath, stringify(sortedLogs, { space: 2 }));
}

export function toConvertDocumentLog(log: DocumentLog): ConvertDocumentLog | undefined {
  return log.status === 'update-index-error' ? undefined : log;
}

function compareDocumentLog(a: DocumentLog, b: DocumentLog): number {
  if (a.status !== 'update-index-error' && b.status !== 'update-index-error') {
    return compareConvertableDocument(a._node, b._node);
  }
  return a.status === 'update-index-error' ? 1 : -1;
}

export function includeLog(nodes: DocumentNode[], log: DocumentLog): boolean {
  if (log.status === 'update-index-error') return false;
  if (nodes.some((node) => isEqual(node, log._node))) return true;
  return false;
}

function getOldLogsWithoutUpdateIndexError(): DocumentLog[] {
  return _(readLogs())
    .map((log) => (log.status === 'update-index-error' ? null : log))
    .compact()
    .value();
}

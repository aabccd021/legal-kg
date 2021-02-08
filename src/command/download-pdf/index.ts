import * as fs from 'fs';
import _, { compact } from 'lodash';
import fetch from 'node-fetch';
import { pipeline } from 'stream';
import * as util from 'util';
import { getDocumentData, getDocumentFilePath } from '../../data';
import { DocumentNode, getDocumentName } from '../../legal/document';
import {
  ConvertDocumentLog,
  DocumentLog,
  includeLog,
  readLogs,
  toConvertDocumentLog,
  writeLogs,
} from '../../log';

const streamPipeline = util.promisify(pipeline);

export async function downloadPdf(params: { overwrite: boolean }): Promise<void> {
  const nodes = getDocumentData('pdf');
  const convertLogs = compact(readLogs().map(toConvertDocumentLog));
  console.log(`Start Downloading ${convertLogs.length} PDFs`);

  const result = await Promise.allSettled(
    convertLogs.map((log) => downloadFile(log, nodes, params))
  );
  const newLogs = _(result)
    .map((res) => (res.status === 'fulfilled' ? res.value : undefined))
    .compact()
    .value();

  writeLogs(newLogs);
  console.log('Done Downloading PDF');
}

async function downloadFile(
  log: ConvertDocumentLog,
  nodes: DocumentNode[],
  params: { overwrite: boolean }
): Promise<DocumentLog> {
  try {
    const { overwrite } = params;
    if (!overwrite && includeLog(nodes, log)) {
      return { ...log, downloadPdfError: undefined };
    }
    const { pdfUrl, _node } = log;

    const response = await fetch(pdfUrl);
    const filePath = getDocumentFilePath(_node, 'pdf');
    await streamPipeline(response.body, fs.createWriteStream(filePath));

    const legalName = getDocumentName(_node);
    console.log(`Done download ${legalName}`);
  } catch (error) {
    if (error instanceof Error) {
      const downloadPdfError = error.stack?.split('\n');
      return { ...log, downloadPdfError };
    }
    return { ...log, downloadPdfError: 'unknown error' };
  }
  return { ...log, downloadPdfError: undefined };
}

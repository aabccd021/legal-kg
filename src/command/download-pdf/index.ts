import * as fs from 'fs';
import _, { compact } from 'lodash';
import fetch from 'node-fetch';
import { pipeline } from 'stream';
import * as util from 'util';
import { nodeToFile } from '../../data';
import { nodeToName } from '../../legal/document';
import {
  ConvertDocumentLog,
  DocumentLog,
  readLogs,
  toConvertDocumentLog,
  writeLogs,
} from '../../log';

const streamPipeline = util.promisify(pipeline);

export async function downloadPdf(option: { overwrite: boolean }): Promise<void> {
  const convertLogs = compact(readLogs().map(toConvertDocumentLog));
  console.log(`Start Downloading ${convertLogs.length} PDFs`);

  const result = await Promise.allSettled(convertLogs.map((log) => downloadFile(log, option)));
  const newLogs = _(result)
    .map((res) => (res.status === 'fulfilled' ? res.value : undefined))
    .compact()
    .value();

  writeLogs(newLogs);
  console.log('Done Downloading PDF');
}

async function downloadFile(
  log: ConvertDocumentLog,
  option: { overwrite: boolean }
): Promise<DocumentLog> {
  try {
    const { pdfUrl, _node } = log;
    const { overwrite } = option;

    const pdfFile = nodeToFile('pdf', _node);

    if (!overwrite && pdfFile.exists) {
      return { ...log, downloadPdfError: undefined };
    }

    const response = await fetch(pdfUrl);
    await streamPipeline(response.body, fs.createWriteStream(pdfFile.path));

    const legalName = nodeToName(_node);
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

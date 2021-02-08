import * as fs from 'fs';
import _ from 'lodash';
import fetch from 'node-fetch';
import { pipeline } from 'stream';
import * as util from 'util';
import { getDocumentData, getDocumentFilePath } from '../../data';
import { getDocumentName } from '../../legal/document';
import { DocumentLog, duplicateNode, readLogs, writeLogs } from '../../log';

const streamPipeline = util.promisify(pipeline);

export async function downloadPdf(params: { overwrite: boolean }): Promise<void> {
  console.log('Start Downloading');

  const { overwrite } = params;

  const nodes = getDocumentData('text');
  const logs = overwrite ? readLogs() : readLogs().filter(duplicateNode(nodes));

  const result = await Promise.allSettled(logs.map(downloadFile));
  const newLogs = _(result)
    .map((res) => (res.status === 'fulfilled' ? res.value : undefined))
    .compact()
    .value();

  writeLogs(newLogs);
  console.log('Done Downloading PDF');
}

async function downloadFile(oldLog: DocumentLog): Promise<DocumentLog> {
  if (oldLog.status === 'update-index-error') return oldLog;

  const { pdfUrl, _node } = oldLog;
  const legalName = getDocumentName(_node);
  try {
    const response = await fetch(pdfUrl);
    const filePath = getDocumentFilePath(_node, 'pdf');
    await streamPipeline(response.body, fs.createWriteStream(filePath));
    console.log(`Done download ${legalName}`);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.stack?.split('\n');
      return { ...oldLog, lastError: 'download-pdf', status: 'error', message };
    }
    return { ...oldLog, lastError: 'download-pdf', status: 'error' };
  }
  return { ...oldLog, status: 'success', lastMethod: 'download-pdf' };
}

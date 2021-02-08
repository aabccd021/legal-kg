import * as fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { pipeline } from 'stream';
import * as util from 'util';
import { getConfig } from '../../config';
import { DocumentNode, getDocumentName, getDocumentPath } from '../../legal/document';
import { compact } from 'lodash';
import { DocumentLog, readLogs } from '../../log';

const streamPipeline = util.promisify(pipeline);

async function fileExists(file: string) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

async function getDocFilePath(node: DocumentNode): Promise<string> {
  const docPath = getDocumentPath(node);
  const { dataDir } = getConfig();
  const filePath = `${dataDir}/pdf/${docPath}.pdf`;
  const fileDir = path.dirname(filePath);
  await fs.promises.mkdir(fileDir, { recursive: true });
  return filePath;
}

export async function downloadPdf({ overwrite }: { overwrite: boolean }): Promise<void> {
  console.log('Start Downloading');
  console.log(overwrite);

  const logs = readLogs();

  const result = await Promise.allSettled(
    logs.map((uuData) => downloadFile(uuData, { overwrite: false }))
  );
  const errors = compact(result.map((r) => (r.status === 'fulfilled' ? r.value : r.reason)));
  await fs.promises.writeFile('download-error.json', JSON.stringify(errors, null, 2));
}
async function downloadFile(
  oldLog: DocumentLog,
  { overwrite }: { overwrite: boolean }
): Promise<DocumentLog> {
  if (oldLog.status === 'update-index-error') return oldLog;

  const { pdfUrl, _node } = oldLog;

  const filePath = await getDocFilePath(_node);
  const isFileExists = await fileExists(filePath);

  const legalName = getDocumentName(_node);

  if (isFileExists && !overwrite) {
    console.log(`skipping ${legalName} because exists`);
    return { ...oldLog, status: 'success', lastMethod: 'download-pdf' };
  }

  try {
    const response = await fetch(pdfUrl);
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

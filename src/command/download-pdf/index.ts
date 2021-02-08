import * as fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { pipeline } from 'stream';
import * as util from 'util';
import { getConfig } from '../../utils';
import { DocumentNode, getDocumentName, getDocumentPath } from '../../legal/document';
import { compact } from 'lodash';
import { IndexDocument } from '../update-index';

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

async function downloadFile(
  uuData: IndexDocument,
  { overwrite }: { overwrite: boolean }
): Promise<string | undefined> {
  if (uuData.status === 'error') return;

  const { pdfUrl, _node } = uuData;

  const filePath = await getDocFilePath(_node);
  const isFileExists = await fileExists(filePath);

  const legalName = getDocumentName(_node);

  if (isFileExists && !overwrite) {
    console.log(`skipping ${legalName} because exists`);
    return;
  }

  try {
    const response = await fetch(pdfUrl);
    await streamPipeline(response.body, fs.createWriteStream(filePath));
    console.log(`Done download ${legalName}`);
  } catch (e) {
    console.error(`\n${pdfUrl}`);
    console.error(e);
    return `${legalName}: ${e}`;
  }
  return;
}

export async function downloadPdf({ overwrite }: { overwrite: boolean }): Promise<void> {
  console.log('Start Downloading');
  console.log(overwrite);

  const { indexFilePath } = getConfig();

  const uuIndexFile = await fs.promises.readFile(indexFilePath);
  const uuDatas: IndexDocument[] = JSON.parse(uuIndexFile.toString());

  const result = await Promise.allSettled(
    uuDatas.map((uuData) => downloadFile(uuData, { overwrite: false }))
  );
  const errors = compact(result.map((r) => (r.status === 'fulfilled' ? r.value : r.reason)));
  await fs.promises.writeFile('download-error.json', JSON.stringify(errors, null, 2));
}

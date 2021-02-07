import { UuData } from './update-uu-index';
import * as fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { pipeline } from 'stream';
import * as util from 'util';
import { getConfig } from '../utils';
import { DocumentNode, getDocumentName, getDocumentPath } from '../uri/document-type';
import { compact } from 'lodash';

const streamPipeline = util.promisify(pipeline);

async function fileExists(file: string) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

async function getDocFilePath(node: DocumentNode): Promise<string> {
  const docPath = getDocumentPath(node);
  const { legalDataDir } = getConfig();
  const filePath = `${legalDataDir}/pdf/${docPath}.pdf`;
  const fileDir = path.dirname(filePath);
  await fs.promises.mkdir(fileDir, { recursive: true });
  return filePath;
}

async function downloadFile(
  uuData: UuData,
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

async function download() {
  console.log('Start Downloading');

  const { legalDataDir } = getConfig();
  const uuIndexPath = path.join(legalDataDir, 'indexes', 'uu.json');

  const uuIndexFile = await fs.promises.readFile(uuIndexPath);
  const uuDatas: UuData[] = JSON.parse(uuIndexFile.toString());

  const result = await Promise.allSettled(
    uuDatas.map((uuData) => downloadFile(uuData, { overwrite: false }))
  );
  const errors = compact(result.map((r) => (r.status === 'fulfilled' ? r.value : r.reason)));
  await fs.promises.writeFile('download-error.json', JSON.stringify(errors, null, 2));
}

download();

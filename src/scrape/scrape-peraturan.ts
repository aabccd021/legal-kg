import * as fs from 'fs';
import { compact, last, range } from 'lodash';
import fetch from 'node-fetch';
import { pipeline } from 'stream';
import * as util from 'util';

const streamPipeline = util.promisify(pipeline);

async function fileExists(file: string) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

async function download(url: string): Promise<void> {
  const fileName = last(url.split('/')) ?? neverString();
  const filePath = `downloads/${fileName}`;
  const isFileExists = await fileExists(filePath);

  if (isFileExists) {
    console.log(`skipping ${fileName}`);

    return;
  }

  const response = await fetch(url);
  await streamPipeline(response.body, fs.createWriteStream(filePath));
  console.log(`Done download ${fileName}`);
}

function neverString(): string {
  throw Error();
}

async function scrapePage(page: number): Promise<void> {
  const res = await fetch(`https://peraturan.go.id/uu.html?page=${page}`);
  const body = await res.text();
  const match = [...body.matchAll(/href="[^<]*.pdf"/g)];
  const strs = match.map((m) => m[0]?.slice('href="'.length, -1));
  await Promise.allSettled(compact(strs).map(download));
  console.log(`Done page ${page}`);
}

async function scrape(): Promise<void> {
  await Promise.allSettled(range(1, 85).map(scrapePage));
}

scrape();

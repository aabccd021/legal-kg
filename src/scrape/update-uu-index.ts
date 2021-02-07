import { compareUuNode, UuNode } from '../uri/document-type';
import * as fs from 'fs/promises';
import { isNil, range } from 'lodash';
import path from 'path';
import striptags from 'striptags';

import { Tabletojson } from 'tabletojson';
import _ from 'lodash';
import { getConfig } from '../utils';

export type UuData =
  | {
      status: 'success';
      _node: UuNode;
      detailUrl: string;
      pdfUrl: string;
      tentang: string;
    }
  | {
      status: 'error';
      message: string;
      html: Row;
    };

async function updateUuIndex(): Promise<void> {
  const lastPage = 85;
  const pages = range(1, lastPage + 1);

  const results = await Promise.allSettled(pages.map(pageToUuData));
  const _datas: UuData[] = results.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : []
  );
  const datas = _datas.sort((a, b) => {
    if (a.status === 'success' && b.status === 'success') {
      return compareUuNode(a._node, b._node);
    }
    if (a.status === 'error' && b.status === 'error') {
      return a.message.length - b.message.length;
    }
    return a.status === 'error' ? 1 : -1;
  });
  const succesCount = datas.filter(({ status }) => status === 'success').length;
  console.log(`\nSuccess : ${succesCount}`);
  console.log(`\nError : ${datas.length - succesCount}`);
  console.log(`\nTotal : ${datas.length}`);

  const { legalDataDir } = getConfig();
  const dataPath = path.join(legalDataDir, 'indexes', 'uu.json');
  await fs.writeFile(dataPath, JSON.stringify(datas, null, 2));
}

async function pageToUuData(page: number): Promise<UuData[]> {
  const url = `https://peraturan.go.id/uu.html?page=${page}`;
  const result: [Row[]] = await Tabletojson.convertUrl(url, { stripHtmlFromCells: false });
  const rows = result[0];
  const datas = rows.map(rowToData);
  console.log(`Done Scraping Page ${page}`);
  return datas;
}

type Row = { Peraturan?: string; Tentang?: string; 3?: string };

function rowToData(row: Row): UuData {
  try {
    const { 3: downloadEl, Peraturan: peraturanEl, Tentang: tentang } = row;

    if (isNil(tentang)) throw Error('tentang not found');
    if (isNil(peraturanEl)) throw Error('tentang not found');
    if (isNil(downloadEl)) throw Error('tentang not found');

    const name = striptags(peraturanEl);
    const _node = stringToUuNode(name);

    const detailEndpoint = peraturanEl.match(/".*"/)?.[0]?.replaceAll('"', '');
    const detailUrl = `https://peraturan.go.id${detailEndpoint}`;

    const pdfUrls = _([...downloadEl.matchAll(/href="[^<]*.pdf"/g)])
      .map((match) => match[0])
      .compact()
      .map((str) => str.slice('href="'.length, -1))
      .value();

    const mainPdfUrl = getMainPdfUrl(pdfUrls);

    return { status: 'success', _node, tentang, detailUrl, pdfUrl: mainPdfUrl };
  } catch (e) {
    return { status: 'error', message: `${e}`, html: row };
  }
}

function getMainPdfUrl(urls: string[]): string {
  const [firstUrl] = urls;
  if (!isNil(firstUrl)) {
    if (urls.length === 1) return firstUrl;

    const mainUrl = urls.find((url) => url.endsWith('pjl.pdf'));
    if (!isNil(mainUrl)) return mainUrl;

    throw Error(`more than 1 url found: ${urls}`);
  }
  throw Error('no pdf url found');
}

function stringToUuNode(name: string): UuNode {
  const [, nomor, tahun] = name
    .toLowerCase()
    .replace('uu no. ', ' ')
    .replace(' tahun ', ' ')
    .split(' ');
  if (isNil(nomor)) throw Error(`can't extract nomor: ${name}`);
  if (isNil(tahun)) throw Error(`can't extract tahun: ${name}`);
  return { documentType: 'uu', nomor: parseInt(nomor), tahun: parseInt(tahun) };
}

updateUuIndex();

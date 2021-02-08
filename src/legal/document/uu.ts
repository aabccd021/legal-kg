import * as fs from 'fs';
import { chain, isNil } from 'lodash';
import path from 'path';
import { DataType, getDataTypeExtension } from '../../data';
import { _ScrapableDocumentHandler } from './_utils';

export type UuNode = {
  _documentType: 'uu';
  tahun: number;
  nomor: number;
};

export const _uu: _ScrapableDocumentHandler<UuNode> = {
  getPath,
  getName,
  compare,
  getFiles,
  getPdfUrl,
  nameToNode,
  lastPage: 85,
};

function getPath(node: UuNode): string {
  const { tahun, nomor } = node;
  return `${tahun}/${nomor}`;
}

function getName(node: UuNode): string {
  const { tahun, nomor } = node;
  return `UNDANG-UNDANG TAHUN ${tahun} NOMOR ${nomor}`;
}

function compare(a: UuNode, b: UuNode): number {
  const tahunDiff = a.tahun - b.tahun;
  if (tahunDiff !== 0) return tahunDiff;
  return a.nomor - b.nomor;
}

function getFiles(uuDir: string, dataType: DataType): UuNode[] {
  return fs.readdirSync(uuDir).flatMap((year) =>
    fs
      .readdirSync(path.join(uuDir, year))
      .map((pdfName) => path.basename(pdfName, getDataTypeExtension(dataType)))
      .map((number) => ({
        _documentType: 'uu',
        tahun: parseInt(year),
        nomor: parseInt(number),
      }))
  );
}

/**
 * Get PDF Url
 */
function getPdfUrl(downloadEl: string): string {
  const urls = chain([...downloadEl.matchAll(/href="[^<]*.pdf"/g)])
    .map((match) => match[0])
    .compact()
    .map((str) => str.slice('href="'.length, -1))
    .value();

  const [firstUrl] = urls;
  if (!isNil(firstUrl)) {
    if (urls.length === 1) return firstUrl;

    const mainUrl = urls.find((url) => url.endsWith('pjl.pdf'));
    if (!isNil(mainUrl)) return mainUrl;

    throw Error(`more than 1 url found: ${urls}`);
  }
  throw Error('no pdf url found');
}

function nameToNode(name: string): UuNode {
  const [, nomor, tahun] = name
    .toLowerCase()
    .replace('uu no. ', ' ')
    .replace(' tahun ', ' ')
    .split(' ');
  if (isNil(nomor)) throw Error(`can't extract nomor: ${name}`);
  if (isNil(tahun)) throw Error(`can't extract tahun: ${name}`);
  return { _documentType: 'uu', nomor: parseInt(nomor), tahun: parseInt(tahun) };
}

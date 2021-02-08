import { chain, isNil } from 'lodash';
import { UuNode } from '../../legal/document/uu';

export function getUuPdfUrl(downloadEl: string): string {
  const pdfUrls = chain([...downloadEl.matchAll(/href="[^<]*.pdf"/g)])
    .map((match) => match[0])
    .compact()
    .map((str) => str.slice('href="'.length, -1))
    .value();

  return getUuMainPdfUrl(pdfUrls);
}

function getUuMainPdfUrl(urls: string[]): string {
  const [firstUrl] = urls;
  if (!isNil(firstUrl)) {
    if (urls.length === 1) return firstUrl;

    const mainUrl = urls.find((url) => url.endsWith('pjl.pdf'));
    if (!isNil(mainUrl)) return mainUrl;

    throw Error(`more than 1 url found: ${urls}`);
  }
  throw Error('no pdf url found');
}

export function nameToUuNode(name: string): UuNode {
  const [, nomor, tahun] = name
    .toLowerCase()
    .replace('uu no. ', ' ')
    .replace(' tahun ', ' ')
    .split(' ');
  if (isNil(nomor)) throw Error(`can't extract nomor: ${name}`);
  if (isNil(tahun)) throw Error(`can't extract tahun: ${name}`);
  return { _documentType: 'uu', nomor: parseInt(nomor), tahun: parseInt(tahun) };
}

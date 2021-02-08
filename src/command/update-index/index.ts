import {
  compareScrapableDocument,
  ScrapableDocumentCategory,
  ScrapableDocumentNode,
  SCRAPABLE_DOCUMENT_CATEGORY,
} from '../../legal/document';
import assertNever from 'assert-never';
import { isNil, range } from 'lodash';
import { Tabletojson } from 'tabletojson';
import { getUuPdfUrl, nameToUuNode } from './uu';
import striptags from 'striptags';

export type IndexDocument =
  | {
      status: 'success';
      _node: ScrapableDocumentNode;
      detailUrl: string;
      pdfUrl: string;
      tentang: string;
    }
  | {
      status: 'error';
      message: string;
      scrapedRow: ScrapedRow;
      category: ScrapableDocumentCategory;
    };

export async function updateIndex(): Promise<void> {
  console.log('Start update index');

  await Promise.allSettled(SCRAPABLE_DOCUMENT_CATEGORY.map(updateLegalCategoryIndex));

  // console.log(`\nSuccess : ${successCount}`);
  // console.log(`\nError : ${totalCount - successCount}`);
  // console.log(`\nTotal : ${totalCount}`);
}

async function updateLegalCategoryIndex(
  category: ScrapableDocumentCategory
): Promise<IndexDocument[]> {
  const lastPage = getLastPage(category);
  const pages = range(1, lastPage + 1);

  const results = await Promise.allSettled(
    pages.map((page) => pageToLegalCategoryData(page, category))
  );
  const indexDocuments = results
    .flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
    .sort(compareLegalCategoryData);

  return indexDocuments;
}

async function pageToLegalCategoryData(
  page: number,
  category: ScrapableDocumentCategory
): Promise<IndexDocument[]> {
  const url = `https://peraturan.go.id/${category}.html?page=${page}`;
  const convertOption = { stripHtmlFromCells: false };

  const result: [Partial<ScrapedRow>[]] = await Tabletojson.convertUrl(url, convertOption);

  const rows = result[0];
  const datas = rows.map((row) => rowToData(row, category));
  console.log(`Done Scraping Page ${page}`);

  return datas;
}

function rowToData(scrapedRow: ScrapedRow, category: ScrapableDocumentCategory): IndexDocument {
  try {
    const normalizedRow = scrapedRowToNormalized(scrapedRow);
    const { tentang, peraturanEl, downloadEl } = normalizedRow;

    const name = striptags(peraturanEl);
    const _node = nameToDocumentNode(name, category);

    const detailEndpoint = peraturanEl.match(/".*"/)?.[0]?.replaceAll('"', '');
    const detailUrl = `https://peraturan.go.id${detailEndpoint}`;

    const pdfUrl = getPdfUrl(downloadEl, category);

    return { status: 'success', _node, tentang, detailUrl, pdfUrl };
  } catch (message) {
    return { status: 'error', message, scrapedRow, category };
  }
}

/**
 * Category Handler
 */
function getLastPage(category: ScrapableDocumentCategory): number {
  if (category === 'uu') return 85;
  assertNever(category);
}
function nameToDocumentNode(
  name: string,
  category: ScrapableDocumentCategory
): ScrapableDocumentNode {
  if (category === 'uu') return nameToUuNode(name);
  assertNever(category);
}
function getPdfUrl(downloadEl: string, category: ScrapableDocumentCategory): string {
  if (category === 'uu') return getUuPdfUrl(downloadEl);
  assertNever(category);
}

function compareLegalCategoryData(a: IndexDocument, b: IndexDocument): number {
  if (a.status === 'success' && b.status === 'success') {
    return compareScrapableDocument(a._node, b._node);
  }
  if (a.status === 'error' && b.status === 'error') {
    return a.message.length - b.message.length;
  }
  return a.status === 'error' ? 1 : -1;
}

/**
 * Scraped Row
 */
type ScrapedRow = { Peraturan?: string; Tentang?: string; 3?: string };
type NormalizedScrapedRow = { peraturanEl: string; tentang: string; downloadEl: string };
function scrapedRowToNormalized(partialRow: ScrapedRow): NormalizedScrapedRow {
  const { Tentang: tentang, Peraturan: peraturanEl, 3: downloadEl } = partialRow;
  if (isNil(tentang)) throw Error('tentang not found');
  if (isNil(peraturanEl)) throw Error('tentang not found');
  if (isNil(downloadEl)) throw Error('tentang not found');
  return { tentang, peraturanEl, downloadEl };
}

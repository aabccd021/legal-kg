import {
  getNodeOfScrappableDocumentName,
  scrapableDocumentHtmlToPdfUrl,
  ScrapableDocumentCategory,
  SCRAPABLE_DOCUMENT_CATEGORY,
  getScrapableDocumentLastPage,
} from '../../legal/document';
import { isNil, range } from 'lodash';
import { Tabletojson } from 'tabletojson';
import striptags from 'striptags';
import { DocumentLog, writeLogs } from '../../log';

export async function updateIndex(): Promise<void> {
  console.log('Start update index');

  const results = await Promise.allSettled(
    SCRAPABLE_DOCUMENT_CATEGORY.map(updateLegalCategoryIndex)
  );

  const documentIndices = results.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : []
  );
  writeLogs(documentIndices);
}

async function updateLegalCategoryIndex(
  category: ScrapableDocumentCategory
): Promise<DocumentLog[]> {
  const lastPage = getScrapableDocumentLastPage(category);
  const pages = range(1, lastPage + 1);

  const results = await Promise.allSettled(
    pages.map((page) => pageToLegalCategoryData(page, category))
  );
  const indexDocuments = results.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : []
  );

  return indexDocuments;
}

async function pageToLegalCategoryData(
  page: number,
  category: ScrapableDocumentCategory
): Promise<DocumentLog[]> {
  const url = `https://peraturan.go.id/${category}.html?page=${page}`;
  const convertOption = { stripHtmlFromCells: false };

  const result: [ScrapedRow[]] = await Tabletojson.convertUrl(url, convertOption);

  const rows = result[0];
  const datas = rows.map((row) => rowToData(row, category));
  console.log(`Done Scraping ${category} Page ${page}`);

  return datas;
}

function rowToData(scrapedRow: ScrapedRow, category: ScrapableDocumentCategory): DocumentLog {
  try {
    const normalizedRow = scrapedRowToNormalized(scrapedRow);
    const { tentangHtml, peraturanHtml, downloadHtml } = normalizedRow;

    const name = striptags(peraturanHtml);
    const _node = getNodeOfScrappableDocumentName(name, category);

    const detailEndpoint = peraturanHtml.match(/".*"/)?.[0]?.replaceAll('"', '');
    const detailUrl = `https://peraturan.go.id${detailEndpoint}`;

    const pdfUrl = scrapableDocumentHtmlToPdfUrl(downloadHtml, category);

    return {
      status: 'success',
      lastMethod: 'update-index',
      _node,
      detailUrl,
      pdfUrl,
      tentang: tentangHtml,
    };
  } catch (error) {
    const { Tentang: tentangHtml, 3: downloadHtml, Peraturan: peraturanHtml } = scrapedRow;
    const html = { tentangHtml, downloadHtml, peraturanHtml };
    if (error instanceof Error) {
      const stack = error.stack?.split('\n');
      return { status: 'update-index-error', message: { stack, html } };
    }
    return { status: 'update-index-error' };
  }
}

/**
 * Scraped Row
 */
type ScrapedRow = { Peraturan?: string; Tentang?: string; 3?: string };
type NormalizedScrapedRow = { tentangHtml: string; downloadHtml: string; peraturanHtml: string };
function scrapedRowToNormalized(partialRow: ScrapedRow): NormalizedScrapedRow {
  const { Tentang: tentangHtml, 3: downloadHtml, Peraturan: peraturanHtml } = partialRow;
  if (isNil(peraturanHtml)) throw Error('peraturanHtml not found');
  if (isNil(tentangHtml)) throw Error('"tentang" not found');
  if (isNil(downloadHtml)) throw Error('downloadHtml not found');
  return { tentangHtml, downloadHtml, peraturanHtml };
}

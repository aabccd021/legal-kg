import { createWriteStream } from 'fs';
import { Dictionary, isUndefined, range, zip } from 'lodash';
import { pipeline } from 'stream';
import { Tabletojson } from 'tabletojson';
import { promisify } from 'util';
import { NoTahunNode } from './document';
import { nodeToFile } from './util';
import fetch from 'node-fetch';

const streamPipeline = promisify(pipeline);

async function scrape(): Promise<void> {
  Promise.all(
    range(1945, 2021).map(async (tahun) => {
      const url = `https://www.dpr.go.id/jdih/uu/year/${tahun}`;
      const res: Dictionary<string>[][] = await Tabletojson.convertUrl(url, {
        stripHtmlFromCells: false,
      });
      const resStrip: Dictionary<string>[][] = await Tabletojson.convertUrl(url);
      return Promise.all(
        zip(res[0], resStrip[0]).map(async ([raw, stripped]) => {
          const _url = raw?.['DOKUMEN']?.match(/\/.*.pdf/)?.[0];
          const nomor = parseInt(stripped?.['#'] ?? '');

          if (isUndefined(_url) || isUndefined(nomor)) return;

          const url = `https://www.dpr.go.id${_url}`;

          const node: NoTahunNode = {
            nodeType: 'document',
            docType: 'noTahun',
            docCategory: 'uu',
            tahun,
            nomor,
          };
          const pdfFile = nodeToFile('pdf', node);
          // if (pdfFile.exists) return;
          console.log('downloading', url, node);
          const response = await fetch(url);
          await streamPipeline(response.body, createWriteStream(pdfFile.path));
        })
      );
    })
  );
}

scrape();

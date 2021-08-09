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
  for (const tahun of range(1945, 2021)) {
    console.log(tahun);
    const url = `https://www.dpr.go.id/jdih/uu/year/${tahun}`;
    const res: Dictionary<string>[][] = await Tabletojson.convertUrl(url, {
      stripHtmlFromCells: false,
    });
    const resStrip: Dictionary<string>[][] = await Tabletojson.convertUrl(url);
    for (const [raw, stripped] of zip(res[0], resStrip[0])) {
      const _url = raw?.['DOKUMEN']?.match(/\/.*.pdf/)?.[0];
      const nomor = parseInt(stripped?.['#'] ?? '');

      if (isUndefined(_url) || isUndefined(nomor)) {
        console.log('exists', raw, stripped);
        continue;
      }

      const url = `https://www.dpr.go.id${_url}`;

      const node: NoTahunNode = {
        nodeType: 'peraturan',
        docType: 'noTahun',
        docCategory: 'uu',
        tahun,
        nomor,
      };
      const pdfFile = nodeToFile('pdf', node);
      if (pdfFile.exists) {
        console.log('exists');
        continue;
      }
      console.log('downloading', url, node);
      const response = await fetch(url);
      await streamPipeline(response.body, createWriteStream(pdfFile.path));
    }
  }
}

scrape();

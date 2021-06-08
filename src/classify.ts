import { readdirSync, mkdirSync, existsSync, writeFileSync, copyFileSync } from 'fs';
import path from 'path';
import { getConfig } from './config';
import { execOCR } from './exec_ocr';
import { PDFExtract } from 'pdf.js-extract';
import { chain, compact, isUndefined, zip } from 'lodash';
import { nodeToFile, Span } from './util';
import { mergePage, toPageWithoutNoise } from './_pdf_to_span';
import { DocumentNode } from './document';
import { safeParseInt } from './span_to_data/parse_key_from_spans';
import * as yaml from 'js-yaml';

const pdfExtract = new PDFExtract();

async function classify(): Promise<void> {
  const { unclassifiedPdfDir } = getConfig();
  const tempDir = 'tempura';
  mkdirSync(tempDir, { recursive: true });

  for (const pdfName of readdirSync(unclassifiedPdfDir)) {
    console.log(pdfName);
    const pdfPath = path.join(unclassifiedPdfDir, pdfName);
    const normalizedPdfPath = path.join(tempDir, pdfName);
    if (existsSync(normalizedPdfPath)) {
      console.log('OCR-ed document already exists');
    } else {
      await execOCR(pdfPath, normalizedPdfPath);
    }

    const { pages: rawPages } = await pdfExtract.extract(pdfPath);
    const { pages: normalizedPages } = await pdfExtract.extract(normalizedPdfPath);
    const mixedPages = chain(zip(rawPages, normalizedPages)).map(mergePage).compact().value();

    const [rawSpans, normalizedSpans, mixedSpans]: Span[][] = [
      rawPages,
      normalizedPages,
      mixedPages,
    ].map((pages) =>
      pages
        .flatMap((page, pageidx) => toPageWithoutNoise(page, pageidx))
        .map((span, index) => ({ ...span, id: index }))
    );

    const detectedNodes = [normalizedSpans, rawSpans].map((spans) =>
      spans
        ? spans.reduce<DocumentNode | undefined>((prev, span, idx, spans) => {
            if (prev) return prev;
            if (span.str.startsWith('UNDANG-UNDANG')) {
              const [, nomorStr, , tahunStr] =
                spans[idx + 1]?.str.split(' ').map((s) => s.trim()) ?? [];
              const nomor = safeParseInt(nomorStr);
              const tahun = safeParseInt(tahunStr);
              if (isUndefined(nomor) || isUndefined(tahun)) {
                console.log({ spanStr: spans[idx + 2]?.str, nomorStr, tahunStr });
                return undefined;
              }
              const node: DocumentNode = {
                nodeType: 'peraturan',
                docType: 'noTahun',
                docCategory: 'uu',
                nomor,
                tahun,
              };
              return node;
            }
            if (span.str.startsWith('PERATURAN WALIKOTA MALANG')) {
              const [, nomorStr, , tahunStr] =
                spans[idx + 1]?.str.split(' ').map((s) => s.trim()) ?? [];
              const nomor = safeParseInt(nomorStr);
              const tahun = safeParseInt(tahunStr);
              if (isUndefined(nomor) || isUndefined(tahun)) {
                console.log({ spanStr: spans[idx + 1]?.str, nomorStr, tahunStr });
                return undefined;
              }
              const node: DocumentNode = {
                nodeType: 'peraturan',
                docType: 'noTahun',
                docCategory: 'perwali_malang',
                nomor,
                tahun,
              };
              return node;
            }
            if (span.str.startsWith('PERATURAN GUBERNUR DAERAH KHUSUS')) {
              const [, nomorStr, , tahunStr] =
                spans[idx + 2]?.str.split(' ').map((s) => s.trim()) ?? [];
              const nomor = safeParseInt(nomorStr);
              const tahun = safeParseInt(tahunStr);
              if (isUndefined(nomor) || isUndefined(tahun)) {
                console.log({ spanStr: spans[idx + 2]?.str, nomorStr, tahunStr });
                return undefined;
              }
              const node: DocumentNode = {
                nodeType: 'peraturan',
                docType: 'noTahun',
                docCategory: 'pergub_dki_jakarta',
                nomor,
                tahun,
              };
              return node;
            }
            if (span.str.startsWith('PERATURAN DAERAH PROVINSI DAERAH KHUSUS')) {
              const [, nomorStr, , tahunStr] =
                spans[idx + 2]?.str.split(' ').map((s) => s.trim()) ?? [];
              const nomor = safeParseInt(nomorStr);
              const tahun = safeParseInt(tahunStr);
              if (isUndefined(nomor) || isUndefined(tahun)) {
                console.log({ spanStr: spans[idx + 2]?.str, nomorStr, tahunStr });
                return undefined;
              }
              const node: DocumentNode = {
                nodeType: 'peraturan',
                docType: 'noTahun',
                docCategory: 'perda_provinsi_dki_jakarta',
                nomor,
                tahun,
              };
              return node;
            }
            if (span.str.startsWith('PERATURAN PEMERINTAH')) {
              const [, nomorStr, , tahunStr] =
                spans[idx + 1]?.str.split(' ').map((s) => s.trim()) ?? [];
              const nomor = safeParseInt(nomorStr);
              const tahun = safeParseInt(tahunStr);
              if (isUndefined(nomor) || isUndefined(tahun)) {
                console.log({ spanStr: spans[idx + 1]?.str, nomorStr, tahunStr });
                return undefined;
              }
              const node: DocumentNode = {
                nodeType: 'peraturan',
                docType: 'noTahun',
                docCategory: 'pp',
                nomor,
                tahun,
              };
              return node;
            }
            return prev;
          }, undefined)
        : undefined
    );

    const node = compact(detectedNodes)[0];
    if (isUndefined(node)) {
      console.log('document node not detected');
      continue;
    }

    copyFileSync(pdfPath, nodeToFile('pdf', node).path);
    copyFileSync(normalizedPdfPath, nodeToFile('normalized-pdf', node).path);
    writeFileSync(nodeToFile('span-raw', node).path, yaml.dump(rawSpans, { lineWidth: 80 }));
    writeFileSync(
      nodeToFile('span-normalized', node).path,
      yaml.dump(normalizedSpans, { lineWidth: 80 })
    );
    writeFileSync(nodeToFile('span-mixed', node).path, yaml.dump(mixedSpans, { lineWidth: 80 }));
  }
}

classify();

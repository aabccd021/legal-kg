import assertNever from 'assert-never';
import path from 'path';
import * as fs from 'fs';
import { DataType, getDataTypeExtension } from './util';

// Node
export const NO_TAHUN_DOC_CAT = [
  'uu',
  'perda_provinsi_dki_jakarta',
  'pergub_dki_jakarta',
  'perwali_malang',
  'pp',
] as const;
export type NoTahunDocCat = typeof NO_TAHUN_DOC_CAT[number];
export type NoTahunNode = {
  nodeType: 'peraturan';
  docType: 'noTahun';
  docCategory: NoTahunDocCat;
  tahun: number;
  nomor: number;
};

export type UudNode = {
  nodeType: 'peraturan';
  docType: 'uud';
};

/**
 * Convertable Document
 */
export type ConvertableDocType = typeof CONVERTABLE_DOCUMENT_TYPE[number];
export const CONVERTABLE_DOCUMENT_TYPE = ['noTahun'] as const;
export type ConvertableDocumentNode = NoTahunNode;

/**
 * Document
 */
export const LEGAL_DOCUMENT_TYPE = [...CONVERTABLE_DOCUMENT_TYPE, 'uud'] as const;
export type DocType = typeof LEGAL_DOCUMENT_TYPE[number];
export type DocumentNode = ConvertableDocumentNode | UudNode;

/**
 * Get Document Name
 */
export function nodeToName(node: DocumentNode): string {
  if (node.docType === 'uud') return 'UNDANG-UNDANG DASAR NEGARA REPUBLIK INDONESIA TAHUN 1945';
  if (node.docType === 'noTahun') {
    const tn = `TAHUN ${node.tahun} NOMOR ${node.nomor}`;
    if (node.docCategory === 'uu') return `UNDANG-UNDANG REPUBLIK INDONESIA ${tn}`;
    if (node.docCategory === 'perwali_malang') return `PERATURAN WALIKOTA MALANG ${tn}`;
    if (node.docCategory === 'perda_provinsi_dki_jakarta')
      return `PERATURAN DAERAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA ${tn}`;
    if (node.docCategory === 'pergub_dki_jakarta') return `PERATURAN GUBERNUR ${tn}`;
    if (node.docCategory === 'pp') return `PERATURAN PEMERINTAH REPUBLIK INDONESIA ${tn}`;
    assertNever(node.docCategory);
  }
  assertNever(node);
}

/**
 * Get Document Path
 */

export function getDocumentPath(node: DocumentNode): string {
  if (node.docType === 'uud') return 'uu';
  if (node.docType === 'noTahun') return `${node.docCategory}/${node.tahun}/${node.nomor}`;
  assertNever(node);
}

/**
 * Get Convertable Document File
 */
export function getConvertableDocumentFiles(
  docType: ConvertableDocType,
  dir: string,
  dataType: DataType
): ConvertableDocumentNode[] {
  const dataTypeDir = path.join(dir, dataType);
  if (!fs.existsSync(dataTypeDir)) return [];
  if (docType === 'noTahun') {
    return NO_TAHUN_DOC_CAT.flatMap((docCategory) => {
      const catDir = path.join(dataTypeDir, docCategory);
      if (!fs.existsSync(catDir)) return [];
      return fs.readdirSync(catDir).flatMap((year) =>
        fs
          .readdirSync(path.join(catDir, year))
          .map((pdfName) => path.basename(pdfName, getDataTypeExtension(dataType)))
          .map((number) => ({
            nodeType: 'peraturan',
            docType: 'noTahun',
            docCategory,
            tahun: parseInt(year),
            nomor: parseInt(number),
          }))
      );
    });
  }
  assertNever(docType);
}

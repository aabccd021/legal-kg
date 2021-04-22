import assertNever from 'assert-never';
import { PerdaNode, _perda } from './perda';
import { UuNode, _uu } from './uu';
import { UudNode, _uud } from './uud';
import { DataType } from '../../data';
import path from 'path';
import * as fs from 'fs';
import { BabSet } from '../component';
import { DateNode } from '..';

/**
 * Scrapable Document
 */
export type ScrapableDocumentCategory = typeof SCRAPABLE_DOCUMENT_CATEGORY[number];
export const SCRAPABLE_DOCUMENT_CATEGORY = ['uu'] as const;
export type ScrapableDocumentNode = UuNode & {
  docType: ScrapableDocumentCategory;
  nodeType: 'document';
};

/**
 * Convertable Document
 */
export type ConvertableDocumentCategory = typeof CONVERTABLE_DOCUMENT_CATEGORY[number];
export const CONVERTABLE_DOCUMENT_CATEGORY = [...SCRAPABLE_DOCUMENT_CATEGORY, 'perda'] as const;
export type ConvertableDocumentNode = (ScrapableDocumentNode | PerdaNode) & {
  docType: ConvertableDocumentCategory;
  nodeType: 'document';
};

/**
 * Document
 */
export type DocumentCategory = typeof LEGAL_DOCUMENT_CATEGORY[number];
export const LEGAL_DOCUMENT_CATEGORY = [...CONVERTABLE_DOCUMENT_CATEGORY, 'uud'] as const;
export type DocumentNode = (ConvertableDocumentNode | UudNode) & {
  docType: DocumentCategory;
  nodeType: 'document';
};

/**
 * Get Document Name
 */
export function nodeToName(node: DocumentNode): string {
  if (node.docType === 'uu') return _uu.getName(node);
  if (node.docType === 'perda') return _perda.getName(node);
  if (node.docType === 'uud') return _uud.getName(node);
  assertNever(node);
}

/**
 * Get Document Path
 */
export function getDocumentPath(node: DocumentNode): string {
  const path = _getDocumentPath(node);
  return `${node.docType}/${path}`;
}
function _getDocumentPath(node: DocumentNode): string {
  if (node.docType === 'uu') return _uu.getPath(node);
  if (node.docType === 'perda') return _perda.getPath(node);
  if (node.docType === 'uud') return '';
  assertNever(node);
}

/**
 * Get Document Path
 */
export function pathToNode(path: string): DocumentNode {
  const [legalDocCategory, ...restDocumentPath] = path.split('/');
  if (legalDocCategory === 'uu') return _uu.nodeOfPath(restDocumentPath);
  if (legalDocCategory === 'perda') return _perda.nodeOfPath(restDocumentPath);
  if (legalDocCategory === 'uud') return _uud.nodeOfPath(restDocumentPath);
  throw Error(`unknown legal document category: ${legalDocCategory}`);
}

/**
 * Get Convertable Document File
 */
export function getConvertableDocumentFiles(
  category: ConvertableDocumentCategory,
  dir: string,
  dataType: DataType
): ConvertableDocumentNode[] {
  const documentTypeDir = path.join(dir, dataType, category);
  if (!fs.existsSync(documentTypeDir)) return [];
  if (category === 'uu') return _uu.getFiles(documentTypeDir, dataType);
  if (category === 'perda') return _perda.getFiles(documentTypeDir, dataType);
  assertNever(category);
}

/**
 * Scrapable Document Name to Node
 */
export function getNodeOfScrappableDocumentName(
  name: string,
  category: ScrapableDocumentCategory
): ScrapableDocumentNode {
  if (category === 'uu') return _uu.nameToNode(name);
  assertNever(category);
}

/**
 * Compare Convertable Document
 */
export function compareConvertableDocument(
  a: ConvertableDocumentNode,
  b: ConvertableDocumentNode
): number {
  if (a.docType === 'uu' && b.docType === 'uu') return _uu.compare(a, b);
  if (a.docType === 'perda' && b.docType === 'perda') return _perda.compare(a, b);
  return a.docType.localeCompare(b.docType);
}

/**
 * Scrapable Document PDF Url from HTML
 */
export function scrapableDocumentHtmlToPdfUrl(
  downloadEl: string,
  category: ScrapableDocumentCategory
): string {
  if (category === 'uu') return _uu.htmlToPdfUrl(downloadEl);
  assertNever(category);
}

/**
 * Scrapable Document last page
 */
export function getScrapableDocumentLastPage(category: ScrapableDocumentCategory): number {
  if (category === 'uu') return _uu.lastPage;
  assertNever(category);
}

/**
 * Document Data
 */
export type Document = {
  node: DocumentNode;
  penjelasan?: string[];
  opText?: string;
  babSet: BabSet;
  disahkan: Disahkan;
  metadata: DocumentMetadata;

  // menimbang?: Metadata;
  // mengingat?: Metadata;
};

export type DocumentMetadata = {
  name?: string;
  pemutus?: string;
  denganPersetujuan?: string;
  tentang?: string;
  salinan?: string;
  memutuskan?: string;
  tempatDitetapkan?: string;
  tanggalDitetapkan?: string;
  tempatDiundangkan?: string;
  tanggalDiundangkan?: string;
  sekretaris?: string;
  dokumen?: string;
  salinanSesuaiDenganAslinya?: string;
  menimbang?: string;
  mengingat?: string;
  menetapkan?: string;
};

export type Disahkan = {
  date: DateNode;
  location: string;
  pengesah?: string;
  jabatanPengesah?: string;
};

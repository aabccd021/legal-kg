import assertNever from 'assert-never';
import { getDocumentBaseUri } from '..';
import { Bab } from '../structure/bab';
import { Metadata } from '../structure/metadata';
import { PerdaNode, _perda } from './perda';
import { UuNode, _uu } from './uu';
import { UudNode, _uud } from './uud';
import { DataType } from '../../data';
import path from 'path';
import * as fs from 'fs';

/**
 * Scrapable Document
 */
export type ScrapableDocumentCategory = typeof SCRAPABLE_DOCUMENT_CATEGORY[number];
export const SCRAPABLE_DOCUMENT_CATEGORY = ['uu'] as const;
export type ScrapableDocumentNode = UuNode & {
  _documentType: ScrapableDocumentCategory;
};

/**
 * Convertable Document
 */
export type ConvertableDocumentCategory = typeof CONVERTABLE_DOCUMENT_CATEGORY[number];
export const CONVERTABLE_DOCUMENT_CATEGORY = [...SCRAPABLE_DOCUMENT_CATEGORY, 'perda'] as const;
export type ConvertableDocumentNode = (ScrapableDocumentNode | PerdaNode) & {
  _documentType: DocumentCategory;
};

/**
 * Document
 */
export type DocumentCategory = typeof DOCUMENT_CATEGORY[number];
export const DOCUMENT_CATEGORY = [...CONVERTABLE_DOCUMENT_CATEGORY, 'uud'] as const;
export type DocumentNode = (ConvertableDocumentNode | UudNode) & {
  _documentType: DocumentCategory;
};

/**
 * Get Document Name
 */
export function getDocumentName(node: DocumentNode): string {
  if (node._documentType === 'uu') return _uu.getName(node);
  if (node._documentType === 'perda') return _perda.getName(node);
  if (node._documentType === 'uud') return _uud.getName(node);
  assertNever(node);
}

/**
 * Get Document Path
 */
export function getDocumentPath(node: DocumentNode): string {
  const path = _getDocumentPath(node);
  return `${node._documentType}/${path}`;
}
function _getDocumentPath(node: DocumentNode): string {
  if (node._documentType === 'uu') return _uu.getPath(node);
  if (node._documentType === 'perda') return _perda.getPath(node);
  if (node._documentType === 'uud') return _uud.getName(node);
  assertNever(node);
}

/**
 * Get Document File
 */
export function getConvertableDocumentFiles(
  documentType: ConvertableDocumentCategory,
  dir: string,
  dataType: DataType
): ConvertableDocumentNode[] {
  const documentTypeDir = path.join(dir, dataType, documentType);
  if (!fs.existsSync(documentTypeDir)) return [];
  if (documentType === 'uu') return _uu.getFiles(documentTypeDir, dataType);
  if (documentType === 'perda') return _perda.getFiles(documentTypeDir, dataType);
  assertNever(documentType);
}

/**
 * Compare Document
 */
export function compareScrapableDocument(
  a: ScrapableDocumentNode,
  b: ScrapableDocumentNode
): number {
  if (a._documentType === 'uu' && b._documentType === 'uu') return _uu.compare(a, b);
  return a._documentType.localeCompare(b._documentType);
}

/**
 * Get Document URI
 */
export function _getDocumentUri(documentNode: DocumentNode): string {
  const path = getDocumentPath(documentNode);
  const uriBase = getDocumentBaseUri();
  return `${uriBase}/${path}`;
}

/**
 * Document Data
 */
export type Document = {
  _node: DocumentNode;
  penjelasan?: string[];
  pengesahanText?: string;
  opText?: string;
  babs?: Bab[];
  _name?: string;
  _nomor?: number;
  _tahun?: number;
  _pemutus?: string;
  _denganPersetujuan?: string[];
  _tentang?: string;
  _salinan?: string;
  _memutuskan?: string;
  _tempatDisahkan?: string;
  _tanggalDisahkan?: string;
  _tempatDitetapkan?: string;
  _tanggalDitetapkan?: string;
  _jabatanPengesah?: string;
  _namaPengesah?: string;
  _tempatDiundangkan?: string;
  _tanggalDiundangkan?: string;
  _sekretaris?: string;
  _dokumen?: string;
  salinanSesuaiDenganAslinya?: string;
  menimbang?: Metadata;
  mengingat?: Metadata;
};

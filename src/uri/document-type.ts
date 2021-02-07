import { assertNever } from 'assert-never';
import { getDocumentBaseUri, LegalNode } from '.';

export type DocumentNode = (UuNode | PerdaNode | UudNode) & { documentType: DocumentType };
export function isDocumentNode(x: LegalNode): x is DocumentNode {
  return DOCUMENT_TYPES.includes((x as DocumentNode).documentType);
}
/**
 * Legal
 */
export type DocumentType = typeof DOCUMENT_TYPES[number];
export const DOCUMENT_TYPES = ['uu', 'perda', 'uud'] as const;

/**
 * Document Uri
 */
export function getDocumentUri(documentNode: DocumentNode): string {
  const path = getDocumentPath(documentNode);
  const uriBase = getDocumentBaseUri();
  return `${uriBase}/${path}`;
}

/**
 * Legal Path
 */
export function getDocumentPath(documentNode: DocumentNode): string {
  const { documentType } = documentNode;
  const path = _getDocumentPath(documentNode);
  return `${documentType}/${path}`;
}
function _getDocumentPath(node: DocumentNode): string {
  if (node.documentType === 'uu') return getUuPath(node);
  if (node.documentType === 'perda') return getPerdaPath(node);
  if (node.documentType === 'uud') return 'UUD';
  assertNever(node);
}

/**
 * Document Name
 */
export function getDocumentName(node: DocumentNode): string {
  if (node.documentType === 'uu') return getUuName(node);
  if (node.documentType === 'perda') return getPerdaName(node);
  if (node.documentType === 'uud')
    return 'UNDANG-UNDANG DASAR NEGARA REPUBLIK INDONESIA TAHUN 1945';
  assertNever(node);
}

/**
 * uud
 */
export type UudNode = {
  documentType: 'uud';
};

/**
 * uu
 */
export type UuNode = {
  documentType: 'uu';
  tahun: number;
  nomor: number;
};
function getUuPath(node: UuNode): string {
  const { tahun, nomor } = node;
  return `${tahun}/${nomor}`;
}
function getUuName(node: UuNode): string {
  const { tahun, nomor } = node;
  return `UNDANG-UNDANG TAHUN ${tahun} NOMOR ${nomor}`;
}
export function compareUuNode(a: UuNode, b: UuNode): number {
  const tahunDiff = a.tahun - b.tahun;
  if (tahunDiff !== 0) return tahunDiff;
  return a.nomor - b.nomor;
}

/**
 * perda
 */
export type Daerah = typeof DAERAHS[number];
export const DAERAHS = ['provinsi_dki_jakarta'] as const;
export type PerdaNode = {
  documentType: 'perda';
  daerah: Daerah;
  tahun: number;
  nomor: number;
};
function getPerdaPath(node: PerdaNode): string {
  const { daerah, tahun, nomor } = node;
  return `${daerah}/${tahun}/${nomor}`;
}
function getPerdaName(node: PerdaNode): string {
  const { daerah, tahun, nomor } = node;
  const daerahName = getPerdaDaerahName(daerah);
  return `PERATURAN ${daerahName} TAHUN ${tahun} NOMOR ${nomor}`;
}
function getPerdaDaerahName(daerah: Daerah): string {
  if (daerah === 'provinsi_dki_jakarta') return 'GUBERNUR DAERAH KHUSUS IBU KOTA JAKARTA';
  assertNever(daerah);
}

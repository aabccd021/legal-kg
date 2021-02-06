import { assertNever } from 'assert-never';
import { LegalTrace } from '.';
import { baseUri } from '../maintain/json2ttl/triples2ttl';

/**
 * Document Trace
 */
export type DocumentTrace = (UuTrace | PerdaTrace | UudTrace) & { legalType: DocumentType };
export function isDocumentTrace(x: LegalTrace): x is DocumentTrace {
  return DOCUMENT_TYPES.includes((x as DocumentTrace).legalType);
}
/**
 * Legal
 */
export type DocumentType = typeof DOCUMENT_TYPES[number];
export const DOCUMENT_TYPES = ['uu', 'perda', 'uud'] as const;

/**
 * Legal Uri
 */
export function getDocumentUri(trace: DocumentTrace): string {
  const path = getLegalPath(trace);
  return `${baseUri}document/${path}`;
}

/**
 * Legal Path
 */
export function getLegalPath(trace: DocumentTrace): string {
  const { legalType } = trace;
  const path = _getLegalPath(trace);
  return `${legalType}/${path}`;
}
function _getLegalPath(trace: DocumentTrace): string {
  if (trace.legalType === 'uu') return getUuPath(trace);
  if (trace.legalType === 'perda') return getPerdaPath(trace);
  if (trace.legalType === 'uud') return 'UUD';
  assertNever(trace);
}

/**
 * Legal Name
 */
export function getLegalName(trace: DocumentTrace): string {
  if (trace.legalType === 'uu') return getUuName(trace);
  if (trace.legalType === 'perda') return getPerdaName(trace);
  if (trace.legalType === 'uud') return 'UNDANG-UNDANG DASAR NEGARA REPUBLIK INDONESIA TAHUN 1945';
  assertNever(trace);
}

/**
 * uud
 */
export type UudTrace = {
  legalType: 'uud';
};

/**
 * uu
 */
export type UuTrace = {
  legalType: 'uu';
  tahun: number;
  nomor: number;
};
function getUuPath(trace: UuTrace): string {
  const { tahun, nomor } = trace;
  return `${tahun}/${nomor}`;
}
function getUuName(trace: UuTrace): string {
  const { tahun, nomor } = trace;
  return `UNDANG-UNDANG TAHUN ${tahun} NOMOR ${nomor}`;
}

/**
 * perda
 */
export type Daerah = typeof DAERAHS[number];
export const DAERAHS = ['provinsi_dki_jakarta'] as const;
export type PerdaTrace = {
  legalType: 'perda';
  daerah: Daerah;
  tahun: number;
  nomor: number;
};
function getPerdaPath(trace: PerdaTrace): string {
  const { daerah, tahun, nomor } = trace;
  return `${daerah}/${tahun}/${nomor}`;
}
function getPerdaName(trace: PerdaTrace): string {
  const { daerah, tahun, nomor } = trace;
  const daerahName = getPerdaDaerahName(daerah);
  return `PERATURAN ${daerahName} TAHUN ${tahun} NOMOR ${nomor}`;
}
function getPerdaDaerahName(daerah: Daerah): string {
  if (daerah === 'provinsi_dki_jakarta') return 'GUBERNUR DAERAH KHUSUS IBU KOTA JAKARTA';
  assertNever(daerah);
}

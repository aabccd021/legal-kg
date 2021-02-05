import { assertNever } from 'assert-never';
import { baseUri } from '../kg/utils';

/**
 * Legal
 */
export type LegalType = typeof LEGAL_TYPES[number];
export const LEGAL_TYPES = ['uu', 'perda', 'uud'] as const;
export type LegalTrace = UuTrace | PerdaTrace | UudTrace;

/**
 * Legal Uri
 */
export function getLegalUri(trace: LegalTrace): string {
  const path = getLegalPath(trace);
  return `${baseUri}document/${path}`;
}

/**
 * Legal Path
 */
export function getLegalPath(trace: LegalTrace): string {
  const { type } = trace;
  const path = _getLegalPath(trace);
  return `${type}/${path}`;
}
function _getLegalPath(trace: LegalTrace): string {
  if (trace.type === 'uu') return getUuPath(trace);
  if (trace.type === 'perda') return getPerdaPath(trace);
  if (trace.type === 'uud') return 'UUD';
  assertNever(trace);
}

/**
 * Legal Name
 */
export function getLegalName(trace: LegalTrace): string {
  if (trace.type === 'uu') return getUuName(trace);
  if (trace.type === 'perda') return getPerdaName(trace);
  if (trace.type === 'uud') return 'UNDANG-UNDANG DASAR NEGARA REPUBLIK INDONESIA TAHUN 1945';
  assertNever(trace);
}

/**
 * uud
 */
export type UudTrace = {
  type: 'uud';
};

/**
 * uu
 */
export type UuTrace = {
  type: 'uu';
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
  type: 'perda';
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

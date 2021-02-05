import { assertNever } from 'assert-never';
import { LegalTrace, getLegalUri } from './legal-type-uri';

export type PointTrace = {
  _pointTraceType: true;
  point: string | number;
  parent: PointParent;
};
export function isPointTrace(trace: PointParent): trace is PointTrace {
  return (trace as PointTrace)._pointTraceType;
}
export function getPointUri(trace: PointTrace): string {
  const { point, parent } = trace;
  const parentUri = _getPointParentUri(parent);

  return `${parentUri}/point/${point}`;
}

/**
 * Point Parent
 */
export type PointParent = PointTrace | AyatTrace | PasalTrace | SpecialDocTrace;
function _getPointParentUri(trace: PointTrace | AyatTrace | PasalTrace | SpecialDocTrace): string {
  if (isSpecialDocTrace(trace)) return getSpecialDocUri(trace);
  if (isPointTrace(trace)) return getPointUri(trace);
  if (isAyatTrace(trace)) return getAyatUri(trace);
  if (isPasalTrace(trace)) return getPasalUri(trace);
  assertNever(trace);
}

/**
 * Pasal
 */
export type PasalTrace = LegalTrace & {
  pasal: number;
  _pasalTraceType: true;
};
export function isPasalTrace(trace: PointParent): trace is PasalTrace {
  return (trace as PasalTrace)._pasalTraceType;
}

export function getPasalUri(trace: PasalTrace): string {
  const { pasal } = trace;
  const docUri = getLegalUri(trace);
  return `${docUri}/pasal/${pasal}`;
}

/**
 * Ayat
 */
export type AyatTrace = PasalTrace & {
  ayat: number;
  _ayatTraceType: true;
};
export function isAyatTrace(trace: PointParent): trace is AyatTrace {
  return (trace as AyatTrace)._ayatTraceType;
}
export function getAyatUri(trace: AyatTrace): string {
  const { ayat } = trace;
  const pasalUri = getPasalUri({ ...trace });
  return `${pasalUri}/ayat/${ayat}`;
}

/**
 * Paragraf
 */
export type ParagrafTrace = BagianTrace & {
  paragraf: number;
};
export function getParagrafUri(trace: ParagrafTrace): string {
  const { paragraf } = trace;
  const bagianUri = getBagianUri(trace);
  return `${bagianUri}/paragraf/${paragraf}`;
}

/**
 * Bagian
 */
export type BagianTrace = BabTrace & { bagian: number };
export function getBagianUri(trace: BagianTrace): string {
  const { bagian } = trace;
  const babUri = getBabUri(trace);
  return `${babUri}/bagian/${bagian}`;
}

/**
 * Bab
 */
export type BabTrace = LegalTrace & {
  bab: number;
};
export function getBabUri(trace: BabTrace): string {
  const { bab } = trace;
  const docUri = getLegalUri(trace);
  return `${docUri}/bab/${bab}`;
}

/**
 * Doc
 */

/** Special */
export type SpecialDocTrace = LegalTrace & {
  attrType: 'menimbang' | 'mengingat';
  _specialTraceType: true;
};
export function isSpecialDocTrace(trace: PointParent): trace is SpecialDocTrace {
  return (trace as SpecialDocTrace)._specialTraceType;
}
export function getSpecialDocUri(trace: SpecialDocTrace): string {
  const { attrType } = trace;
  const docUri = getLegalUri(trace);

  return `${docUri}/${attrType}`;
}

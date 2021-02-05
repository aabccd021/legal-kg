import { assertNever } from 'assert-never';
import { DocumentTrace, getLegalUri } from './document-type';

export type DocumentStructureTrace =
  | BabTrace
  | ParagrafTrace
  | PointTrace
  | AyatTrace
  | PasalTrace
  | MetadataTrace;

export type PointTrace = {
  _pointTraceType: true;
  point: string | number;
  parent: PointsTrace;
};
export function isPointTrace(trace: PointsTrace): trace is PointTrace {
  return (trace as PointTrace)._pointTraceType;
}
export function getPointUri(trace: PointTrace): string {
  const { point, parent } = trace;
  const parentUri = _getPointParentUri(parent);

  return `${parentUri}/point/${point}`;
}

/**
 * Points
 */
export type PointsTrace = PointTrace | AyatTrace | PasalTrace | MetadataTrace;
function _getPointParentUri(trace: PointTrace | AyatTrace | PasalTrace | MetadataTrace): string {
  if (isSpecialDocTrace(trace)) return getMetadataUri(trace);
  if (isPointTrace(trace)) return getPointUri(trace);
  if (isAyatTrace(trace)) return getAyatUri(trace);
  if (isPasalTrace(trace)) return getPasalUri(trace);
  assertNever(trace);
}

/**
 * Pasal
 */
export type PasalTrace = DocumentTrace & {
  pasal: number;
  _pasalTraceType: true;
};
export function isPasalTrace(trace: PointsTrace): trace is PasalTrace {
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
export function isAyatTrace(trace: PointsTrace): trace is AyatTrace {
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
export type BabTrace = DocumentTrace & {
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
export type MetadataTrace = DocumentTrace & {
  metadataType: 'documentMengingat' | 'documentMenimbang';
  _metadataTrace: true;
};
export function isSpecialDocTrace(trace: PointsTrace): trace is MetadataTrace {
  return (trace as MetadataTrace)._metadataTrace;
}
export function getMetadataUri(trace: MetadataTrace): string {
  const { metadataType } = trace;
  const docUri = getLegalUri(trace);

  return `${docUri}/${metadataType}`;
}

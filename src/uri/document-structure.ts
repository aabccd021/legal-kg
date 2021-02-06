import { assertNever } from 'assert-never';
import { DocumentTrace, getDocumentUri } from './document-type';

export type DocumentStructureTrace =
  | BabTrace
  | BagianTrace
  | ParagrafTrace
  | PointTrace
  | AyatTrace
  | PasalTrace
  | MetadataTrace;

export type PointTrace = {
  _structureType: 'point';
  _key: string | number;
  parentPoints: PointsTrace;
};
export function getPointUri(trace: PointTrace): string {
  const { _key, parentPoints } = trace;
  const parentUri = _getPointParentUri(parentPoints);

  return `${parentUri}/point/${_key}`;
}

/**
 * Points
 */
export type PointsTrace = PointTrace | AyatTrace | PasalTrace | MetadataTrace;
function _getPointParentUri(trace: PointsTrace): string {
  if (trace._structureType === 'metadata') return getMetadataUri(trace);
  if (trace._structureType === 'point') return getPointUri(trace);
  if (trace._structureType === 'ayat') return getAyatUri(trace);
  if (trace._structureType === 'pasal') return getPasalUri(trace);
  assertNever(trace);
}

/**
 * Pasal
 */
export type PasalTrace = {
  _structureType: 'pasal';
  parentDocument: DocumentTrace;
  _key: number;
};
export function getPasalUri(trace: PasalTrace): string {
  const { _key, parentDocument } = trace;
  const docUri = getDocumentUri(parentDocument);
  return `${docUri}/pasal/${_key}`;
}

/**
 * Pasal Parent
 */
export type PasalParentTrace = BagianTrace | BabTrace | ParagrafTrace;
export function getPasalParentDocument(parent: PasalParentTrace): DocumentTrace {
  if (parent._structureType === 'paragraf') return getPasalParentDocument(parent.parentBagian);
  if (parent._structureType === 'bagian') return getPasalParentDocument(parent.parentBab);
  if (parent._structureType === 'bab') return parent.parentDocument;
  assertNever(parent);
}

/**
 * Ayat
 */
export type AyatTrace = {
  _structureType: 'ayat';
  parentPasal: PasalTrace;
  _key: number;
};
export function getAyatUri(trace: AyatTrace): string {
  const { _key, parentPasal } = trace;
  const pasalUri = getPasalUri(parentPasal);
  return `${pasalUri}/ayat/${_key}`;
}

/**
 * Paragraf
 */
export type ParagrafTrace = {
  _structureType: 'paragraf';
  parentBagian: BagianTrace;
  _key: number;
};
export function getParagrafUri(trace: ParagrafTrace): string {
  const { _key, parentBagian } = trace;
  const bagianUri = getBagianUri(parentBagian);
  return `${bagianUri}/paragraf/${_key}`;
}

/**
 * Bagian
 */
export type BagianTrace = {
  _structureType: 'bagian';
  parentBab: BabTrace;
  _key: number;
};
export function getBagianUri(trace: BagianTrace): string {
  const { _key, parentBab } = trace;
  const babUri = getBabUri(parentBab);
  return `${babUri}/bagian/${_key}`;
}

/**
 * Bab
 */
export type BabTrace = {
  _structureType: 'bab';
  parentDocument: DocumentTrace;
  _key: number;
};
export function getBabUri(trace: BabTrace): string {
  const { _key, parentDocument } = trace;
  const docUri = getDocumentUri(parentDocument);
  return `${docUri}/bab/${_key}`;
}

/**
 * Doc
 */

/** Special */
export type MetadataTrace = {
  _structureType: 'metadata';
  parentDocument: DocumentTrace;
  metadataType: 'documentMengingat' | 'documentMenimbang';
};
export function getMetadataUri(trace: MetadataTrace): string {
  const { metadataType, parentDocument } = trace;
  const docUri = getDocumentUri(parentDocument);

  return `${docUri}/${metadataType}`;
}

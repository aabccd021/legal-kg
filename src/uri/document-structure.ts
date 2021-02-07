import { assertNever } from 'assert-never';
import { DocumentNode, getDocumentUri } from './document-type';

export type StructureNode =
  | BabNode
  | BagianNode
  | ParagrafNode
  | PointNode
  | AyatNode
  | PasalNode
  | MetadataNode;

export type PointNode = {
  _structureType: 'point';
  _key: string | number;
  parentPoints: PointsNode;
};
export function getPointUri(pointNode: PointNode): string {
  const { _key, parentPoints } = pointNode;
  const parentUri = _getPointParentUri(parentPoints);

  return `${parentUri}/point/${_key}`;
}

/**
 * Points
 */
export type PointsNode = PointNode | AyatNode | PasalNode | MetadataNode;
function _getPointParentUri(pointsNode: PointsNode): string {
  if (pointsNode._structureType === 'metadata') return getMetadataUri(pointsNode);
  if (pointsNode._structureType === 'point') return getPointUri(pointsNode);
  if (pointsNode._structureType === 'ayat') return getAyatUri(pointsNode);
  if (pointsNode._structureType === 'pasal') return getPasalUri(pointsNode);
  assertNever(pointsNode);
}

/**
 * Pasal
 */
export type PasalNode = {
  _structureType: 'pasal';
  parentDocument: DocumentNode;
  _key: number;
};
export function getPasalUri(node: PasalNode): string {
  const { _key, parentDocument } = node;
  const docUri = getDocumentUri(parentDocument);
  return `${docUri}/pasal/${_key}`;
}

/**
 * Pasal Parent
 */
export type PasalParentNode = BagianNode | BabNode | ParagrafNode;
export function getPasalParentDocument(parent: PasalParentNode): DocumentNode {
  if (parent._structureType === 'paragraf') return getPasalParentDocument(parent.parentBagian);
  if (parent._structureType === 'bagian') return getPasalParentDocument(parent.parentBab);
  if (parent._structureType === 'bab') return parent.parentDocument;
  assertNever(parent);
}

/**
 * Ayat
 */
export type AyatNode = {
  _structureType: 'ayat';
  parentPasal: PasalNode;
  _key: number;
};
export function getAyatUri(node: AyatNode): string {
  const { _key, parentPasal } = node;
  const pasalUri = getPasalUri(parentPasal);
  return `${pasalUri}/ayat/${_key}`;
}

/**
 * Paragraf
 */
export type ParagrafNode = {
  _structureType: 'paragraf';
  parentBagian: BagianNode;
  _key: number;
};
export function getParagrafUri(node: ParagrafNode): string {
  const { _key, parentBagian } = node;
  const bagianUri = getBagianUri(parentBagian);
  return `${bagianUri}/paragraf/${_key}`;
}

/**
 * Bagian
 */
export type BagianNode = {
  _structureType: 'bagian';
  parentBab: BabNode;
  _key: number;
};
export function getBagianUri(node: BagianNode): string {
  const { _key, parentBab } = node;
  const babUri = getBabUri(parentBab);
  return `${babUri}/bagian/${_key}`;
}

/**
 * Bab
 */
export type BabNode = {
  _structureType: 'bab';
  parentDocument: DocumentNode;
  _key: number;
};
export function getBabUri(node: BabNode): string {
  const { _key, parentDocument } = node;
  const docUri = getDocumentUri(parentDocument);
  return `${docUri}/bab/${_key}`;
}

/**
 * Doc
 */

/** Special */
export type MetadataNode = {
  _structureType: 'metadata';
  parentDocument: DocumentNode;
  metadataType: 'documentMengingat' | 'documentMenimbang';
};
export function getMetadataUri(node: MetadataNode): string {
  const { metadataType, parentDocument } = node;
  const docUri = getDocumentUri(parentDocument);

  return `${docUri}/${metadataType}`;
}

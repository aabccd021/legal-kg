import assertNever from 'assert-never';
import { DocumentNode, _getDocumentUri } from '../document';
import { ReferenceText } from '../reference';
import { Ayat } from './ayat';
import { BabNode } from './bab';
import { Bagian, BagianNode } from './bagian';
import { Paragraf, ParagrafNode } from './paragraf';
import { Points } from './point';

/**
 * Pasal
 */
export type PasalNode = {
  _structureType: 'pasal';
  parentDocument: DocumentNode;
  _key: number;
};
export function _getPasalUri(node: PasalNode): string {
  const { _key, parentDocument } = node;
  const docUri = _getDocumentUri(parentDocument);
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
 * Pasal Data
 */
export type Pasal = {
  _type: 'pasal';
  _key: number;
  isi?: Ayat[] | Points;
  text: ReferenceText;
};
export function isPasals(isi: Bagian[] | Pasal[] | Paragraf[]): isi is Pasal[] {
  return isi?.[0]?._type === 'pasal';
}

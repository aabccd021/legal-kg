import assertNever from 'assert-never';
import { DocumentNode, _getDocumentUri } from '../document';
import { ReferenceText } from '../reference';
import { AmendPoints } from './amend';
import { Ayats } from './ayat';
import { BabNode } from './bab';
import { BagianNode } from './bagian';
import { ParagrafNode } from './paragraf';
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
  isi: IsiPasal;
};
export type Pasals = {
  _type: 'pasals';
  pasals: Pasal[];
};

export type IsiPasal = Points | ReferenceText | AmendPoints | Ayats;

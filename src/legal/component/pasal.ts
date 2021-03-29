import assertNever from 'assert-never';
import { DocumentNode } from '../document';
import { ReferenceText } from '../reference';
import { AmenderPoints } from './amend';
import { Ayats } from './ayat';
import { BabNode } from './bab';
import { BagianNode } from './bagian';
import { ParagrafNode } from './paragraf';
import { Points } from './point';

/**
 * Pasal
 */
export type PasalNode = {
  nodeType: 'pasal';
  parentDoc: DocumentNode;
  key: number | string;
};

/**
 * Pasal Parent
 */
export type PasalParentNode = BagianNode | BabNode | ParagrafNode;

export function getPasalParentDocument(parent: PasalParentNode): DocumentNode {
  if (parent.nodeType === 'paragraf') return getPasalParentDocument(parent.parent);
  if (parent.nodeType === 'bagian') return getPasalParentDocument(parent.parent);
  if (parent.nodeType === 'bab') return parent.parent;
  assertNever(parent);
}

/**
 * Pasal Data
 */
export type Pasal = {
  type: 'pasal';
  key: number;
  content: PasalContent;
};

export type Pasals = {
  type: 'pasals';
  pasalArr: Pasal[];
};

export type PasalContent = Points | ReferenceText | AmenderPoints | Ayats;

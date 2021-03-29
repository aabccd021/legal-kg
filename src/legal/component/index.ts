import { PasalNode, PointNode } from './index';
import assertNever from 'assert-never';
import { LegalNode } from '..';
import { DocumentNode } from '../document';
import { AmendedPasalNode, AmenderPoints } from './amend';

/**
 * ComponentNode
 */
export type ComponentNode =
  | AyatNode
  | AyatSetNode
  | BabNode
  | BabSetNode
  | BagianNode
  | BagianSetNode
  | ParagrafNode
  | ParagrafSetNode
  | PasalNode
  | PasalSetNode
  | PointNode
  | PointSetNode
  | TextNode;

export type AyatNode = {
  nodeType: 'ayat';
  parent: AyatSetNode;
  key: number;
};

export type AyatSetNode = {
  nodeType: 'ayatSet';
  parent: PasalNode | AmendedPasalNode;
  key: number;
};

export type BabNode = {
  nodeType: 'bab';
  parent: BabSetNode;
  key: number;
};

export type BabSetNode = {
  nodeType: 'babSet';
  parent: DocumentNode;
};

export type BagianSetNode = {
  nodeType: 'bagianSet';
  parent: BabNode;
};

export type BagianNode = {
  nodeType: 'bagian';
  parent: BagianSetNode;
  key: number;
};

export type ParagrafNode = {
  nodeType: 'paragraf';
  parent: BagianNode;
  key: number;
};

export type ParagrafSetNode = {
  nodeType: 'paragrafSet';
  parent: BabNode;
};

export type PasalSetNode = {
  nodeType: 'pasalSet';
  parent: BabNode;
};

export type PasalNode = {
  nodeType: 'pasal';
  parentDoc: DocumentNode;
  key: number | string;
};

export type PasalStateNode = {
  parentDoc: PasalNode;
  date: number;
  state: 'exists' | 'deleted';
};

export type PointNode = {
  nodeType: 'point';
  key: string | number;
  parent: PointSetNode;
};

export type PointSetNode = {
  nodeType: 'pointSet';
  key: number;
  parent: PointNode | AyatNode | PasalNode | AmendedPasalNode;
};

export type TextNode = {
  nodeType: 'text';
  textName: string;
  parent: AyatNode | PasalNode | PointNode;
};

export type AmenderDeletePointNode = {
  nodeType: 'amenderDeletePoint';
};
export type AmenderInsertPointNode = {
  nodeType: 'amenderDeletePoint';
};
export type AmenderUpdatePointNode = {
  nodeType: 'amenderDeletePoint';
};

/**
 * Component
 */
export type Component = Bab | Bagian | Pasal | Paragraf | Ayat;

export type Ayat = {
  type: 'ayat';
  key: number;
  content: PointSet | Text;
};

export type AyatSet = {
  type: 'ayatSet';
  elements: Ayat[];
};

export type Bab = {
  type: 'bab';
  key: number;
  title: string;
  content: BagianSet | PasalSet;
};

export type BabSet = {
  type: 'babSet';
  elements: Bab[];
};

export type Bagian = {
  type: 'bagian';
  key: number;
  title: string;
  content: ParagrafSet | PasalSet;
};

export type BagianSet = {
  type: 'bagianSet';
  elements: Bagian[];
};

export type Paragraf = {
  type: 'paragraf';
  key: number;
  title: string;
  content: PasalSet;
};

export type ParagrafSet = {
  type: 'paragrafSet';
  elements: Paragraf[];
};

export type Pasal = {
  type: 'pasal';
  key: number;
  content: PointSet | Text | AmenderPoints | AyatSet;
};

export type PasalSet = {
  type: 'pasalSet';
  elements: Pasal[];
};

export type Point = {
  type: 'numPoint' | 'alphaPoint';
  key: string | number;
  content: PointSet | Text;
};

export type PointSet = {
  type: 'points';
  elements: Point[];
};

export type Text = {
  type: 'referenceText';
  text: string;
  references: Reference[];
};

export type Reference = {
  start: number;
  end: number;
  node: LegalNode;
};

/**
 * Utils
 */
export function getPasalParentDocument(parent: BagianNode | BabNode | ParagrafNode): DocumentNode {
  if (parent.nodeType === 'paragraf') return getPasalParentDocument(parent.parent);
  if (parent.nodeType === 'bagian') return getPasalParentDocument(parent.parent);
  if (parent.nodeType === 'bab') return parent.parent;
  assertNever(parent);
}

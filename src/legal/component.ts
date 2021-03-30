import { LegalNode } from '.';
import { DocumentNode } from './document';

/**
 * Component Node
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
  | PasalVersionNode
  | PointNode
  | PointSetNode
  | TextNode;

export type AyatNode = {
  nodeType: 'ayat';
  parentAyatSetNode: AyatSetNode;
  key: number;
};

export type AyatSetNode = {
  nodeType: 'ayatSet';
  parentPasalVersionNode: PasalVersionNode;
};

export type BabNode = {
  nodeType: 'bab';
  parentBabSetNode: BabSetNode;
  key: number;
};

export type BabSetNode = {
  nodeType: 'babSet';
  parentDocumentNode: DocumentNode;
};

export type BagianSetNode = {
  nodeType: 'bagianSet';
  parentBabNode: BabNode;
};

export type BagianNode = {
  nodeType: 'bagian';
  parentBagianSetNode: BagianSetNode;
  key: number;
};

export type ParagrafNode = {
  nodeType: 'paragraf';
  parentParagrafSetNode: ParagrafSetNode;
  key: number;
};

export type ParagrafSetNode = {
  nodeType: 'paragrafSet';
  parentBagianNode: BagianNode;
};

export type PasalSetNode = {
  nodeType: 'pasalSet';
  parentNode: BabNode | BagianNode | ParagrafNode;
};

export type PasalNode = {
  nodeType: 'pasal';
  parentNode: DocumentNode;
  key: number | string;
};

export type PasalVersionNode = {
  nodeType: 'pasalVersion';
  timeCreatedEpoch: number;
  state: 'exists' | 'deleted';
  parentPasalNode: PasalNode;
};

export type PointNode = {
  nodeType: 'point';
  key: string | number;
  parentPointSetNode: PointSetNode;
};

export type PointSetNode = {
  nodeType: 'pointSet';
  parentNode: PointNode | AyatNode | PasalVersionNode;
};

export type TextNode = {
  nodeType: 'text';
  textName: string;
  parentNode: PointNode | AyatNode | PasalVersionNode | PointSetNode;
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
export type Component =
  | Ayat
  | AyatSet
  | Bab
  | BabSet
  | Bagian
  | BagianSet
  | Paragraf
  | ParagrafSet
  | Pasal
  | PasalDeleteAmenderPoint
  | PasalInsertAmenderPoint
  | PasalSet
  | PasalUpdateAmenderPoint
  | PasalVersion
  | Point
  | PointSet
  | Text;

export type Ayat = {
  type: 'ayat';
  node: AyatNode;
  content: PointSet | Text;
};

export type AyatSet = {
  type: 'ayatSet';
  node: AyatSetNode;
  elements: Ayat[];
};

export type Bab = {
  type: 'bab';
  title: string;
  node: BabNode;
  content: BagianSet | PasalSet;
};

export type BabSet = {
  type: 'babSet';
  node: BabSetNode;
  elements: Bab[];
};

export type Bagian = {
  type: 'bagian';
  node: BagianNode;
  title: string;
  content: ParagrafSet | PasalSet;
};

export type BagianSet = {
  type: 'bagianSet';
  node: BagianSetNode;
  elements: Bagian[];
};

export type Paragraf = {
  type: 'paragraf';
  node: ParagrafNode;
  title: string;
  pasalSet: PasalSet;
};

export type ParagrafSet = {
  type: 'paragrafSet';
  node: ParagrafSetNode;
  elements: Paragraf[];
};

export type Pasal = {
  type: 'pasal';
  node: PasalNode;
  version: PasalVersion;
};

export type PasalVersion = {
  type: 'pasalVersion';
  node: PasalVersionNode;
  content: PointSet | Text | AyatSet;
};

export type PasalSet = {
  type: 'pasalSet';
  node: PasalSetNode;
  elements: Pasal[];
};

export type Point = {
  type: 'point';
  node: PointNode;
  content:
    | PointSet
    | PasalDeleteAmenderPoint
    | PasalUpdateAmenderPoint
    | PasalInsertAmenderPoint
    | Text;
};

export type PointSet = {
  type: 'pointSet';
  node: PointSetNode;
  description: Text;
  elements: Point[];
};

export type Text = {
  type: 'text';
  node: TextNode;
  references: Reference[];
  textString: string;
};

export type Reference = {
  start: number;
  end: number;
  node: LegalNode;
};

export type PasalDeleteAmenderPoint = {
  type: 'pasalDeleteAmenderPoint';
  node: PointNode;
  deletedPasalVersionNode: PasalVersionNode;
};

export type PasalUpdateAmenderPoint = {
  type: 'pasalUpdateAmenderPoint';
  node: PointNode;
  updatedPasalVersion: PasalVersion;
  description: Text;
};

export type PasalInsertAmenderPoint = {
  type: 'pasalInsertAmenderPoint';
  node: PointNode;
  insertedPasalVersionArr: PasalVersion[];
  description: Text;
};

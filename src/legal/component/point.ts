import { AmendedPasalNode } from './amend';
import { ReferenceText } from '../reference';
import { AyatNode } from './ayat';
// import { MetadataNode } from './metadata';
import { PasalNode } from './pasal';

/**
 * Point
 */
export type PointNode = {
  nodeType: 'point';
  key: string | number;
  parent: PointsNode;
};

export type Point = {
  type: 'numPoint' | 'alphaPoint';
  key: string | number;
  content: Points | ReferenceText;
};

/**
 * Points
 */
export type PointsNode =
  | PointNode
  | AyatNode
  | PasalNode
  //| MetadataNode
  | AmendedPasalNode;

export type Points = {
  type: 'points';
  description: ReferenceText;
  content: Point[];
};

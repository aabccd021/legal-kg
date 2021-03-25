import { AmendedPasalNode } from './amend';
import { getUri } from '..';
import { ReferenceText } from '../reference';
import { AyatNode } from './ayat';
import { MetadataNode } from './metadata';
import { PasalNode } from './pasal';

/**
 * Point
 */
export type PointNode = {
  _structureType: 'point';
  _key: string | number;
  parentPoints: PointsNode;
};
export function getPointUri(pointNode: PointNode): string {
  const { _key, parentPoints } = pointNode;
  const parentUri = getUri(parentPoints);
  return `${parentUri}/point/${_key}`;
}

export type Point = {
  _type: 'numPoint' | 'alphaPoint';
  _key: string | number;
  isi: Points | ReferenceText;
};

/**
 * Points
 */
export type PointsNode = PointNode | AyatNode | PasalNode | MetadataNode | AmendedPasalNode;

export type Points = {
  _type: 'points';
  _description: ReferenceText;
  isi: Point[];
};

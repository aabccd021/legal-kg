import { UpdateAmend } from './amend';
import { _getStructureUri } from '.';
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
export function _getPointUri(pointNode: PointNode): string {
  const { _key, parentPoints } = pointNode;
  const parentUri = _getStructureUri(parentPoints);
  return `${parentUri}/point/${_key}`;
}

export type Point = {
  _type: 'numPoint' | 'alphaPoint';
  _key: string | number;
  isi?: Points | UpdateAmend;
  text: ReferenceText;
};

/**
 * Points
 */
export type PointsNode = PointNode | AyatNode | PasalNode | MetadataNode;

export type Points = {
  _type: 'points';
  _description: ReferenceText;
  isi: Point[];
  text: string;
};

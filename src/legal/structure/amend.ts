import { PasalNode } from './pasal';
import { DocumentNode } from './../document/index';
import { ReferenceText } from '../reference';
import { Ayats } from './ayat';
import { Points, PointsNode } from './point';
import { getUri } from '..';

export type AmendPoints = {
  _type: 'amenderPoints';
  _description: ReferenceText;
  parentDocument: DocumentNode;
  isi: AmendedPoint[];
};

type AmenderPointBase = {
  _type: 'amenderPoint';
  _nomorKey: number;
};

type AmenderPointNodeBase = {
  _structureType: 'amenderPoint';
  _key: number;
  parentPoints: PointsNode;
};

export type AmenderPointNode =
  | AmenderDeletePointNode
  | AmenderInsertPointNode
  | AmenderUpdatePointNode;

export type AmenderDeletePointNode = AmenderPointNodeBase & {
  _operation: 'delete';
};
export type AmenderInsertPointNode = AmenderPointNodeBase & {
  _operation: 'insert';
};
export type AmenderUpdatePointNode = AmenderPointNodeBase & {
  _operation: 'update';
};

export function getAmenderPointUri(node: AmenderPointNode): string {
  const { _key, parentPoints, _operation } = node;
  const parentPointsUri = getUri(parentPoints);
  return `${parentPointsUri}/point/${_key}/amend/${_operation}`;
}

export type AmendedPoint = AmenderDeletePoint | AmenderUpdatePoint | AmenderInsertPoint;

export type AmenderDeletePoint = AmenderPointBase & {
  _operation: 'delete';
  deletedPasal: PasalNode;
};

export type AmenderUpdatePoint = AmenderPointBase & {
  _operation: 'update';
  description: ReferenceText;
  updatedPasal: AmendedPasal;
};

export type AmenderInsertPoint = AmenderPointBase & {
  _operation: 'insert';
  description: ReferenceText;
  insertedPasals: AmendedPasal[];
};

/**
 *
 */
export type AmendedPasal = {
  _structureType: 'amendedPasal';
  _key: string;
  isi: Points | ReferenceText | Ayats;
};

export type AmendedPasalNode = {
  _structureType: 'amendedPasal';
  parentDocumentNode: DocumentNode;
  amendPointNode: AmenderPointNode;
  _key: number | string;
};

export function getAmendedPasalUri(node: AmendedPasalNode): string {
  const { _key, parentDocumentNode, amendPointNode } = node;
  const parentPointUri = getUri(amendPointNode);
  const documentUri = getUri(parentDocumentNode);
  return `${parentPointUri}/document/${documentUri}/pasal/${_key}`;
}

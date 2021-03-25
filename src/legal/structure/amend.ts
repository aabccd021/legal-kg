import { DocumentNode } from './../document/index';
import { ReferenceText } from '../reference';
import { Ayats } from './ayat';
import { Points, PointsNode } from './point';
import { getUri } from '..';

export type AmendPoints = {
  _type: 'amenderPoints';
  description: ReferenceText;
  parentDocument: DocumentNode;
  isi: AmendedPoint[];
};

export type AmendedPoint = AmenderDeletePoint | AmenderUpdatePoint | AmenderInsertPoint;

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

export type AmenderDeletePoint = AmenderPointBase & {
  _operation: 'delete';
  _pasalKey: string;
  isi: ReferenceText;
};

export type AmenderUpdatePoint = AmenderPointBase & {
  _operation: 'update';
  description: ReferenceText;
  amendedPasal: AmendedPasal;
};

export type AmenderInsertPoint = AmenderPointBase & {
  _operation: 'insert';
  description: ReferenceText;
  amendedPasals: AmendedPasal[];
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

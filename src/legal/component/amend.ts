import { PasalNode } from './pasal';
import { DocumentNode } from '../document/index';
import { ReferenceText } from '../reference';
import { Ayats } from './ayat';
import { Points, PointsNode } from './point';
import { nodeToUri } from '..';

export type AmenderPoints = {
  type: 'amenderPoints';
  parent: DocumentNode;
  description: ReferenceText;
  amendedPointArr: AmendedPoint[];
};

type AmenderPointBase = {
  type: 'amenderPoint';
  key: number;
};

type AmenderPointNodeBase = {
  nodeType: 'amenderPoint';
  key: number;
  parent: PointsNode;
};

export type AmenderPointNode =
  | AmenderDeletePointNode
  | AmenderInsertPointNode
  | AmenderUpdatePointNode;

export type AmenderDeletePointNode = AmenderPointNodeBase & {
  operation: 'delete';
};
export type AmenderInsertPointNode = AmenderPointNodeBase & {
  operation: 'insert';
};
export type AmenderUpdatePointNode = AmenderPointNodeBase & {
  operation: 'update';
};

export function getAmenderPointUri(node: AmenderPointNode): string {
  const { key, parent, operation } = node;
  const parentPointsUri = nodeToUri(parent);
  return `${parentPointsUri}/point/${key}/amend/${operation}`;
}

export type AmendedPoint = AmenderDeletePoint | AmenderUpdatePoint | AmenderInsertPoint;

export type AmenderDeletePoint = AmenderPointBase & {
  operation: 'delete';
  deletedNode: PasalNode;
};

export type AmenderUpdatePoint = AmenderPointBase & {
  operation: 'update';
  description: ReferenceText;
  updatedPasal: AmendedPasal;
};

export type AmenderInsertPoint = AmenderPointBase & {
  operation: 'insert';
  description: ReferenceText;
  amendedPasalArr: AmendedPasal[];
};

/**
 *
 */
export type AmendedPasal = {
  componentType: 'amendedPasal';
  key: string;
  content: Points | ReferenceText | Ayats;
};

export type AmendedPasalNode = {
  nodeType: 'amendedPasal';
  key: number | string;
  parentDoc: DocumentNode;
  amenderPointNode: AmenderPointNode;
};

export function getAmendedPasalUri(node: AmendedPasalNode): string {
  const { key, parentDoc: docNode, amenderPointNode } = node;
  const parentPointUri = nodeToUri(amenderPointNode);
  const documentUri = nodeToUri(docNode);
  return `${parentPointUri}/document/${documentUri}/pasal/${key}`;
}

import { Text, PasalNode, PointSet, AyatSet } from '.';
import { nodeToUri } from '..';
import { DocumentNode } from '../document';

export type AmenderPoints = {
  type: 'amenderPoints';
  parent: DocumentNode;
  description: Text;
  amendedPointArr: AmendedPoint[];
};

// type AmenderPointBase = {
//   type: 'amenderPoint';
//   key: number;
// };

// type AmenderPointNodeBase = {
//   nodeType: 'amenderPoint';
//   key: number;
//   parent: PointNode | AyatNode;
// };

export type AmenderPointNode =
  | AmenderDeletePointNode
  | AmenderInsertPointNode
  | AmenderUpdatePointNode;

export type AmenderDeletePointNode = {
  nodeType: 'amenderDeletePoint';
};
export type AmenderInsertPointNode = {
  nodeType: 'amenderDeletePoint';
};
export type AmenderUpdatePointNode = {
  nodeType: 'amenderDeletePoint';
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
  description: Text;
  updatedPasal: AmendedPasal;
};

export type AmenderInsertPoint = AmenderPointBase & {
  operation: 'insert';
  description: Text;
  amendedPasalArr: AmendedPasal[];
};

/**
 *
 */
export type AmendedPasal = {
  componentType: 'amendedPasal';
  key: string;
  content: PointSet | Text | AyatSet;
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

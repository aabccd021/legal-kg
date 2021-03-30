import { BabNode, BagianNode, ParagrafNode } from './component';
import { assertNever } from 'assert-never';
import { getConfig } from '../config';
import { DocumentNode, getDocumentPath } from './document';
import { ComponentNode } from './component';

export type LegalNode = DocumentNode | ComponentNode;

export function nodeToUri(node: LegalNode): string {
  if (node.nodeType === 'ayat') return `${nodeToUri(node.parentAyatSetNode)}/${node.key}`;
  if (node.nodeType === 'ayatSet') return `${nodeToUri(node.parent)}/ayat`;
  if (node.nodeType === 'bab') return `${nodeToUri(node.parentBabSetNode)}/${node.key}`;
  if (node.nodeType === 'babSet') return `${nodeToUri(node.parentDocumentNode)}/bab`;
  if (node.nodeType === 'bagian') return `${nodeToUri(node.parentBagianSetNode)}/${node.key}`;
  if (node.nodeType === 'bagianSet') return `${nodeToUri(node.parentBabNode)}/bagian`;
  if (node.nodeType === 'document')
    return `$${getConfig().uriBase}/document/${getDocumentPath(node)}`;
  if (node.nodeType === 'paragraf') return `${nodeToUri(node.parentParagrafSetNode)}/${node.key}`;
  if (node.nodeType === 'paragrafSet') return `${nodeToUri(node.parentBagianNode)}/paragraf`;
  if (node.nodeType === 'pasal') return `${nodeToUri(node.parentNode)}/${node.key}`;
  if (node.nodeType === 'pasalSet')
    return `${nodeToUri(pasalSetParentNodeToDocumentNode(node.parentNode))}/pasal`;
  if (node.nodeType === 'pasalVersion')
    return `${nodeToUri(node.parentPasalNode)}/version/${node.timeCreatedEpoch}`;
  if (node.nodeType === 'point') return `${nodeToUri(node.parentPointSetNode)}/${node.key}`;
  if (node.nodeType === 'pointSet') return `${nodeToUri(node.parentNode)}/point`;
  if (node.nodeType === 'text') return `${nodeToUri(node.parentNode)}/${node.textName}`;
  assertNever(node);
}

function pasalSetParentNodeToDocumentNode(node: BabNode | BagianNode | ParagrafNode): DocumentNode {
  if (node.nodeType === 'bab') return node.parentBabSetNode.parentDocumentNode;
  if (node.nodeType === 'bagian')
    return pasalSetParentNodeToDocumentNode(node.parentBagianSetNode.parentBabNode);
  if (node.nodeType === 'paragraf')
    return pasalSetParentNodeToDocumentNode(node.parentParagrafSetNode.parentBagianNode);
  assertNever(node);
}

/**
 * Type Guards
 */
/**
 * Get Base Uri
 */
export function getOntologyBaseUri(): string {
  const { uriBase } = getConfig();
  return `${uriBase}/ontology`;
}

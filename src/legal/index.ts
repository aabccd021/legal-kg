import { assertNever } from 'assert-never';
import { getConfig } from '../config';
import { DocumentNode, getDocumentPath } from './document';
import { ComponentNode } from './component';
import { getAmendedPasalUri, getAmenderPointUri } from './component/amend';

export type LegalNode = DocumentNode | ComponentNode;

/**
 * Get URI
 */
export function nodeToUri(node: LegalNode): string {
  if (node.nodeType === 'document')
    return `$${getConfig().uriBase}/document/${getDocumentPath(node)}`;
  if (node.nodeType === 'ayat') return `${nodeToUri(node.parent)}/ayat/${node.key}`;
  if (node.nodeType === 'bab') return `${nodeToUri(node.parent)}/bab/${node.key}`;
  if (node.nodeType === 'bagian') return `${nodeToUri(node.parent)}/bagian/${node.key}`;
  if (node.nodeType === 'paragraf') return `${nodeToUri(node.parent)}/paragraf/${node.key}`;
  if (node.nodeType === 'pasal') return `${nodeToUri(node.parentDoc)}/pasal/${node.key}`;
  if (node.nodeType === 'point') return `${nodeToUri(node.parent)}/point/${node.key}`;
  if (node.nodeType === 'amendedPasal') return getAmendedPasalUri(node);
  if (node.nodeType === 'amenderPoint') return getAmenderPointUri(node);
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

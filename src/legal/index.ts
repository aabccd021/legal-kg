import { assertNever } from 'assert-never';
import { upperFirst } from 'lodash';
import { getConfig } from '../config';
import { DocumentNode, _getDocumentUri, DOCUMENT_CATEGORY } from './document';
import { _getStructureUri, StructureNode, STRUCTURE_CATEGORY } from './structure';

/**
 * Legal Node
 */
export type LegalNode = DocumentNode | StructureNode;

/**
 * Get URI
 */
export function getLegalUri(node: LegalNode): string {
  if (isDocumentNode(node)) return _getDocumentUri(node);
  if (isStructureNode(node)) return _getStructureUri(node);
  assertNever(node);
}

/**
 * Type Guards
 */
function isDocumentNode(x: LegalNode): x is DocumentNode {
  return DOCUMENT_CATEGORY.includes((x as DocumentNode)._documentType);
}
function isStructureNode(x: LegalNode): x is StructureNode {
  return STRUCTURE_CATEGORY.includes((x as StructureNode)._structureType);
}

/**
 * Get Base Uri
 */
export function getOntologyBaseUri(): string {
  const { uriBase } = getConfig();
  return `${uriBase}/ontology`;
}
export function getDocumentBaseUri(): string {
  const { uriBase } = getConfig();
  return `${uriBase}/document`;
}

/**
 * Class Name
 */
export function getLegalClass(node: LegalNode): string {
  if (isDocumentNode(node)) return 'Document';
  if (isStructureNode(node)) return upperFirst(node._structureType);
  assertNever(node);
}

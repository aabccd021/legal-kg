import { assertNever } from 'assert-never';
import {
  StructureNode,
  getAyatUri,
  getMetadataUri,
  getPasalUri,
  getPointUri,
  getParagrafUri,
  getBagianUri,
  getBabUri,
} from './document-structure';
import { DocumentNode as DocumentNode, getDocumentUri, isDocumentNode } from './document-type';

export type LegalNode = DocumentNode | StructureNode;

export function getLegalUri(node: LegalNode): string {
  if (isDocumentNode(node)) return getDocumentUri(node);
  if (node._structureType === 'point') return getPointUri(node);
  if (node._structureType === 'ayat') return getAyatUri(node);
  if (node._structureType === 'pasal') return getPasalUri(node);
  if (node._structureType === 'metadata') return getMetadataUri(node);
  if (node._structureType === 'paragraf') return getParagrafUri(node);
  if (node._structureType === 'bagian') return getBagianUri(node);
  if (node._structureType === 'bab') return getBabUri(node);
  assertNever(node);
}

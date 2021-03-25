import { getConfig } from '../config';
import { DocumentNode, getDocumentUri } from './document';
import { StructureNode } from './structure';
import { getAmendedPasalUri, getAmenderPointUri } from './structure/amend';
import { getAyatUri as getAyatUri } from './structure/ayat';
import { getBabUri } from './structure/bab';
import { getBagianUri } from './structure/bagian';
import { getMetadataUri } from './structure/metadata';
import { getParagrafUri } from './structure/paragraf';
import { getPasalUri } from './structure/pasal';
import { getPointUri } from './structure/point';

/**
 * Legal Node
 */
export type LegalNode = DocumentNode | StructureNode;

/**
 * Get URI
 */
export function getUri(node: LegalNode): string {
  switch (node._structureType) {
    case 'document':
      return getDocumentUri(node);
    case 'ayat':
      return getAyatUri(node);
    case 'bab':
      return getBabUri(node);
    case 'bagian':
      return getBagianUri(node);
    case 'metadata':
      return getMetadataUri(node);
    case 'paragraf':
      return getParagrafUri(node);
    case 'pasal':
      return getPasalUri(node);
    case 'point':
      return getPointUri(node);
    case 'amendedPasal':
      return getAmendedPasalUri(node);
    case 'amenderPoint':
      return getAmenderPointUri(node);
  }
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
export function getDocumentBaseUri(): string {
  const { uriBase } = getConfig();
  return `${uriBase}/document`;
}

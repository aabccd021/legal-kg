import { DocumentNode, getDocumentUri } from '../document';
import { ReferenceText } from '../reference';
import { Points } from './point';

export type MetadataNode = {
  _structureType: 'metadata';
  parentDocument: DocumentNode;
  metadataType: 'documentMengingat' | 'documentMenimbang';
};
export function getMetadataUri(node: MetadataNode): string {
  const { metadataType, parentDocument } = node;
  const docUri = getDocumentUri(parentDocument);
  return `${docUri}/${metadataType}`;
}

export type Metadata = {
  text: ReferenceText;
  points?: Points;
};

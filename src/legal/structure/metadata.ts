import { DocumentNode, _getDocumentUri } from '../document';
import { ReferenceText } from '../utils';
import { Points } from './point';

export type MetadataNode = {
  _structureType: 'metadata';
  parentDocument: DocumentNode;
  metadataType: 'documentMengingat' | 'documentMenimbang';
};
export function _getMetadataUri(node: MetadataNode): string {
  const { metadataType, parentDocument } = node;
  const docUri = _getDocumentUri(parentDocument);
  return `${docUri}/${metadataType}`;
}

export type Metadata = {
  text: ReferenceText;
  points?: Points;
};

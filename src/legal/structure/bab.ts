import { DocumentNode, _getDocumentUri } from '../document';
import { Bagians } from './bagian';
import { Pasals } from './pasal';

export type BabNode = {
  _structureType: 'bab';
  parentDocument: DocumentNode;
  _key: number;
};
export function _getBabUri(node: BabNode): string {
  const { _key, parentDocument } = node;
  const docUri = _getDocumentUri(parentDocument);
  return `${docUri}/bab/${_key}`;
}

export type Bab = {
  _type: 'bab';
  _key: number;
  _judul: string;
  isi: Bagians | Pasals;
};

import { _getStructureUri } from '.';
import { ReferenceText } from '../reference';
import { PasalNode } from './pasal';
import { Points } from './point';

export type AyatNode = {
  _structureType: 'ayat';
  parentPasal: PasalNode;
  _key: number;
};
export function _getAyatUri(node: AyatNode): string {
  const { _key, parentPasal } = node;
  const pasalUri = _getStructureUri(parentPasal);
  return `${pasalUri}/ayat/${_key}`;
}

export type Ayat = {
  _type: 'ayat';
  _key: number;
  isi: Points | ReferenceText;
};

export type Ayats = {
  _type: 'ayats';
  ayats: Ayat[];
};

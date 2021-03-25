import { getUri } from '..';
import { ReferenceText } from '../reference';
import { AmendedPasalNode } from './amend';
import { PasalNode } from './pasal';
import { Points } from './point';

export type AyatNode = {
  _structureType: 'ayat';
  parentPasal: PasalNode | AmendedPasalNode;
  _key: number;
};
export function getAyatUri(node: AyatNode): string {
  const { _key, parentPasal } = node;
  const pasalUri = getUri(parentPasal);
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

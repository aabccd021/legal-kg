import { _getStructureUri } from '.';
import { BabNode } from './bab';
import { Paragraf } from './paragraf';
import { Pasal } from './pasal';

export type BagianNode = {
  _structureType: 'bagian';
  parentBab: BabNode;
  _key: number;
};
export function _getBagianUri(node: BagianNode): string {
  const { _key, parentBab } = node;
  const babUri = _getStructureUri(parentBab);
  return `${babUri}/bagian/${_key}`;
}

export type Bagian = {
  _type: 'bagian';
  _key: number;
  _judul: string;
  isi: Paragraf[] | Pasal[];
};
export function isBagians(isi: Bagian[] | Pasal[] | Paragraf[]): isi is Bagian[] {
  return isi?.[0]?._type === 'bagian';
}

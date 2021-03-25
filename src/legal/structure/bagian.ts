import { getUri } from '..';
import { BabNode } from './bab';
import { Paragrafs } from './paragraf';
import { Pasals } from './pasal';

export type BagianNode = {
  _structureType: 'bagian';
  parentBab: BabNode;
  _key: number;
};
export function getBagianUri(node: BagianNode): string {
  const { _key, parentBab } = node;
  const babUri = getUri(parentBab);
  return `${babUri}/bagian/${_key}`;
}

export type Bagian = {
  _type: 'bagian';
  _key: number;
  _judul: string;
  isi: Paragrafs | Pasals;
};
export type Bagians = {
  _type: 'bagians';
  bagians: Bagian[];
};

import { getUri } from '..';
import { BagianNode } from './bagian';
import { Pasals } from './pasal';

export type ParagrafNode = {
  _structureType: 'paragraf';
  parentBagian: BagianNode;
  _key: number;
};
export function getParagrafUri(node: ParagrafNode): string {
  const { _key, parentBagian } = node;
  const bagianUri = getUri(parentBagian);
  return `${bagianUri}/paragraf/${_key}`;
}

export type Paragraf = {
  _type: 'paragraf';
  _key: number;
  _judul: string;
  isi: Pasals;
};
export type Paragrafs = {
  _type: 'paragrafs';
  paragrafs: Paragraf[];
};

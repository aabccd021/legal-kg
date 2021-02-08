import { _getStructureUri } from '.';
import { Bagian, BagianNode } from './bagian';
import { Pasal } from './pasal';

export type ParagrafNode = {
  _structureType: 'paragraf';
  parentBagian: BagianNode;
  _key: number;
};
export function _getParagrafUri(node: ParagrafNode): string {
  const { _key, parentBagian } = node;
  const bagianUri = _getStructureUri(parentBagian);
  return `${bagianUri}/paragraf/${_key}`;
}

export type Paragraf = {
  _type: 'paragraf';
  _key: number;
  _judul: string;
  isi: Pasal[];
  text: string;
};
export function isParagrafs(isi: Bagian[] | Pasal[] | Paragraf[]): isi is Paragraf[] {
  return isi?.[0]?._type === 'paragraf';
}

import { BabNode } from './bab';
import { Paragrafs } from './paragraf';
import { Pasals } from './pasal';

export type BagianNode = {
  nodeType: 'bagian';
  parent: BabNode;
  key: number;
};

export type Bagian = {
  type: 'bagian';
  key: number;
  title: string;
  content: Paragrafs | Pasals;
};

export type Bagians = {
  type: 'bagians';
  bagianArr: Bagian[];
};

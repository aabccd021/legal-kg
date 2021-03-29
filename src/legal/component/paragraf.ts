import { BagianNode } from './bagian';
import { Pasals } from './pasal';

export type ParagrafNode = {
  nodeType: 'paragraf';
  parent: BagianNode;
  key: number;
};

export type Paragraf = {
  type: 'paragraf';
  key: number;
  title: string;
  content: Pasals;
};

export type Paragrafs = {
  type: 'paragrafs';
  paragrafArr: Paragraf[];
};

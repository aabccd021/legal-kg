import { DocumentNode } from '../document';
import { Bagians } from './bagian';
import { Pasals } from './pasal';

export type BabNode = {
  nodeType: 'bab';
  parent: DocumentNode;
  key: number;
};

export type Bab = {
  type: 'bab';
  key: number;
  title: string;
  content: Bagians | Pasals;
};

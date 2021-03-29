import { ReferenceText } from '../reference';
import { AmendedPasalNode } from './amend';
import { PasalNode } from './pasal';
import { Points } from './point';

export type AyatNode = {
  nodeType: 'ayat';
  parent: PasalNode | AmendedPasalNode;
  key: number;
};

export type Ayat = {
  type: 'ayat';
  key: number;
  content: Points | ReferenceText;
};

export type Ayats = {
  type: 'ayats';
  ayatArr: Ayat[];
};

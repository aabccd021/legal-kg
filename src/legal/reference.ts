import { LegalNode } from '.';

export type ReferenceText = {
  type: 'referenceText';
  text: string;
  references: Reference[];
};

export type Reference = {
  start: number;
  end: number;
  node: LegalNode;
};

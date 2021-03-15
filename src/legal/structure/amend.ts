import { DocumentNode } from './../document/index';
import { ReferenceText } from '../reference';
import { Ayats } from './ayat';
import { Points } from './point';

export type AmendPoints = {
  _type: 'amendPoints';
  description: ReferenceText;
  documentNode: DocumentNode;
  isi: AmendedPoint[];
};

export type AmendedPoint = AmendDeletePasalPoint | AmendUpdatePasalPoint | AmendInsertPasalPoint;

type AmendPointBase = {
  _type: 'amendPoint';
  _nomorKey: number;
};

export type AmendDeletePasalPoint = AmendPointBase & {
  _operation: 'delete';
  _pasalKey: string;
  isi: ReferenceText;
};

export type AmendUpdatePasalPoint = AmendPointBase & {
  _operation: 'update';
  _pasalKey: string;
  description: ReferenceText;
  isi: IsiAmendUpdatePasal;
};
export type IsiAmendUpdatePasal = Points | ReferenceText | Ayats;

export type AmendInsertPasalPoint = AmendPointBase & {
  _operation: 'insert';
  _pasalKeys: string[];
  isi: ReferenceText;
};

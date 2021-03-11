import { ReferenceText } from '../reference';

export type AmendPoints = {
  _type: 'amendPoints';
  description: ReferenceText;
  isi: AmendedPoint[];
};

export type AmendedPoint = AmendDeletePasalPoint | AmendUpdatePasalPoint;
// export type AmendedPoint = {
//   _type: 'amendedPoint';
//   _key: number;
//   description: ReferenceText;
//   pasalKeys?: string[];
//   isi:
//     | Points
//     | ReferenceText
//     | {
//         _type: 'ayats';
//         ayats: Ayat[];
//       };
// };

type AmendPointBase = {
  _type: 'amendPoint';
  _nomorKey: number;
};

export type AmendDeletePasalPoint = AmendPointBase & {
  _operation: 'delete';
  _pasalKey: string;
};

export type AmendUpdatePasalPoint = AmendPointBase & {
  _operation: 'update';
  _pasalKey: string;
  isi: ReferenceText;
};

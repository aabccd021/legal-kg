import { ReferenceText } from '../reference';
import { Ayat } from './ayat';
import { Points } from './point';

export type AmendPoints = {
  _type: 'amendPoints';
  description: string;
  isi: AmendedPoint[];
};

export type AmendedPoint = {
  _type: 'amendedPoint';
  _key: number;
  isi:
    | Points
    | ReferenceText
    | {
        _type: 'ayats';
        ayats: Ayat[];
      };
};

import { LegalTrace } from './uri';
import { DocumentTrace } from './uri/document-type';

export type ReferenceText = {
  _type: 'referenceText';
  text: string;
  references: Reference[];
};

export type Reference = {
  start: number;
  end: number;
  trace: LegalTrace;
};

export type Point = {
  _type: 'numPoint' | 'alphaPoint';
  _key: string | number;
  isi?: Points;
  text: ReferenceText;
};

export type Points = {
  _type: 'points';
  _description: ReferenceText;
  isi: Point[];
  text: string;
};

export type Ayat = {
  _type: 'ayat';
  _key: number;
  isi?: Points;
  text: ReferenceText;
};

export type Pasal = {
  _type: 'pasal';
  _key: number;
  isi?: Ayat[] | Points;
  text: ReferenceText;
};

export type Paragraf = {
  _type: 'paragraf';
  _key: number;
  _judul: string;
  isi: Pasal[];
  text: string;
};

export type Bagian = {
  _type: 'bagian';
  _key: number;
  _judul: string;
  isi: Paragraf[] | Pasal[];
  text: string;
};

export type Bab = {
  _type: 'bab';
  _key: number;
  _judul: string;
  isi: Bagian[] | Pasal[];
  text: string;
};

export type LegalDocument = {
  _trace: DocumentTrace;
  penjelasan?: string[];
  pengesahanText?: string;
  opText?: string;
  babs?: Bab[];
  _name?: string;
  _nomor?: number;
  _tahun?: number;
  _pemutus?: string;
  _denganPersetujuan?: string[];
  _tentang?: string;
  _salinan?: string;
  _memutuskan?: string;
  _tempatDisahkan?: string;
  _tanggalDisahkan?: string;
  _tempatDitetapkan?: string;
  _tanggalDitetapkan?: string;
  _jabatanPengesah?: string;
  _namaPengesah?: string;
  _tempatDiundangkan?: string;
  _tanggalDiundangkan?: string;
  _sekretaris?: string;
  _dokumen?: string;
  salinanSesuaiDenganAslinya?: string;
  menimbang?: Mengimbang;
  mengingat?: Mengimbang;
};

export type Mengimbang = {
  text: ReferenceText;
  points?: Points;
};

export function isAyats(isi: string[] | Ayat[]): isi is Ayat[] {
  return (isi?.[0] as Ayat)?._type === 'ayat';
}

export function isBagians(isi: Bagian[] | Pasal[] | Paragraf[]): isi is Bagian[] {
  return isi?.[0]?._type === 'bagian';
}

export function isPasals(isi: Bagian[] | Pasal[] | Paragraf[]): isi is Pasal[] {
  return isi?.[0]?._type === 'pasal';
}

export function isParagrafs(isi: Bagian[] | Pasal[] | Paragraf[]): isi is Paragraf[] {
  return isi?.[0]?._type === 'paragraf';
}

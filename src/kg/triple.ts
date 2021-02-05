import { LegalTrace } from '../uri';
import {
  PasalTrace,
  AyatTrace,
  BabTrace,
  BagianTrace,
  MetadataTrace,
  ParagrafTrace,
  PointsTrace,
  PointTrace,
} from '../uri/document-structure';
import { DocumentTrace } from '../uri/document-type';

export type Triple =
  | AyatTriple
  | BabTriple
  | BagianTriple
  | DocumentTriple
  | MetadataTriple
  | ParagrafTriple
  | PasalTriple
  | PointTriple
  | PointsTriple;

type AyatTriple =
  | [PasalTrace, 'hasAyat', AyatTrace]
  | [AyatTrace, 'hasKey', number]
  | [AyatTrace, 'hasText', string];

type BabTriple = [BabTrace, 'hasKey', number] | [BabTrace, 'hasText' | 'hasJudul', string];

type BagianTriple =
  | [BabTrace, 'hasBagian', BagianTrace]
  | [BagianTrace, 'hasKey', number]
  | [BagianTrace, 'hasText', string];

type DocumentTriple =
  | [DocumentTrace, 'hasBab', BabTrace]
  | [DocumentTrace, 'hasJudul', string]
  | [DocumentTrace, MetadataVocab, string | number | undefined];

type MetadataVocab =
  | 'denganPersetujuan'
  | 'dokumen'
  | 'jabatanPengesah'
  | 'memutuskan'
  | 'menimbang'
  | 'mengingat'
  | 'namaPengesah'
  | 'name'
  | 'nomor'
  | 'pemutus'
  | 'penjelasan'
  | 'salinan'
  | 'sekretaris'
  | 'tahun'
  | 'tanggalDisahkan'
  | 'tanggalDitetapkan'
  | 'tanggalDiundangkan'
  | 'tempatDisahkan'
  | 'tempatDitetapkan'
  | 'tempatDiundangkan'
  | 'tentang';

type MetadataTriple =
  | [DocumentTrace, 'hasMetadata', MetadataTrace]
  | [MetadataTrace, 'hasText', string];

type ParagrafTriple =
  | [BagianTrace, 'hasParagraf', ParagrafTrace]
  | [ParagrafTrace, 'hasKey', number]
  | [ParagrafTrace, 'hasText', string];

type PasalTriple =
  | [PasalParentTrace, 'hasPasal', PasalTrace]
  | [PasalTrace, 'hasKey', number]
  | [PasalTrace, 'hasText', string];

type PointTriple =
  | [PointsTrace, 'hasPoint', PointTrace]
  | [PointTrace, 'hasKey', number | string]
  | [PointTrace, 'hasText' | 'hasJudul', string];

type PointsTriple =
  | [PointsTrace, 'hasDescription' | 'hasText', string]
  | [PointsTrace, 'references' | LegalTrace];

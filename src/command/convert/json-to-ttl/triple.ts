import { LegalNode } from '../../../legal';
import { DocumentNode } from '../../../legal/document';
import { AyatNode } from '../../../legal/structure/ayat';
import { BabNode } from '../../../legal/structure/bab';
import { BagianNode } from '../../../legal/structure/bagian';
import { MetadataNode } from '../../../legal/structure/metadata';
import { ParagrafNode } from '../../../legal/structure/paragraf';
import { PasalNode, PasalParentNode } from '../../../legal/structure/pasal';
import { PointsNode, PointNode } from '../../../legal/structure/point';

export type Triple = (
  | AyatTriple
  | BabTriple
  | BagianTriple
  | DocumentTriple
  | MetadataTriple
  | ParagrafTriple
  | PasalTriple
  | PointTriple
  | PointsTriple
) &
  AllowedTriple;

type AllowedTriple = [LegalNode, unknown, unknown];

type AyatTriple =
  | [PasalNode, 'hasAyat', AyatNode]
  | [AyatNode, 'hasKey', number]
  | [AyatNode, 'hasText', string];

type BabTriple = [BabNode, 'hasKey', number] | [BabNode, 'hasText' | 'hasJudul', string];

type BagianTriple =
  | [BabNode, 'hasBagian', BagianNode]
  | [BagianNode, 'hasKey', number]
  | [BagianNode, 'hasText', string];

type DocumentTriple =
  | [DocumentNode, 'hasBab', BabNode]
  | [DocumentNode, 'hasJudul', string]
  | [DocumentNode, StringMetadataVocab, string | undefined]
  | [DocumentNode, NumberMetadataVocab, number | undefined];

type StringMetadataVocab =
  | 'denganPersetujuan'
  | 'dokumen'
  | 'jabatanPengesah'
  | 'memutuskan'
  | 'menimbang'
  | 'mengingat'
  | 'namaPengesah'
  | 'name'
  | 'pemutus'
  | 'penjelasan'
  | 'salinan'
  | 'sekretaris'
  | 'tanggalDisahkan'
  | 'tanggalDitetapkan'
  | 'tanggalDiundangkan'
  | 'tempatDisahkan'
  | 'tempatDitetapkan'
  | 'tempatDiundangkan'
  | 'tentang';

type NumberMetadataVocab = 'tahun' | 'nomor';

type MetadataTriple =
  | [DocumentNode, 'hasMetadata', MetadataNode]
  | [MetadataNode, 'hasText', string];

type ParagrafTriple =
  | [BagianNode, 'hasParagraf', ParagrafNode]
  | [ParagrafNode, 'hasKey', number]
  | [ParagrafNode, 'hasText', string];

type PasalTriple =
  | [PasalParentNode, 'hasPasal', PasalNode]
  | [PasalNode, 'hasKey', number]
  | [PasalNode, 'hasText', string];

type PointTriple =
  | [PointsNode, 'hasPoint', PointNode]
  | [PointNode, 'hasKey', number | string]
  | [PointNode, 'hasText' | 'hasJudul', string];

type PointsTriple =
  | [PointsNode, 'hasDescription' | 'hasText', string]
  | [PointsNode, 'references', LegalNode];

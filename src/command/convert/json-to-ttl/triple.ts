import { ParagrafNode } from './../../../legal/structure/paragraf';
import { LegalNode } from '../../../legal';
import { DocumentNode } from '../../../legal/document';
import { AyatNode } from '../../../legal/structure/ayat';
import { BabNode } from '../../../legal/structure/bab';
import { BagianNode } from '../../../legal/structure/bagian';
import { MetadataNode } from '../../../legal/structure/metadata';
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
  | PasalParentTriple
  | PointTriple
  | PointsTriple
) &
  AllowedTriple;

type AllowedTriple = [LegalNode, unknown, unknown];

type AyatTriple =
  | [AyatNode, 'hasKey', number]
  | [AyatNode, 'hasText', string]
  | [AyatNode, 'hasPoints', PointsNode];

type BabTriple =
  | [BabNode, 'hasKey', number]
  | [BabNode, 'hasJudul', string]
  | [BabNode, 'hasBagian', BagianNode];

type BagianTriple =
  | [BabNode, 'hasBagian', BagianNode]
  | [BagianNode, 'hasKey', number]
  | [BagianNode, 'hasJudul', string]
  | [BagianNode, 'hasParagraf', ParagrafNode];

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
  | [MetadataNode, 'references', LegalNode]
  | [MetadataNode, 'hasText', string];

type ParagrafTriple = [ParagrafNode, 'hasKey', number] | [ParagrafNode, 'hasJudul', string];

type PasalTriple =
  | [PasalNode, 'hasKey', number]
  | [PasalNode, 'hasPoint', PointsNode]
  | [PasalNode, 'hasText', string]
  | [PasalNode, 'hasAyat', AyatNode];

type PasalParentTriple = [PasalParentNode, 'hasPasal', PasalNode];

type PointTriple =
  | [PointNode, 'hasKey', number | string]
  | [PointNode, 'hasPoints', PointsNode]
  | [PointNode, 'hasText', string];

type PointsTriple =
  | [PointsNode, 'hasPoint', PointNode]
  | [PointsNode, 'hasDescription', string]
  | [PointsNode, 'references', LegalNode];

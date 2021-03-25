import { ParagrafNode } from './../../../legal/structure/paragraf';
import { LegalNode } from '../../../legal';
import { DocumentNode } from '../../../legal/document';
import { AyatNode } from '../../../legal/structure/ayat';
import { BabNode } from '../../../legal/structure/bab';
import { BagianNode } from '../../../legal/structure/bagian';
import { MetadataNode } from '../../../legal/structure/metadata';
import { PasalNode } from '../../../legal/structure/pasal';
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
  | [AyatNode, 'references', LegalNode]
  | [AyatNode, 'hasText', string]
  | [AyatNode, 'hasPoints', PointsNode];

type BabTriple =
  | [BabNode, 'hasKey', number]
  | [BabNode, 'hasJudul', string]
  | [BabNode, 'hasBagian', BagianNode]
  | [BabNode, 'hasPasal', PasalNode];

type BagianTriple =
  | [BabNode, 'hasBagian', BagianNode]
  | [BagianNode, 'hasKey', number]
  | [BagianNode, 'hasJudul', string]
  | [BagianNode, 'hasParagraf', ParagrafNode]
  | [BagianNode, 'hasPasal', PasalNode];

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

type ParagrafTriple =
  | [ParagrafNode, 'hasKey', number]
  | [ParagrafNode, 'hasJudul', string]
  | [ParagrafNode, 'hasPasal', PasalNode];

type PasalTriple =
  | [PasalNode, 'hasKey', number]
  | [PasalNode, 'hasPoint', PointsNode]
  | [PasalNode, 'references', LegalNode]
  | [PasalNode, 'hasText', string]
  | [PasalNode, 'hasAyat', AyatNode];
// TODO: hasAmend

type PointTriple =
  | [PointNode, 'hasKey', number | string]
  | [PointNode, 'hasPoints', PointsNode]
  | [PointNode, 'references', LegalNode]
  | [PointNode, 'hasText', string];

type PointsTriple =
  | [PointsNode, 'hasPoint', PointNode]
  | [PointsNode, 'hasDescription', string]
  | [PointsNode, 'references', LegalNode];

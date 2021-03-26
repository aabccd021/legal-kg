import {
  AmendedPasalNode,
  AmenderDeletePointNode,
  AmenderInsertPointNode,
  AmenderPointNode,
  AmenderUpdatePointNode,
} from './../../../legal/structure/amend';
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
  | AmendedPasalTriple
  | AmendPointTriple
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
  | HasReferenceTriple
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

type ParagrafTriple = [ParagrafNode, 'hasKey', number] | [ParagrafNode, 'hasJudul', string];

type PasalTriple =
  | [PasalNode, 'hasKey', number]
  | [PasalNode, 'hasPoints', PointsNode]
  | [PasalNode, 'hasText', string]
  | [PasalNode, 'references', LegalNode]
  | [PasalNode, 'hasAyat', AyatNode];

type PasalParentTriple = [PasalParentNode, 'hasPasal', PasalNode];

type PointTriple =
  | [PointNode, 'hasKey', number | string]
  | [PointNode, 'hasPoints', PointsNode]
  | [PointNode, 'hasText', string];

type PointsTriple =
  | [PointsNode, 'hasPoint', PointNode | AmenderPointNode]
  | [PointsNode, 'amends', DocumentNode]
  | [PointsNode, 'hasDescription', string];

// gimana caranya biar ga bisa exist barengan?

type AmendPointTriple =
  | [AmenderDeletePointNode, 'hasPasal', PasalNode]
  | [AmenderUpdatePointNode | AmenderInsertPointNode, 'hasDescription', string]
  | [AmenderUpdatePointNode | AmenderInsertPointNode, 'hasPasal', AmendedPasalNode];

type HasReferenceTriple = [
  AmenderUpdatePointNode | AmenderInsertPointNode | AmendedPasalNode | PointsNode,
  'references',
  LegalNode
];

type AmendedPasalTriple =
  | [AmendedPasalNode, 'hasKey', number]
  | [AmendedPasalNode, 'hasPoints', PointsNode]
  | [AmendedPasalNode, 'hasText', string]
  | [AmendedPasalNode, 'hasAyat', AyatNode];

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

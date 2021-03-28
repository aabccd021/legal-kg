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
  | [AmendedPasalNode, 'hasAyat', AyatNode]
  | [AmendedPasalNode, 'hasKey', number]
  | [AmendedPasalNode, 'hasPoints', PointsNode]
  | [AmendedPasalNode, 'hasText', string]
  | [AmendedPasalNode, 'references', LegalNode]
  | [AmenderDeletePointNode, 'hasPasal', PasalNode]
  | [AmenderInsertPointNode, 'hasDescription', string]
  | [AmenderInsertPointNode, 'insertedPasal', AmendedPasalNode]
  | [AmenderInsertPointNode, 'references', LegalNode]
  | [AmenderUpdatePointNode, 'hasDescription', string]
  | [AmenderUpdatePointNode, 'references', LegalNode]
  | [AmenderUpdatePointNode, 'updatedPasal', AmendedPasalNode]
  | [AyatNode, 'hasKey', number]
  | [AyatNode, 'hasPoints', PointsNode]
  | [AyatNode, 'hasText', string]
  | [BabNode, 'hasBagian', BagianNode]
  | [BabNode, 'hasJudul', string]
  | [BabNode, 'hasKey', number]
  | [BagianNode, 'hasJudul', string]
  | [BagianNode, 'hasKey', number]
  | [BagianNode, 'hasParagraf', ParagrafNode]
  | [DocumentNode, 'denganPersetujuan', string]
  | [DocumentNode, 'dokumen', string]
  | [DocumentNode, 'hasBab', BabNode]
  | [DocumentNode, 'hasJudul', string]
  | [DocumentNode, 'hasMetadata', MetadataNode]
  | [DocumentNode, 'jabatanPengesah', string]
  | [DocumentNode, 'memutuskan', string]
  | [DocumentNode, 'mengingat', string]
  | [DocumentNode, 'menimbang', string]
  | [DocumentNode, 'namaPengesah', string]
  | [DocumentNode, 'name', string]
  | [DocumentNode, 'nomor', number]
  | [DocumentNode, 'pemutus', string]
  | [DocumentNode, 'penjelasan', string]
  | [DocumentNode, 'salinan', string]
  | [DocumentNode, 'sekretaris', string]
  | [DocumentNode, 'tahun', number]
  | [DocumentNode, 'tanggalDisahkan', string]
  | [DocumentNode, 'tanggalDitetapkan', string]
  | [DocumentNode, 'tanggalDiundangkan', string]
  | [DocumentNode, 'tempatDisahkan', string]
  | [DocumentNode, 'tempatDitetapkan', string]
  | [DocumentNode, 'tempatDiundangkan', string]
  | [DocumentNode, 'tentang', string]
  | [MetadataNode, 'hasText', string]
  | [MetadataNode, 'references', LegalNode]
  | [ParagrafNode, 'hasJudul', string]
  | [ParagrafNode, 'hasKey', number]
  | [PasalNode, 'hasAyat', AyatNode]
  | [PasalNode, 'hasKey', number]
  | [PasalNode, 'hasPoints', PointsNode]
  | [PasalNode, 'hasText', string]
  | [PasalNode, 'references', LegalNode]
  | [PasalParentNode, 'hasPasal', PasalNode]
  | [PointNode, 'hasKey', number | string]
  | [PointNode, 'hasPoints', PointsNode]
  | [PointNode, 'hasText', string]
  | [PointsNode, 'amends', DocumentNode]
  | [PointsNode, 'hasDescription', string]
  | [PointsNode, 'hasPoint', AmenderPointNode]
  | [PointsNode, 'hasPoint', PointNode]
  | [PointsNode, 'references', LegalNode]
) &
  [LegalNode, unknown, string | number | LegalNode];

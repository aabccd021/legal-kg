import {
  AmendedPasalNode,
  AmenderDeletePointNode,
  AmenderInsertPointNode,
  AmenderPointNode,
  AmenderUpdatePointNode,
} from '../../../legal/component/amend';
import { ParagrafNode } from '../../../legal/component/paragraf';
import { LegalNode } from '../../../legal';
import { DocumentNode } from '../../../legal/document';
import { AyatNode } from '../../../legal/component/ayat';
import { BabNode } from '../../../legal/component/bab';
import { BagianNode } from '../../../legal/component/bagian';
import { PasalNode } from '../../../legal/component/pasal';
import { PointsNode, PointNode } from '../../../legal/component/point';

export type Triple = (
  | [AmendedPasalNode, 'amendedPasalHasAyat', AyatNode]
  | [AmendedPasalNode, 'amendedPasalHasKey', number]
  | [AmendedPasalNode, 'amendedPasalHasPoints', PointsNode]
  | [AmendedPasalNode, 'amendedPasalHasDescription', string]
  | [AmendedPasalNode, 'amendedPasalHasDescriptionReference', LegalNode]
  | [AmenderDeletePointNode, 'amenderDeletePointHasPasal', PasalNode]
  | [AmenderInsertPointNode, 'amenderInsertPointInsertedPasal', AmendedPasalNode]
  | [AmenderInsertPointNode, 'amenderInsertPointHasDescription', string]
  | [AmenderInsertPointNode, 'amenderInsertPointHasDescriptionReference', LegalNode]
  | [AmenderUpdatePointNode, 'amenderUpdatePointUpdatedPasal', AmendedPasalNode]
  | [AmenderUpdatePointNode, 'amenderUpdatePointHasDescription', string]
  | [AmenderUpdatePointNode, 'amenderUpdatePointHasDescriptionReference', LegalNode]
  | [AyatNode, 'ayatHasKey', number]
  | [AyatNode, 'ayatHasPoints', PointsNode]
  | [AyatNode, 'ayatHasText', string]
  | [BabNode, 'babHasBagian', BagianNode]
  | [BabNode, 'babHasTitle', string]
  | [BabNode, 'babHasKey', number]
  | [BabNode, 'babHasPasal', PasalNode]
  | [BagianNode, 'bagianHasJudul', string]
  | [BagianNode, 'bagianHasKey', number]
  | [BagianNode, 'bagianHasParagraf', ParagrafNode]
  | [BagianNode, 'bagianHasPasal', PasalNode]
  // | [DocumentNode, 'DenganPersetujuan', string]
  // | [DocumentNode, 'Dokumen', string]
  | [DocumentNode, 'documentHasBab', BabNode]
  // | [DocumentNode, 'HasJudul', string]
  // | [DocumentNode, 'HasMetadata', MetadataNode]
  // | [DocumentNode, 'jabatanPengesah', string]
  // | [DocumentNode, 'memutuskan', string]
  // | [DocumentNode, 'mengingat', string]
  // | [DocumentNode, 'menimbang', string]
  // | [DocumentNode, 'namaPengesah', string]
  // | [DocumentNode, 'name', string]
  // | [DocumentNode, 'nomor', number]
  // | [DocumentNode, 'pemutus', string]
  // | [DocumentNode, 'penjelasan', string]
  // | [DocumentNode, 'salinan', string]
  // | [DocumentNode, 'sekretaris', string]
  // | [DocumentNode, 'tahun', number]
  // | [DocumentNode, 'tanggalDisahkan', string]
  // | [DocumentNode, 'tanggalDitetapkan', string]
  // | [DocumentNode, 'tanggalDiundangkan', string]
  // | [DocumentNode, 'tempatDisahkan', string]
  // | [DocumentNode, 'tempatDitetapkan', string]
  // | [DocumentNode, 'tempatDiundangkan', string]
  // | [DocumentNode, 'tentang', string]
  // | [MetadataNode, 'HasText', string]
  // | [MetadataNode, 'references', LegalNode]
  | [ParagrafNode, 'paragrafHasJudul', string]
  | [ParagrafNode, 'paragrafHasKey', number]
  | [ParagrafNode, 'paragrafHasPasal', PasalNode]
  | [PasalNode, 'pasalHasAyat', AyatNode]
  | [PasalNode, 'pasalHasKey', number]
  | [PasalNode, 'pasalHasPoints', PointsNode]
  | [PasalNode, 'pasalHasText', string]
  | [PasalNode, 'pasalHasDesriptionReference', LegalNode]
  | [PointNode, 'pointHasKey', number | string]
  | [PointNode, 'pointHasPoints', PointsNode]
  | [PointNode, 'pointHasText', string]
  | [PointsNode, 'pointsAmendsDocument', DocumentNode]
  | [PointsNode, 'pointsHasDescription', string]
  | [PointsNode, 'pointsHasPoint', AmenderPointNode]
  | [PointsNode, 'pointsHasPoint', PointNode]
  | [PointsNode, 'pointsHasDescriptionReference', LegalNode]
) &
  [LegalNode, unknown, string | number | LegalNode];

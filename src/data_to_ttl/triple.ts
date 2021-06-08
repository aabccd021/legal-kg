import {
  AyatNode,
  PasalNode,
  BabNode,
  BagianNode,
  ParagrafNode,
  PointNode,
  TextNode,
  PasalVersionNode,
  BagianSetNode,
  PasalSetNode,
  ParagrafSetNode,
  AyatSetNode,
  PointSetNode,
  BabSetNode,
  MenimbangNode,
  MengingatNode,
} from '../component';
import { DocumentNode } from '../document';
import { DateNode, LegalNode } from '../uri';

/**
 * FooSet => Set/Collection of Foo, for easier triple generation.
 *
 * FooHasRawText => Foo has text as primitive string (RawText).
 * RawText has no citation.
 * RawText represents it's text and all of it's childrens texts.
 * For example, if pasal has ayat as it's child,
 * RawText contains all text of the pasal and the ayat.
 *
 * FooHasText => Foo has text as node (TextNode),
 * TextNode contains citation.
 * Text in TextNode only represents it's text, NOT including the childrens texts.
 *
 *
 */
export type LegalTriple = (
  | [AyatNode, 'nomor', number]
  | [AyatNode, 'ayatHasPointSet', PointSetNode]
  // raw text?
  | [AyatNode, 'teks', TextNode]
  | [AyatNode, 'ayatHasRawText', string]
  | [AyatSetNode, 'ayatSetHasAyat', AyatNode]
  | [BabNode, 'babHasBagianSet', BagianSetNode]
  | [BabNode, 'nomor', number]
  | [BabNode, 'babHasPasalSet', PasalSetNode]
  | [BabNode, 'judul', string]
  | [BabSetNode, 'babSetHasBab', BabNode]
  | [BagianNode, 'nomor', number]
  | [BagianNode, 'bagianHasParagrafSet', ParagrafSetNode]
  | [BagianNode, 'bagianHasPasalSet', PasalSetNode]
  | [BagianNode, 'judul', string]
  | [BagianSetNode, 'bagianSetHasBagian', BagianNode]
  | [DocumentNode, 'documentHasBabSet', BabSetNode]
  | [DocumentNode, 'disahkanPada', DateNode]
  | [DocumentNode, 'disahkanDi', string]
  | [DocumentNode, 'disahkanOleh', string]
  | [DocumentNode, 'documentHasDisahkanJabatanPengesah', string]
  | [DocumentNode, 'documentHasPasal', PasalNode]
  | [DocumentNode, 'documentHasPasalSet', PasalSetNode]
  | [DocumentNode, 'mengingat', MengingatNode]
  | [DocumentNode, 'menimbang', MenimbangNode]
  | [DocumentNode, 'tentang', string]
  | [MenimbangNode, 'menimbangHasPointSet', PointSetNode]
  | [MenimbangNode, 'teks', TextNode]
  | [MengingatNode, 'mengingatHasPointSet', PointSetNode]
  | [MengingatNode, 'teks', TextNode]
  | [ParagrafNode, 'nomor', number]
  | [ParagrafNode, 'paragrafHasPasalSet', PasalSetNode]
  | [ParagrafNode, 'judul', string]
  | [ParagrafSetNode, 'paragrafSetHasParagraf', ParagrafNode]
  | [PasalNode, 'nomor', number | string]
  | [PasalNode, 'pasalHasPasalVersion', PasalVersionNode]
  | [PasalSetNode, 'pasalSetHasPasal', PasalNode]
  | [PasalVersionNode, 'pasalVersionHasAyatSet', AyatSetNode]
  | [PasalVersionNode, 'pasalVersionHasPointSet', PointSetNode]
  | [
      PasalVersionNode,
      'pasalVersionHasState',
      'orisinal' | 'penyisipan' | 'pengubahan' | 'penghapusan'
    ]
  | [PasalVersionNode, 'pasalVersionHasVersionDate', DateNode]
  | [PasalVersionNode, 'pasalVersionHasText', TextNode]
  | [PasalVersionNode, 'pasalVersionHasRawText', string]
  | [PointNode, 'nomor', string | number]
  | [PointNode, 'pointHasPointSet', PointSetNode]
  | [PointNode, 'pointHasText', TextNode]
  // Represents Amendment
  | [PointNode, 'mengubah' | 'menghapus' | 'menyisipkan', PasalVersionNode]
  | [PointSetNode, 'pointSetHasDescription', TextNode]
  | [PointSetNode, 'pointSetHasPoint', PointNode]
  | [TextNode, 'textHasTextString', string]
  | [TextNode, 'textReferencesLegal', LegalNode]
) &
  // Nevermind of this, just to make sure Subject is LegalNode, and Object is as defined below.
  [LegalNode, string, string | number | LegalNode | DateNode];

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
  | [AyatNode, 'ayatHasKey', number]
  | [AyatNode, 'ayatHasPointSet', PointSetNode]
  | [AyatNode, 'ayatHasText', TextNode]
  | [AyatNode, 'ayatHasRawText', string]
  | [AyatSetNode, 'ayatSetHasAyat', AyatNode]
  | [BabNode, 'babHasBagianSet', BagianSetNode]
  | [BabNode, 'babHasKey', number]
  | [BabNode, 'babHasPasalSet', PasalSetNode]
  | [BabNode, 'babHasTitle', string]
  | [BabSetNode, 'babSetHasBab', BabNode]
  | [BagianNode, 'bagianHasKey', number]
  | [BagianNode, 'bagianHasParagrafSet', ParagrafSetNode]
  | [BagianNode, 'bagianHasPasalSet', PasalSetNode]
  | [BagianNode, 'bagianHasTitle', string]
  | [BagianSetNode, 'bagianSetHasBagian', BagianNode]
  | [DocumentNode, 'documentHasBabSet', BabSetNode]
  | [DocumentNode, 'documentHasDisahkanDate', DateNode]
  | [DocumentNode, 'documentHasDisahkanLocation', string]
  | [DocumentNode, 'documentHasDisahkanPengesah', string]
  | [DocumentNode, 'documentHasDisahkanJabatanPengesah', string]
  | [DocumentNode, 'documentHasPasal', PasalNode]
  | [DocumentNode, 'documentHasPasalSet', PasalSetNode]
  | [DocumentNode, 'documentMengingat', MengingatNode]
  | [DocumentNode, 'documentMenimbang', MenimbangNode]
  | [DocumentNode, 'documentTentang', string]
  | [MenimbangNode, 'menimbangHasPointSet', PointSetNode]
  | [MenimbangNode, 'menimbangHasText', TextNode]
  | [MengingatNode, 'mengingatHasPointSet', PointSetNode]
  | [MengingatNode, 'mengingatHasText', TextNode]
  | [ParagrafNode, 'paragrafHasKey', number]
  | [ParagrafNode, 'paragrafHasPasalSet', PasalSetNode]
  | [ParagrafNode, 'paragrafHasTitle', string]
  | [ParagrafSetNode, 'paragrafSetHasParagraf', ParagrafNode]
  | [PasalNode, 'pasalHasKey', number | string]
  | [PasalNode, 'pasalHasPasalVersion', PasalVersionNode]
  | [PasalSetNode, 'pasalSetHasPasal', PasalNode]
  | [PasalVersionNode, 'pasalVersionHasAyatSet', AyatSetNode]
  | [PasalVersionNode, 'pasalVersionHasPointSet', PointSetNode]
  | [PasalVersionNode, 'pasalVersionHasState', 'exists' | 'deleted']
  | [PasalVersionNode, 'pasalVersionHasVersionDate', DateNode]
  | [PasalVersionNode, 'pasalVersionHasText', TextNode]
  | [PasalVersionNode, 'pasalVersionHasRawText', string]
  | [PointNode, 'pointHasKey', string | number]
  | [PointNode, 'pointHasPointSet', PointSetNode]
  | [PointNode, 'pointHasText', TextNode]
  // Represents Amendment
  | [
      PointNode,
      'pointUpdatePasalVersion' | 'pointDeletePasalVersion' | 'pointInsertPasalVersion',
      PasalVersionNode
    ]
  | [PointSetNode, 'pointSetHasDescription', TextNode]
  | [PointSetNode, 'pointSetHasPoint', PointNode]
  | [TextNode, 'textHasTextString', string]
  | [TextNode, 'textReferencesLegal', LegalNode]
) &
  // Nevermind of this, just to make sure Subject is LegalNode, and Object is as defined below.
  [LegalNode, string, string | number | LegalNode | DateNode];

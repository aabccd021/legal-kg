import { DateNode, LegalNode } from '../../../legal';
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
} from '../../../legal/component';
import { DocumentNode } from '../../../legal/document';

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
  | [MenimbangNode, 'menimbangHasPointSet', PointSetNode]
  | [MengingatNode, 'mengingatHasPointSet', PointSetNode]
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
  [LegalNode, string, string | number | LegalNode | DateNode];

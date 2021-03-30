import { LegalNode } from '../../../legal';
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
} from '../../../legal/component';
import { DocumentNode } from '../../../legal/document';

export type LegalTriple = (
  | [AyatNode, 'ayatHasKey', number]
  | [AyatNode, 'ayatHasPointSet', PointSetNode]
  | [AyatNode, 'ayatHasText', TextNode]
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
  | [ParagrafNode, 'paragrafHasKey', number]
  | [ParagrafNode, 'paragrafHasPasalSet', PasalSetNode]
  | [ParagrafNode, 'paragrafHasTitle', string]
  | [ParagrafSetNode, 'paragrafSetHasParagraf', ParagrafNode]
  | [PasalNode, 'pasalHasKey', number | string]
  | [PasalNode, 'pasalHasPasalState', PasalVersionNode]
  | [PasalSetNode, 'pasalSetHasPasal', PasalNode]
  | [PasalVersionNode, 'pasalStateHasAyatSet', AyatSetNode]
  | [PasalVersionNode, 'pasalStateHasPointSet', PointSetNode]
  | [PasalVersionNode, 'pasalStateHasState', 'exists' | 'delete']
  | [PasalVersionNode, 'pasalStateHasText', TextNode]
  | [PointNode, 'pointHasKey', string | number]
  | [PointNode, 'pointHasPointSet', PointSetNode]
  | [PointNode, 'pointHasText', TextNode]
  | [PointNode, 'pointUpdatePasal' | 'pointDeletePasal' | 'pointInsertPasal', PasalVersionNode]
  | [PointSetNode, 'pointSetHasDescription', TextNode]
  | [PointSetNode, 'pointSetHasPoint', PointNode]
  | [TextNode, 'textHasTextString', string]
  | [TextNode, 'textReferencesLegal', LegalNode]
) &
  [LegalNode, unknown, string | number | LegalNode];

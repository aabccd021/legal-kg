import { LegalNode } from '../../../legal';
import {
  AyatNode,
  PasalNode,
  BabNode,
  BagianNode,
  ParagrafNode,
  PointNode,
  TextNode,
  PasalStateNode,
  BagianSetNode,
  PasalSetNode,
  ParagrafSetNode,
  AyatSetNode,
  PointSetNode,
  BabSetNode,
} from '../../../legal/component';
import { DocumentNode } from '../../../legal/document';

export type LegalTriple = (
  | [AyatNode, 'ayatHasDescription', TextNode]
  | [AyatNode, 'ayatHasKey', number]
  | [AyatNode, 'ayatHasPoint', PointNode]
  | [AyatNode, 'ayatHasText', TextNode]
  | [AyatSetNode, 'ayatSetHasAyat', AyatNode]
  | [BabNode, 'babHasBagianSet', BagianSetNode]
  | [BabNode, 'babHasKey', number] //
  | [BabNode, 'babHasPasalSet', PasalSetNode]
  | [BabNode, 'babHasTitle', string] //
  | [BabSetNode, 'babSetHasBab', BabNode] //
  | [BagianNode, 'bagianHasJudul', string] //
  | [BagianNode, 'bagianHasKey', number] //
  | [BagianNode, 'bagianHasParagrafSet', ParagrafSetNode]
  | [BagianNode, 'bagianHasPasalSet', PasalSetNode]
  | [BagianSetNode, 'bagianSetHasBagian', BagianNode] //
  | [DocumentNode, 'documentHasBabSet', BabSetNode]
  | [ParagrafNode, 'paragrafHasJudul', string]
  | [ParagrafNode, 'paragrafHasKey', number]
  | [ParagrafNode, 'paragrafHasPasalSet', PasalSetNode]
  | [ParagrafSetNode, 'paragrafSetHasParagraf', ParagrafNode]
  | [PasalNode, 'pasalHasPasalState', PasalStateNode]
  | [PasalNode, 'pasalHasKey', number]
  | [PasalSetNode, 'pasalSetHasPasal', PasalNode]
  | [PasalStateNode, 'pasalStateHasState', 'exists' | 'deleted']
  | [PasalStateNode, 'pasalStateHasDescription', TextNode]
  | [PasalStateNode, 'pasalStateHasPointSet', PointSetNode]
  | [PasalStateNode, 'pasalStateHasAyatSet', AyatSetNode]
  | [PasalStateNode, 'pasalStateHasText', TextNode]
  | [PointSetNode, 'pointSetHasPoint', PointNode]
  | [PointSetNode, 'pointSetHasDescription', TextNode]
  | [PointNode, 'pointUpdatePasal' | 'pointDeletePasal', PasalStateNode]
  | [PointNode, 'pointHasCharKey', string]
  | [PointNode, 'pointHasNumKey', number]
  | [PointNode, 'pointHasPointSet', PointSetNode]
  | [PointNode, 'pointHasText', TextNode]
) &
  [LegalNode, unknown, string | number | LegalNode];

import {
  PasalDeleteAmenderPoint,
  Point,
  PointNode,
  PointSet,
  PointSetNode,
  PasalUpdateAmenderPoint,
  PasalInsertAmenderPoint,
  PasalVersion,
} from '../../../legal/component';
import assertNever from 'assert-never';
import { flatMap, curry, map } from 'lodash';
import {
  Bab,
  BabNode,
  Bagian,
  BagianNode,
  Paragraf,
  ParagrafNode,
  Pasal,
  Ayat,
  Text,
  AyatSet,
  Reference,
  BabSetNode,
  BabSet,
  BagianSet,
  BagianSetNode,
  ParagrafSet,
  ParagrafSetNode,
  PasalSet,
  PasalSetNode,
  PasalVersionNode,
  AyatSetNode,
  AyatNode,
  TextNode,
} from '../../../legal/component';

import { Document, DocumentNode } from '../../../legal/document';
import { LegalTriple } from './triple';

export function yamlToTriples({ node: _node, babSet }: Document): LegalTriple[] {
  return babSetToTriple(_node, babSet);
}

function babSetToTriple(parentDocumentNode: DocumentNode, babSet: BabSet): LegalTriple[] {
  return [
    [parentDocumentNode, 'documentHasBabSet', babSet.node],
    ...flatMap(babSet.elements, babToTripleWith(babSet.node)),
  ];
}

const babToTripleWith = curry(babToTriple);
function babToTriple(parentBabSetNode: BabSetNode, bab: Bab): LegalTriple[] {
  return [
    [parentBabSetNode, 'babSetHasBab', bab.node],
    [bab.node, 'babHasKey', bab.node.key],
    [bab.node, 'babHasTitle', bab.title],
    ...(bab.content.type === 'bagianSet'
      ? bagianSetToTriple(bab.node, bab.content)
      : pasalSetToTriple(bab.node, bab.content)),
  ];
}

function bagianSetToTriple(parentBabNode: BabNode, bagianSet: BagianSet): LegalTriple[] {
  return [
    [parentBabNode, 'babHasBagianSet', bagianSet.node],
    ...flatMap(bagianSet.elements, bagianToTripleWith(bagianSet.node)),
  ];
}

const bagianToTripleWith = curry(bagianToTriple);
function bagianToTriple(parentBagianSetNode: BagianSetNode, bagian: Bagian): LegalTriple[] {
  return [
    [parentBagianSetNode, 'bagianSetHasBagian', bagian.node],
    [bagian.node, 'bagianHasKey', bagian.node.key],
    [bagian.node, 'bagianHasTitle', bagian.title],
    ...(bagian.content.type === 'paragrafSet'
      ? paragrafSetToTriple(bagian.node, bagian.content)
      : pasalSetToTriple(bagian.node, bagian.content)),
  ];
}

function paragrafSetToTriple(
  parentBagianNode: BagianNode,
  paragrafSet: ParagrafSet
): LegalTriple[] {
  const paragrafSetNode: ParagrafSetNode = { nodeType: 'paragrafSet', parentBagianNode };
  return [
    [parentBagianNode, 'bagianHasParagrafSet', paragrafSetNode],
    ...flatMap(paragrafSet.elements, paragrafToTripleWith(paragrafSetNode)),
  ];
}

const paragrafToTripleWith = curry(paragrafToTriple);
function paragrafToTriple(
  parentParagrafSetNode: ParagrafSetNode,
  paragraf: Paragraf
): LegalTriple[] {
  return [
    [parentParagrafSetNode, 'paragrafSetHasParagraf', paragraf.node],
    [paragraf.node, 'paragrafHasKey', paragraf.node.key],
    [paragraf.node, 'paragrafHasTitle', paragraf.title],
    ...pasalSetToTriple(paragraf.node, paragraf.pasalSet),
  ];
}

function pasalSetToTriple(
  parentNode: BabNode | BagianNode | ParagrafNode,
  pasalSet: PasalSet
): LegalTriple[] {
  const pasalSetNode: PasalSetNode = { nodeType: 'pasalSet', parentNode };
  return [
    _pasalSetToTriple(parentNode, pasalSetNode),
    ...flatMap(pasalSet.elements, pasalToTripleWith(pasalSetNode)),
  ];
}

function _pasalSetToTriple(
  parentNode: BabNode | BagianNode | ParagrafNode,
  pasalSetNode: PasalSetNode
): LegalTriple {
  if (parentNode.nodeType === 'bab') return [parentNode, 'babHasPasalSet', pasalSetNode];
  if (parentNode.nodeType === 'bagian') return [parentNode, 'bagianHasPasalSet', pasalSetNode];
  if (parentNode.nodeType === 'paragraf') return [parentNode, 'paragrafHasPasalSet', pasalSetNode];
  assertNever(parentNode);
}

const pasalToTripleWith = curry(pasalToTriple);
function pasalToTriple(parentPasalSetNode: PasalSetNode, pasal: Pasal): LegalTriple[] {
  return [
    [parentPasalSetNode, 'pasalSetHasPasal', pasal.node],
    [pasal.node, 'pasalHasKey', pasal.node.key],
    [pasal.node, 'pasalHasPasalVersion', pasal.version.node],
    [pasal.version.node, 'pasalVersionHasState', pasal.version.node.state],
    [pasal.version.node, 'pasalVersionHasCreatedTimeEpoch', pasal.version.node.timeCreatedEpoch],
    ...pasalContentToTriple(pasal.version.content),
  ];
}

function pasalContentToTriple(content: PointSet | Text | AyatSet): LegalTriple[] {
  if (content.type === 'pointSet') return pointSetToTriple(content);
  if (content.type === 'ayatSet') return ayatSetToTriple(content);
  if (content.type === 'text') return textToTriple(content);
  assertNever(content);
}

function ayatSetToTriple(ayatSet: AyatSet): LegalTriple[] {
  return [
    [ayatSet.node.parentPasalVersionNode, 'pasalVersionHasAyatSet', ayatSet.node],
    ...flatMap(ayatSet.elements, ayatToTripleWith(ayatSet.node)),
  ];
}

const ayatToTripleWith = curry(ayatToTriple);
function ayatToTriple(parentAyatSetNode: AyatSetNode, ayat: Ayat): LegalTriple[] {
  return [
    [parentAyatSetNode, 'ayatSetHasAyat', ayat.node],
    [ayat.node, 'ayatHasKey', ayat.node.key],
    ...(ayat.content.type === 'pointSet'
      ? pointSetToTriple(ayat.content)
      : textToTriple(ayat.content)),
  ];
}

function pointSetToTriple(pointSet: PointSet): LegalTriple[] {
  return [
    _pointSetToTriple(pointSet.node.parentNode, pointSet.node),
    ...textToTriple(pointSet.description),
    ...flatMap(pointSet.elements, pointToTripleWith(pointSet.node)),
  ];
}

function _pointSetToTriple(
  parentNode: PointNode | AyatNode | PasalVersionNode,
  pointSetNode: PointSetNode
): LegalTriple {
  if (parentNode.nodeType === 'ayat') return [parentNode, 'ayatHasPointSet', pointSetNode];
  if (parentNode.nodeType === 'pasalVersion')
    return [parentNode, 'pasalVersionHasPointSet', pointSetNode];
  if (parentNode.nodeType === 'point') return [parentNode, 'pointHasPointSet', pointSetNode];
  assertNever(parentNode);
}

const pointToTripleWith = curry(pointToTriple);
function pointToTriple(parentPointSetNode: PointSetNode, point: Point): LegalTriple[] {
  return [
    [parentPointSetNode, 'pointSetHasPoint', point.node],
    [point.node, 'pointHasKey', point.node.key],
    ...pointContentToTriple(point.node, point.content),
  ];
}

function pointContentToTriple(
  pointNode: PointNode,
  content:
    | PointSet
    | PasalDeleteAmenderPoint
    | PasalUpdateAmenderPoint
    | PasalInsertAmenderPoint
    | Text
): LegalTriple[] {
  if (content.type === 'pointSet') return pointSetToTriple(content);
  if (content.type === 'pasalDeleteAmenderPoint')
    return [[pointNode, 'pointDeletePasal', content.deletedPasalVersionNode]];
  if (content.type === 'pasalUpdateAmenderPoint')
    return [[pointNode, 'pointUpdatePasal', content.updatedPasalVersion.node]];
  if (content.type === 'pasalInsertAmenderPoint')
    return map(content.insertedPasalVersionArr, pointToAmendInsertTripleWith(pointNode));
  if (content.type === 'text') return textToTriple(content);
  assertNever(content);
}

const pointToAmendInsertTripleWith = curry(pointToAmendInsertTriple);
function pointToAmendInsertTriple(pointNode: PointNode, pasalVersion: PasalVersion): LegalTriple {
  return [pointNode, 'pointInsertPasal', pasalVersion.node];
}

function textToTriple(text: Text): LegalTriple[] {
  return [
    [text.node, 'textHasTextString', text.textString],
    _textToTriple(text.node.parentNode, text.node),
    ...map(text.references, referenceToTripleWith(text.node)),
  ];
}

function _textToTriple(
  parentNode: PointSetNode | PointNode | PasalVersionNode | AyatNode,
  textNode: TextNode
): LegalTriple {
  if (parentNode.nodeType === 'ayat') return [parentNode, 'ayatHasText', textNode];
  if (parentNode.nodeType === 'pasalVersion') return [parentNode, 'pasalVersionHasText', textNode];
  if (parentNode.nodeType === 'point') return [parentNode, 'pointHasText', textNode];
  if (parentNode.nodeType === 'pointSet') return [parentNode, 'pointSetHasDescription', textNode];
  assertNever(parentNode);
}

const referenceToTripleWith = curry(referenceToTriple);
function referenceToTriple(textNode: TextNode, reference: Reference): LegalTriple {
  return [textNode, 'textReferencesLegal', reference.node];
}

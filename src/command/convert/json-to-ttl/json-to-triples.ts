import {
  PasalDeleteAmenderPoint,
  Point,
  PointNode,
  PointSet,
  PointSetNode,
  PasalUpdateAmenderPoint,
  PasalInsertAmenderPoint,
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
    // [pasal.node, 'pasalHasPasalState', pasalStateNode],
    // [pasalStateNode, 'pasalStateHasState', 'exists'],
    ...pasalContentToTriple(pasal.content),
  ];
}

function pasalContentToTriple(content: PointSet | Text | AyatSet): LegalTriple[] {
  if (content.type === 'pointSet') return pointSetToTriple(content);
  if (content.type === 'ayatSet') return ayatSetToTriple(content);
  if (content.type === 'text') return textToTriple('text', content);
  assertNever(content);
}

function ayatSetToTriple(parentPasalStateNode: PasalVersionNode, ayatSet: AyatSet): LegalTriple[] {
  const ayatSetNode: AyatSetNode = {
    nodeType: 'ayatSet',
    parentPasalVersionNode: parentPasalStateNode,
  };
  return [
    [parentPasalStateNode, 'pasalStateHasAyatSet', ayatSetNode],
    ...flatMap(ayatSet.elements, ayatToTripleWith(ayatSetNode)),
  ];
}

const ayatToTripleWith = curry(ayatToTriple);
function ayatToTriple(parentAyatSetNode: AyatSetNode, ayat: Ayat): LegalTriple[] {
  const ayatNode: AyatNode = {
    nodeType: 'ayat',
    key: ayat.key,
    parentAyatSetNode: parentAyatSetNode,
  };
  return [
    [parentAyatSetNode, 'ayatSetHasAyat', ayatNode],
    [ayatNode, 'ayatHasKey', ayat.key],
    ...(ayat.content.type === 'pointSet'
      ? pointSetToTriple(ayatNode, ayat.content)
      : textToTriple(ayatNode, 'text', ayat.content)),
  ];
}

function pointSetToTriple(
  parentNode: PointNode | AyatNode | PasalVersionNode,
  pointSet: PointSet
): LegalTriple[] {
  const pointSetNode: PointSetNode = { nodeType: 'pointSet', parentNode: parentNode };
  return [
    _pointSetToTriple(parentNode, pointSetNode),
    ...textToTriple(parentNode, 'description', pointSet.description),
    ...flatMap(pointSet.elements, pointToTripleWith(pointSetNode)),
  ];
}

function _pointSetToTriple(
  parentNode: PointNode | AyatNode | PasalVersionNode,
  pointSetNode: PointSetNode
): LegalTriple {
  if (parentNode.nodeType === 'ayat') return [parentNode, 'ayatHasPointSet', pointSetNode];
  if (parentNode.nodeType === 'pasalVersion')
    return [parentNode, 'pasalStateHasPointSet', pointSetNode];
  if (parentNode.nodeType === 'point') return [parentNode, 'pointHasPointSet', pointSetNode];
  assertNever(parentNode);
}

const pointToTripleWith = curry(pointToTriple);
function pointToTriple(parentPointSetNode: PointSetNode, point: Point): LegalTriple[] {
  const pointNode: PointNode = {
    key: point.key,
    parentPointSetNode: parentPointSetNode,
    nodeType: 'point',
  };
  return [
    [parentPointSetNode, 'pointSetHasPoint', pointNode],
    ...pointContentToTriple(pointNode, point.content),
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
  if (content.type === 'pointSet') return pointSetToTriple(pointNode, content);
  if (content.type === 'pasalDeleteAmenderPoint')
    return [[pointNode, 'pointDeletePasal', content.deletedPasalVersionNode]];
  if (content.type === 'pasalUpdateAmenderPoint')
    return [[pointNode, 'pointUpdatePasal', content.updatedPasalVersionNode]];
  if (content.type === 'pasalInsertAmenderPoint')
    return map(content.insertedPasalVersionNodeArr, pointToAmendInsertTripleWith(pointNode));
  if (content.type === 'text') return textToTriple(pointNode, 'text', content);
  assertNever(content);
}

const pointToAmendInsertTripleWith = curry(pointToAmendInsertTriple);
function pointToAmendInsertTriple(pointNode: PointNode, point: PasalVersionNode): LegalTriple {
  return [pointNode, 'pointInsertPasal', point];
}

function textToTriple(
  parentNode: PointSetNode | PointNode | PasalVersionNode | AyatNode,
  textName: string,
  text: Text
): LegalTriple[] {
  const textNode: TextNode = { nodeType: 'text', textName, parentNode: parentNode };
  return [
    [textNode, 'textHasTextString', text.textString],
    _textToTriple(parentNode, textNode),
    ...map(text.references, referenceToTripleWith(textNode)),
  ];
}

function _textToTriple(
  parentNode: PointSetNode | PointNode | PasalVersionNode | AyatNode,
  textNode: TextNode
): LegalTriple {
  if (parentNode.nodeType === 'ayat') return [parentNode, 'ayatHasText', textNode];
  if (parentNode.nodeType === 'pasalVersion') return [parentNode, 'pasalStateHasText', textNode];
  if (parentNode.nodeType === 'point') return [parentNode, 'pointHasText', textNode];
  if (parentNode.nodeType === 'pointSet') return [parentNode, 'pointSetHasDescription', textNode];
  assertNever(parentNode);
}

const referenceToTripleWith = curry(referenceToTriple);
function referenceToTriple(textNode: TextNode, reference: Reference): LegalTriple {
  return [textNode, 'textReferencesLegal', reference.node];
}

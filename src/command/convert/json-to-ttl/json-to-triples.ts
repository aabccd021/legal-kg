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
  BabSet,
  BagianSet,
  ParagrafSet,
  ParagrafSetNode,
  PasalSet,
  PasalSetNode,
  PasalVersionNode,
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
    ...flatMap(babSet.elements, babToTriple),
  ];
}

function babToTriple(bab: Bab): LegalTriple[] {
  return [
    [bab.node.parentBabSetNode, 'babSetHasBab', bab.node],
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
    ...flatMap(bagianSet.elements, bagianToTriple),
  ];
}

function bagianToTriple(bagian: Bagian): LegalTriple[] {
  return [
    [bagian.node.parentBagianSetNode, 'bagianSetHasBagian', bagian.node],
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
    ...flatMap(paragrafSet.elements, paragrafToTriple),
  ];
}

function paragrafToTriple(paragraf: Paragraf): LegalTriple[] {
  return [
    [paragraf.node.parentParagrafSetNode, 'paragrafSetHasParagraf', paragraf.node],
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
    [pasal.node.parentNode, 'documentHasPasal', pasal.node],
    ...pasalVersionToTriple(pasal.version),
  ];
}

function pasalVersionToTriple(pasalVersion: PasalVersion): LegalTriple[] {
  return [
    [pasalVersion.node, 'pasalVersionHasState', pasalVersion.node.state],
    [pasalVersion.node, 'pasalVersionHasCreatedTimeEpoch', pasalVersion.node.timeCreatedEpoch],
    ...pasalVersionContentToTriple(pasalVersion.content),
  ];
}

function pasalVersionContentToTriple(content: PointSet | Text | AyatSet): LegalTriple[] {
  if (content.type === 'pointSet') return pointSetToTriple(content);
  if (content.type === 'ayatSet') return ayatSetToTriple(content);
  if (content.type === 'text') return textToTriple(content);
  assertNever(content);
}

function ayatSetToTriple(ayatSet: AyatSet): LegalTriple[] {
  return [
    [ayatSet.node.parentPasalVersionNode, 'pasalVersionHasAyatSet', ayatSet.node],
    ...flatMap(ayatSet.elements, ayatToTriple),
  ];
}

function ayatToTriple(ayat: Ayat): LegalTriple[] {
  return [
    [ayat.node.parentAyatSetNode, 'ayatSetHasAyat', ayat.node],
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
    ...flatMap(pointSet.elements, pointToTriple),
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

function pointToTriple(
  point: Point | PasalDeleteAmenderPoint | PasalUpdateAmenderPoint | PasalInsertAmenderPoint
): LegalTriple[] {
  return [
    [point.node.parentPointSetNode, 'pointSetHasPoint', point.node],
    [point.node, 'pointHasKey', point.node.key],
    ..._pointToTriple(point),
  ];
}

// TODO: origin component relation

function _pointToTriple(
  point: Point | PasalDeleteAmenderPoint | PasalUpdateAmenderPoint | PasalInsertAmenderPoint
): LegalTriple[] {
  if (point.type === 'pasalDeleteAmenderPoint')
    return [
      [point.node, 'pointDeletePasalVersion', point.deletedPasalVersionNode],
      [
        point.deletedPasalVersionNode.parentPasalNode,
        'pasalHasPasalVersion',
        point.deletedPasalVersionNode,
      ],
      [
        point.deletedPasalVersionNode.parentPasalNode.parentNode,
        'documentHasPasal',
        point.deletedPasalVersionNode.parentPasalNode,
      ],
    ];
  if (point.type === 'pasalUpdateAmenderPoint')
    return [
      [point.node, 'pointUpdatePasal', point.updatedPasalVersion.node],
      [
        point.updatedPasalVersion.node.parentPasalNode,
        'pasalHasPasalVersion',
        point.updatedPasalVersion.node,
      ],
      [
        point.updatedPasalVersion.node.parentPasalNode.parentNode,
        'documentHasPasal',
        point.updatedPasalVersion.node.parentPasalNode,
      ],
      ...pasalVersionToTriple(point.updatedPasalVersion),
    ];
  if (point.type === 'pasalInsertAmenderPoint')
    return flatMap(point.insertedPasalVersionArr, pointToAmendInsertTripleWith(point));
  if (point.type === 'point')
    return point.content.type === 'pointSet'
      ? pointSetToTriple(point.content)
      : textToTriple(point.content);
  assertNever(point);
}

const pointToAmendInsertTripleWith = curry(pointToAmendInsertTriple);
function pointToAmendInsertTriple(
  point: PasalInsertAmenderPoint,
  pasalVersion: PasalVersion
): LegalTriple[] {
  return [
    [point.node, 'pointInsertPasalVersion', pasalVersion.node],
    [pasalVersion.node.parentPasalNode, 'pasalHasPasalVersion', pasalVersion.node],
    [
      pasalVersion.node.parentPasalNode.parentNode,
      'documentHasPasal',
      pasalVersion.node.parentPasalNode,
    ],
    ...pasalVersionToTriple(pasalVersion),
  ];
}

// TODO: rawText

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

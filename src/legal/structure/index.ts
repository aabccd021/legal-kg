import assertNever from 'assert-never';
import { AyatNode, _getAyatUri } from './ayat';
import { BabNode, _getBabUri } from './bab';
import { BagianNode, _getBagianUri } from './bagian';
import { _getMetadataUri, MetadataNode } from './metadata';
import { _getParagrafUri, ParagrafNode } from './paragraf';
import { _getPasalUri, PasalNode } from './pasal';
import { _getPointUri, PointNode } from './point';

/**
 * Structure Category
 */
export const STRUCTURE_CATEGORY = [
  'ayat',
  'bab',
  'bagian',
  'metadata',
  'paragraf',
  'pasal',
  'point',
] as const;
export type StructureCategory = typeof STRUCTURE_CATEGORY[number];

/**
 * Structure Node
 */
export type StructureNode = (
  | AyatNode
  | BabNode
  | BagianNode
  | MetadataNode
  | ParagrafNode
  | PasalNode
  | PointNode
) & { _structureType: StructureCategory };

export function _getStructureUri(node: StructureNode): string {
  if (node._structureType === 'ayat') return _getAyatUri(node);
  if (node._structureType === 'bab') return _getBabUri(node);
  if (node._structureType === 'bagian') return _getBagianUri(node);
  if (node._structureType === 'metadata') return _getMetadataUri(node);
  if (node._structureType === 'paragraf') return _getParagrafUri(node);
  if (node._structureType === 'pasal') return _getPasalUri(node);
  if (node._structureType === 'point') return _getPointUri(node);
  assertNever(node);
}

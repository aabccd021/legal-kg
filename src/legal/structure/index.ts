import { AmendedPasalNode, AmenderPointNode } from './amend';
import { Ayat, AyatNode } from './ayat';
import { Bab, BabNode } from './bab';
import { Bagian, BagianNode } from './bagian';
import { MetadataNode } from './metadata';
import { ParagrafNode, Paragraf } from './paragraf';
import { PasalNode, Pasal } from './pasal';
import { PointNode } from './point';

/**
 * Structure Node
 */
export type StructureNode =
  | AyatNode
  | BabNode
  | BagianNode
  | MetadataNode
  | ParagrafNode
  | PasalNode
  | PointNode
  | AmendedPasalNode
  | AmenderPointNode;

export type Structure = Bab | Bagian | Pasal | Paragraf | Ayat;

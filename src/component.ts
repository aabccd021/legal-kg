import { DateNode, LegalNode } from './uri';
import { DocumentNode } from './document';

/**
 * Document Node
 */
export type Document = {
  node: DocumentNode;
  penjelasan?: string[];
  content: BabSet | PasalSet;
  disahkan: Disahkan;
  metadata: DocumentMetadata;
};

export type DocumentMetadata = {
  name?: string;
  pemutus?: string;
  denganPersetujuan?: string;
  tentang?: string;
  salinan?: string;
  memutuskan?: string;
  tempatDitetapkan?: string;
  tanggalDitetapkan?: string;
  tempatDiundangkan?: string;
  tanggalDiundangkan?: string;
  sekretaris?: string;
  dokumen?: string;
  salinanSesuaiDenganAslinya?: string;
  menimbang?: Menimbang;
  mengingat?: Mengingat;
  menetapkan?: string;
};

export type Disahkan = {
  date: DateNode;
  location: string;
  pengesah?: string;
  jabatanPengesah?: string;
};

/**
 * Component Node
 */
export type ComponentNode =
  | AyatNode
  | AyatSetNode
  | BabNode
  | BabSetNode
  | BagianNode
  | BagianSetNode
  | MenimbangNode
  | MengingatNode
  | ParagrafNode
  | ParagrafSetNode
  | PasalNode
  | PasalSetNode
  | PasalVersionNode
  | PointNode
  | PointSetNode
  | SegmentNode;

export type AyatNode = {
  nodeType: 'ayat';
  parentAyatSetNode: AyatSetNode;
  key: number;
};

export type AyatSetNode = {
  nodeType: 'daftarAyat';
  parentPasalVersionNode: PasalVersionNode;
};

export type BabNode = {
  nodeType: 'bab';
  parentBabSetNode: BabSetNode;
  key: number;
};

export type BabSetNode = {
  nodeType: 'babSet';
  parentDocumentNode: DocumentNode;
};

export type BagianSetNode = {
  nodeType: 'daftarBagian';
  parentBabNode: BabNode;
};

export type BagianNode = {
  nodeType: 'bagian';
  parentBagianSetNode: BagianSetNode;
  key: number;
};

export type ParagrafNode = {
  nodeType: 'paragraf';
  parentParagrafSetNode: ParagrafSetNode;
  key: number;
};

export type ParagrafSetNode = {
  nodeType: 'daftarParagraf';
  parentBagianNode: BagianNode;
};

export type PasalSetNode = {
  nodeType: 'daftarPasal';
  parentNode: BabNode | BagianNode | ParagrafNode | DocumentNode;
};

export type PasalNode = {
  nodeType: 'pasal';
  parentNode: DocumentNode;
  key: number | string;
};

export type PasalVersionNode = {
  nodeType: 'versiPasal';
  version: DateNode;
  state: 'orisinal' | 'penyisipan' | 'pengubahan' | 'penghapusan';
  parentPasalNode: PasalNode;
};

export type PointNode = {
  nodeType: 'huruf';
  key: string | number;
  parentPointSetNode: PointSetNode;
};

export type PointSetNode = {
  nodeType: 'daftarHuruf';
  parentNode: PointNode | AyatNode | PasalVersionNode | MenimbangNode | MengingatNode;
};

export type SegmentNode = {
  nodeType: 'segmen';
  textName: string;
  parentNode:
    | PointNode
    | AyatNode
    | PasalVersionNode
    | PointSetNode
    | MenimbangNode
    | MengingatNode;
};

export type MenimbangNode = {
  nodeType: 'menimbang';
  parentNode: DocumentNode;
};

export type MengingatNode = {
  nodeType: 'mengingat';
  parentNode: DocumentNode;
};

export type AmenderDeletePointNode = {
  nodeType: 'amenderDeletePoint';
};
export type AmenderInsertPointNode = {
  nodeType: 'amenderDeletePoint';
};
export type AmenderUpdatePointNode = {
  nodeType: 'amenderDeletePoint';
};

/**
 * Component
 */
export type Component =
  | Ayat
  | AyatSet
  | Bab
  | BabSet
  | Bagian
  | BagianSet
  | Paragraf
  | ParagrafSet
  | Pasal
  | PasalDeleteAmenderPoint
  | PasalInsertAmenderPoint
  | PasalSet
  | PasalUpdateAmenderPoint
  | PasalVersion
  | Point
  | PointSet
  | Text;

export type Ayat = {
  type: 'ayat';
  node: AyatNode;
  content: PointSet | Text;
};

export type AyatSet = {
  type: 'ayatSet';
  node: AyatSetNode;
  elements: Ayat[];
};

export type Bab = {
  type: 'bab';
  title: string;
  node: BabNode;
  content: BagianSet | PasalSet;
};

export type BabSet = {
  type: 'babSet';
  node: BabSetNode;
  elements: Bab[];
};

export type Bagian = {
  type: 'bagian';
  node: BagianNode;
  title: string;
  content: ParagrafSet | PasalSet;
};

export type BagianSet = {
  type: 'daftarBagian';
  node: BagianSetNode;
  elements: Bagian[];
};

export type Paragraf = {
  type: 'paragraf';
  node: ParagrafNode;
  title: string;
  daftarPasal: PasalSet;
};

export type ParagrafSet = {
  type: 'daftarParagraf';
  node: ParagrafSetNode;
  elements: Paragraf[];
};

export type Pasal = {
  type: 'pasal';
  node: PasalNode;
  version: PasalVersion;
};

export type PasalVersion = {
  type: 'pasalVersion';
  node: PasalVersionNode;
  content?: PointSet | Text | AyatSet;
};

export type PasalSet = {
  type: 'daftarPasal';
  node: PasalSetNode;
  elements: Pasal[];
};

export type Point = {
  type: 'point';
  node: PointNode;
  content: PointSet | Text;
};

export type Menimbang = {
  type: 'menimbang';
  node: MenimbangNode;
  content: PointSet | Text;
};

export type Mengingat = {
  type: 'mengingat';
  node: MengingatNode;
  content: PointSet | Text;
};

export type PointSet = {
  type: 'daftarHuruf';
  node: PointSetNode;
  description: Text;
  elements: (Point | PasalDeleteAmenderPoint | PasalUpdateAmenderPoint | PasalInsertAmenderPoint)[];
};

export type Text = {
  type: 'text';
  node: SegmentNode;
  references: Reference[];
  textString: string;
};

export type Reference = {
  start: number;
  end: number;
  node: LegalNode;
};

export type PasalDeleteAmenderPoint = {
  type: 'pasalDeleteAmenderPoint';
  node: PointNode;
  deletedPasalVersion: PasalVersion;
};

export type PasalUpdateAmenderPoint = {
  type: 'pasalUpdateAmenderPoint';
  node: PointNode;
  updatedPasalVersion: PasalVersion;
  description: Text;
};

export type PasalInsertAmenderPoint = {
  type: 'pasalInsertAmenderPoint';
  node: PointNode;
  insertedPasalVersionArr: PasalVersion[];
  description: Text;
};

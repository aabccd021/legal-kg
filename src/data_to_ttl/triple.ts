import {
  AyatNode,
  PasalNode,
  BabNode,
  BagianNode,
  ParagrafNode,
  PointNode,
  SegmentNode,
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
import { LegislationTypeNode } from '../legislation_type';
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
  | [AyatNode, 'nomor', number]
  | [AyatNode, 'daftarHuruf', PointSetNode]
  // raw text?
  | [AyatNode, 'segmen', SegmentNode]
  | [AyatNode, 'teks', string]
  | [AyatSetNode, 'ayat', AyatNode]
  | [BabNode, 'daftarBagian', BagianSetNode]
  | [BabNode, 'nomor', number]
  | [BabNode, 'daftarPasal', PasalSetNode]
  | [BabNode, 'judul', string]
  | [BabSetNode, 'bab', BabNode]
  | [BagianNode, 'nomor', number]
  | [BagianNode, 'daftarParagraf', ParagrafSetNode]
  | [BagianNode, 'daftarPasal', PasalSetNode]
  | [BagianNode, 'judul', string]
  | [BagianSetNode, 'bagian', BagianNode]
  | [DocumentNode, 'daftarBab', BabSetNode]
  | [DocumentNode, 'disahkanPada', DateNode]
  | [DocumentNode, 'disahkanDi', string]
  | [DocumentNode, 'disahkanOleh', string]
  | [DocumentNode, 'jabatanPengesah', string]
  | [DocumentNode, 'pasal', PasalNode]
  | [DocumentNode, 'daftarPasal', PasalSetNode]
  | [DocumentNode, 'mengingat', MengingatNode]
  | [DocumentNode, 'menimbang', MenimbangNode]
  | [DocumentNode, 'tentang', string]
  | [DocumentNode, 'jenisPeraturan', LegislationTypeNode]
  | [DocumentNode, 'yurisdiksi', string]
  | [DocumentNode, 'nomor', number]
  | [DocumentNode, 'tahun', number]
  | [DocumentNode, 'bahasa', string]
  | [MenimbangNode, 'daftarHuruf', PointSetNode]
  | [MenimbangNode, 'segmen', SegmentNode]
  | [MengingatNode, 'daftarHuruf', PointSetNode]
  | [MengingatNode, 'segmen', SegmentNode]
  | [ParagrafNode, 'nomor', number]
  | [ParagrafNode, 'daftarPasal', PasalSetNode]
  | [ParagrafNode, 'judul', string]
  | [ParagrafSetNode, 'paragraf', ParagrafNode]
  | [PasalNode, 'nomor', number | string]
  | [PasalNode, 'versi', PasalVersionNode]
  | [PasalSetNode, 'pasal', PasalNode]
  | [PasalVersionNode, 'daftarAyat', AyatSetNode]
  | [PasalVersionNode, 'daftarHuruf', PointSetNode]
  | [PasalVersionNode, 'jenisVersi', 'orisinal' | 'penyisipan' | 'pengubahan' | 'penghapusan']
  | [PasalVersionNode, 'tanggal', DateNode]
  | [PasalVersionNode, 'segmen', SegmentNode]
  | [PasalVersionNode, 'teks', string]
  | [PointNode, 'nomor', string | number]
  | [PointNode, 'daftarHuruf', PointSetNode]
  | [PointNode, 'segmen', SegmentNode]
  // Represents Amendment
  | [PointNode, 'mengubah' | 'menghapus' | 'menyisipkan', PasalVersionNode]
  | [PointSetNode, 'segmen', SegmentNode]
  | [PointSetNode, 'huruf', PointNode]
  | [SegmentNode, 'teks', string]
  | [SegmentNode, 'merujuk', LegalNode]
) &
  // Nevermind of this, just to make sure Subject is LegalNode, and Object is as defined below.
  [LegalNode, string, string | number | LegalNode | DateNode | LegislationTypeNode];

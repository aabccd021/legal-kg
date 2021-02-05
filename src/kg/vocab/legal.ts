/**
 * Legal Vocab
 */
export type LegalVocab = MetadataVocab | StructureVocab | MiscVocab;

type MiscVocab = 'hasDescription' | 'hasJudul' | 'hasText' | 'hasKey' | 'references';

type StructureVocab = 'hasAyat' | 'hasBab' | 'hasBagian' | 'hasPasal' | 'hasPoint' | 'partOf';

type MetadataVocab =
  | 'denganPersetujuan'
  | 'dokumen'
  | 'jabatanPengesah'
  | 'memutuskan'
  | 'menimbang'
  | 'mengingat'
  | 'namaPengesah'
  | 'name'
  | 'nomor'
  | 'pemutus'
  | 'penjelasan'
  | 'salinan'
  | 'sekretaris'
  | 'tahun'
  | 'tanggalDisahkan'
  | 'tanggalDitetapkan'
  | 'tanggalDiundangkan'
  | 'tempatDisahkan'
  | 'tempatDitetapkan'
  | 'tempatDiundangkan'
  | 'tentang';

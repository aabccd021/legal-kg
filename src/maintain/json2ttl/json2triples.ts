import { flatten, compact, isNil, isArray, isString } from 'lodash';
import { Triple } from './triple';
import {
  LegalDocument,
  Mengimbang,
  Bab,
  isBagians,
  Bagian,
  isParagrafs,
  Paragraf,
  Pasal,
  Points,
  Ayat,
  isAyats,
  Point,
  Reference,
} from '../../type';
import {
  MetadataTrace,
  BabTrace,
  BagianTrace,
  ParagrafTrace,
  PasalParentTrace,
  getPasalParentDocument,
  PasalTrace,
  AyatTrace,
  PointsTrace,
  PointTrace,
} from '../../uri/document-structure';
import { DocumentTrace } from '../../uri/document-type';

export function json2triples({
  _name,
  _nomor,
  _tahun,
  _pemutus,
  _tentang,
  _salinan,
  _memutuskan,
  _tempatDisahkan,
  _tanggalDisahkan,
  _tempatDitetapkan,
  _tanggalDitetapkan,
  _jabatanPengesah,
  _namaPengesah,
  _tempatDiundangkan,
  _tanggalDiundangkan,
  _sekretaris,
  _denganPersetujuan,
  _dokumen,
  _trace,
  penjelasan,
  mengingat,
  menimbang,
  babs,
}: LegalDocument): Triple[] {
  const denganPersetujuanTriple: Triple[] =
    _denganPersetujuan?.map((x) => [_trace, 'denganPersetujuan', x]) ?? [];
  const triples: (Triple | undefined)[] = [
    ...metadata2triple(_trace, 'documentMenimbang', menimbang),
    ...metadata2triple(_trace, 'documentMengingat', mengingat),
    ...flatten(babs?.map((b) => babsToTriple(b, _trace))),
    [_trace, 'penjelasan', penjelasan?.join('\n')],
    [_trace, 'name', _name],
    [_trace, 'nomor', _nomor],
    [_trace, 'tahun', _tahun],
    [_trace, 'pemutus', _pemutus],
    [_trace, 'tentang', _tentang],
    [_trace, 'salinan', _salinan],
    [_trace, 'memutuskan', _memutuskan],
    [_trace, 'tempatDisahkan', _tempatDisahkan],
    [_trace, 'tanggalDisahkan', _tanggalDisahkan],
    [_trace, 'tempatDitetapkan', _tempatDitetapkan],
    [_trace, 'tanggalDitetapkan', _tanggalDitetapkan],
    [_trace, 'jabatanPengesah', _jabatanPengesah],
    [_trace, 'namaPengesah', _namaPengesah],
    [_trace, 'tempatDiundangkan', _tempatDiundangkan],
    [_trace, 'tanggalDiundangkan', _tanggalDiundangkan],
    [_trace, 'sekretaris', _sekretaris],
    [_trace, 'dokumen', _dokumen],
    ...denganPersetujuanTriple,
  ];

  return compact(triples);
}

function metadata2triple(
  parentDocument: DocumentTrace,
  metadataType: 'documentMengingat' | 'documentMenimbang',
  mengimbang?: Mengimbang
): Triple[] {
  if (isNil(mengimbang)) return [];
  const metadata: MetadataTrace = { metadataType, parentDocument, _structureType: 'metadata' };
  const { points, text } = mengimbang;
  const isiTriples: Triple[] = isNil(points)
    ? [[metadata, 'hasText', text.text]]
    : points2Triple(metadata, points);

  return [...isiTriples, [parentDocument, 'hasMetadata', metadata]];
}

function babsToTriple(bab: Bab, parentDocument: DocumentTrace): Triple[] {
  const { _key, _judul, text, isi } = bab;
  const babTrace: BabTrace = { _key, parentDocument, _structureType: 'bab' };
  const isiTraces = isBagians(isi)
    ? isi.flatMap((b) => bagianToTriple(b, babTrace))
    : isi.flatMap((p) => pasalToTriple(p, babTrace));

  return [
    [parentDocument, 'hasBab', babTrace],
    [babTrace, 'hasKey', _key],
    [babTrace, 'hasJudul', _judul],
    [babTrace, 'hasText', text],
    ...isiTraces,
  ];
}

function bagianToTriple(bagian: Bagian, parentBab: BabTrace): Triple[] {
  const { _key, isi, text } = bagian;
  const bagianTrace: BagianTrace = { _key, parentBab, _structureType: 'bagian' };
  const isiTraces = isParagrafs(isi)
    ? isi.flatMap((p) => paragrafToTriple(p, bagianTrace))
    : isi.flatMap((p) => pasalToTriple(p, parentBab));

  return [
    [parentBab, 'hasBagian', bagianTrace],
    [bagianTrace, 'hasKey', _key],
    [bagianTrace, 'hasText', text],
    ...isiTraces,
  ];
}

function paragrafToTriple(paragraf: Paragraf, parentBagian: BagianTrace): Triple[] {
  const { _key, isi, text } = paragraf;
  const paragrafTrace: ParagrafTrace = { _key, parentBagian, _structureType: 'paragraf' };

  return [
    [parentBagian, 'hasParagraf', paragrafTrace],
    [paragrafTrace, 'hasKey', _key],
    [paragrafTrace, 'hasText', text],
    ...isi.flatMap((p) => pasalToTriple(p, paragrafTrace)),
  ];
}

function pasalToTriple(pasal: Pasal, parent: PasalParentTrace): Triple[] {
  const { _key, isi, text } = pasal;
  const parentDocument = getPasalParentDocument(parent);
  const pasalTrace: PasalTrace = { _key, parentDocument, _structureType: 'pasal' };

  return [
    [parent, 'hasPasal', pasalTrace],
    [pasalTrace, 'hasKey', _key],
    [pasalTrace, 'hasText', text.text],
    ...referencesToTriple(pasalTrace, text.references),
    ...pasalContentToTriple(pasalTrace, isi),
  ];
}

function pasalContentToTriple(
  pasalTrace: PasalTrace,
  content: string | Points | Ayat[] | undefined
): Triple[] {
  if (isNil(content)) return [];
  if (isString(content)) return [];
  if (isArray(content) && isAyats(content)) {
    return content.flatMap((a) => ayatToTriple(a, pasalTrace));
  }
  return points2Triple(pasalTrace, content);
}

function ayatToTriple(ayat: Ayat, parentPasal: PasalTrace): Triple[] {
  const { _key, text, isi } = ayat;
  const ayatTrace: AyatTrace = { _key, parentPasal, _structureType: 'ayat' };

  return [
    [parentPasal, 'hasAyat', ayatTrace],
    [ayatTrace, 'hasKey', _key],
    [ayatTrace, 'hasText', text.text],
    ...referencesToTriple(ayatTrace, text.references),
    ...points2Triple(ayatTrace, isi),
  ];
}
function points2Triple(pointsTrace: PointsTrace, points: Points | undefined): Triple[] {
  if (isNil(points)) return [];
  const { _description, text, isi } = points;

  return [
    [pointsTrace, 'hasDescription', _description.text],
    [pointsTrace, 'hasText', text],
    ...referencesToTriple(pointsTrace, _description.references),
    ...isi.flatMap((i) => pointToTriple(pointsTrace, i)),
  ];
}

function pointToTriple(pointsTrace: PointsTrace, point: Point): Triple[] {
  const { _key, isi, text } = point;
  const pointTrace: PointTrace = { _key, parentPoints: pointsTrace, _structureType: 'point' };
  const isiTriples: Triple[] = isNil(isi)
    ? [[pointTrace, 'hasText', text.text]]
    : points2Triple(pointTrace, isi);

  return [
    [pointsTrace, 'hasPoint', pointTrace],
    [pointTrace, 'hasKey', _key],
    ...referencesToTriple(pointTrace, text.references),
    ...isiTriples,
  ];
}

function referencesToTriple(parent: PointsTrace, references: Reference[]): Triple[] {
  return references.map(({ trace }) => [parent, 'references', trace]);
}

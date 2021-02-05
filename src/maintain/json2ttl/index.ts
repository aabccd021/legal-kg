import { flatten, compact, isNil, isArray, isString } from 'lodash';
import { triples2Ttl } from '../../kg/utils';
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
  PasalTrace,
  AyatTrace,
  PointTrace,
  PointsTrace,
} from '../../uri/document-structure';
import { DocumentTrace } from '../../uri/document-type';
import { DataDir, getLegalData, getDocFilePath } from '../utils';
import * as fs from 'fs';
import { Triple } from '../../kg/triple';

function json2ttl(): void {
  const legalDir = 'maintained_legals';
  const jsonDir: DataDir = { legalDir, dataType: 'json' };
  const ttlDir: DataDir = { legalDir, dataType: 'ttl' };

  const legals = getLegalData(jsonDir);
  legals.forEach((legal) => {
    const jsonPath = getDocFilePath(legal, jsonDir);
    const ttlPath = getDocFilePath(legal, ttlDir);

    const jsonString = fs.readFileSync(jsonPath).toString();
    const json = JSON.parse(jsonString) as LegalDocument;
    const triples = json2triples(json);
    const ttl = triples2Ttl(triples);

    fs.writeFileSync(ttlPath, ttl);

    console.log(`Finished json2ttl ${ttlPath}`);
  });
}

function json2triples({
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
  parentDoc: DocumentTrace,
  metadataType: 'documentMengingat' | 'documentMenimbang',
  mengimbang?: Mengimbang
): Triple[] {
  if (isNil(mengimbang)) return [];
  const metadata: MetadataTrace = { ...parentDoc, metadataType, _metadataTrace: true };
  const { points, text } = mengimbang;
  const isiTriples: Triple[] = isNil(points)
    ? [[metadata, 'hasText', text.text]]
    : points2Triple(metadata, points, metadata);

  return [...isiTriples, [parentDoc, 'hasMetadata', metadata]];
}

function babsToTriple(bab: Bab, parentDoc: DocumentTrace): Triple[] {
  const { _key, _judul, text, isi } = bab;
  const trace = { ...parentDoc, bab: _key };
  const isiTraces = isBagians(isi)
    ? isi.flatMap((b) => bagianToTriple(b, trace))
    : isi.flatMap((p) => pasalToTriple(p, babTrace, trace));

  return [
    [parentTrace, 'hasBab', babTrace],
    [babTrace, 'hasKey', _key],
    [babTrace, 'hasJudul', _judul],
    [babTrace, 'hasText', text],
    ...isiTraces,
  ];
}

function bagianToTriple(bagian: Bagian, babTrace: BabTrace): Triple[] {
  const { _key, isi, text } = bagian;
  const trace = { ...babTrace, bagian: _key };
  const bagianTrace: BagianTrace = { TraceType: 'bagian', trace };
  const parentBabTrace: BabTrace = { TraceType: 'bab', trace };
  const isiTraces = isParagrafs(isi)
    ? isi.flatMap((p) => paragrafToTriple(p, trace))
    : isi.flatMap((p) => pasalToTriple(p, bagianTrace, trace));

  return [
    [parentBabTrace, 'hasBagian', bagianTrace],
    [bagianTrace, 'hasKey', _key],
    [bagianTrace, 'hasText', text],
    ...isiTraces,
  ];
}

function paragrafToTriple(paragraf: Paragraf, bagianTrace: BagianTrace): Triple[] {
  const { _key, isi, text } = paragraf;
  const trace = { ...bagianTrace, paragraf: _key };
  const parent: BagianTrace = { TraceType: 'bagian', trace };
  const paragrafTrace: ParagrafTrace = { TraceType: 'paragraf', trace };

  return [
    [parent, 'hasParagraf', paragrafTrace],
    [paragrafTrace, 'hasKey', _key],
    [paragrafTrace, 'hasText', text],
    ...isi.flatMap((p) => pasalToTriple(p, paragrafTrace, trace)),
  ];
}

function pasalToTriple(
  pasal: Pasal,
  parent: PasalParentTrace,
  legalTrace: DocumentTrace
): Triple[] {
  const { _key, isi, text } = pasal;
  const trace: PasalTrace = { ...legalTrace, pasal: _key, _pasalTraceType: true };
  const pasalTrace: PasalTrace = { TraceType: 'pasal', trace };

  return [
    [parent, 'hasPasal', pasalTrace],
    [pasalTrace, 'hasKey', _key],
    [pasalTrace, 'hasText', text.text],
    ...referencesToTriple(pasalTrace, text.references),
    ...pasalContentToTriple(pasalTrace, isi, trace),
  ];
}

function pasalContentToTriple(
  pasalTrace: PasalTrace,
  content: string | Points | Ayat[] | undefined,
  trace: PasalTrace
): Triple[] {
  if (isNil(content)) return [];

  if (isArray(content) && isAyats(content)) {
    return content.flatMap((a) => ayatToTriple(a, trace));
  }
  if (isString(content)) return [];

  return points2Triple(pasalTrace, content, trace);
}

function ayatToTriple(ayat: Ayat, pasalTrace: PasalTrace): Triple[] {
  const { _key, text, isi } = ayat;
  const trace: AyatTrace = { ...pasalTrace, ayat: _key, _ayatTraceType: true };
  const ayatTrace: AyatTrace = { TraceType: 'ayat', trace };
  const parentPasalTrace: PasalTrace = { TraceType: 'pasal', trace };

  return [
    [parentPasalTrace, 'hasAyat', ayatTrace],
    [ayatTrace, 'hasKey', _key],
    [ayatTrace, 'hasText', text.text],
    ...referencesToTriple(ayatTrace, text.references),
    ...points2Triple(ayatTrace, isi, trace),
  ];
}
function points2Triple(
  pointsTrace: PointsTrace,
  points: Points | undefined,
  trace: PointsTrace
): Triple[] {
  if (isNil(points)) return [];
  const { _description, text, isi } = points;

  return [
    [pointsTrace, 'hasDescription', _description.text],
    [pointsTrace, 'hasText', text],
    ...referencesToTriple(pointsTrace, _description.references),
    ...isi.flatMap((i) => pointToTriple(pointsTrace, i, trace)),
  ];
}

function pointToTriple(pointsTrace: PointsTrace, point: Point, parentTrace: PointsTrace): Triple[] {
  const { _key, isi, text } = point;
  const trace: PointTrace = { _pointTraceType: true, point: _key, parent: parentTrace };
  const pointTrace: PointTrace = { TraceType: 'point', trace };
  const isiTriples: Triple[] = isNil(isi)
    ? [[pointTrace, 'hasText', text.text]]
    : points2Triple(pointTrace, isi, trace);

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

json2ttl();

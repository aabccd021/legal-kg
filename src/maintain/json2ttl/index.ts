import { LegalTrace } from '../../uri/legal-type';
import _, { flatten, isNil, isArray, isString, compact } from 'lodash';
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
  SpecialDocTrace,
  getSpecialDocUri,
  getBabUri,
  BabTrace,
  getBagianUri,
  BagianTrace,
  getParagrafUri,
  PasalTrace,
  getPasalUri,
  AyatTrace,
  getAyatUri,
  PointParent,
  PointTrace,
  getPointUri,
} from '../../uri/document-content';
import { getLegalUri } from '../../uri/legal-type';
import * as fs from 'fs';
import { DataDir, getLegalData, getDocFilePath } from '../utils';
import { onto, Triple, triples2Ttl } from '../../kg/utils';
import { rdf } from '../../kg/vocab/external';
import { DataFactory, NamedNode } from 'n3';
const { namedNode } = DataFactory;

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
  _legalTrace: _docTrace,
  penjelasan,
  mengingat,
  menimbang,
  babs,
}: LegalDocument): Triple[] {
  const docUri = getLegalUri(_docTrace);
  const docNode = namedNode(docUri);
  const denganPersetujuanTriple: Triple[] =
    _denganPersetujuan?.map((x) => [docNode, 'denganPersetujuan', x]) ?? [];
  const triples: (Triple | undefined)[] = [
    ...mengimbang2Triple(_docTrace, 'menimbang', menimbang),
    ...mengimbang2Triple(_docTrace, 'mengingat', mengingat),
    ...flatten(babs?.map((b) => babsToTriple(b, _docTrace))),
    [docNode, rdf.type, onto('Document')],
    [docNode, 'penjelasan', penjelasan?.join('\n')],
    [docNode, 'name', _name],
    [docNode, 'nomor', _nomor],
    [docNode, 'tahun', _tahun],
    [docNode, 'pemutus', _pemutus],
    [docNode, 'tentang', _tentang],
    [docNode, 'salinan', _salinan],
    [docNode, 'memutuskan', _memutuskan],
    [docNode, 'tempatDisahkan', _tempatDisahkan],
    [docNode, 'tanggalDisahkan', _tanggalDisahkan],
    [docNode, 'tempatDitetapkan', _tempatDitetapkan],
    [docNode, 'tanggalDitetapkan', _tanggalDitetapkan],
    [docNode, 'jabatanPengesah', _jabatanPengesah],
    [docNode, 'namaPengesah', _namaPengesah],
    [docNode, 'tempatDiundangkan', _tempatDiundangkan],
    [docNode, 'tanggalDiundangkan', _tanggalDiundangkan],
    [docNode, 'sekretaris', _sekretaris],
    [docNode, 'dokumen', _dokumen],
    ...denganPersetujuanTriple,
  ];

  return compact(triples);
}

function mengimbang2Triple(
  parentTrace: LegalTrace,
  attrType: 'menimbang' | 'mengingat',
  mengimbang?: Mengimbang
): Triple[] {
  if (isNil(mengimbang)) return [];
  const trace: SpecialDocTrace = { ...parentTrace, attrType, _specialTraceType: true };
  const uri = getSpecialDocUri(trace);
  const docNode = namedNode(getLegalUri(parentTrace));
  const node = namedNode(uri);
  const { points, text } = mengimbang;
  const isiTriples: Triple[] = isNil(points)
    ? [[node, attrType, text.text]]
    : points2Triple(node, points, trace);

  return [...isiTriples, [docNode, attrType, node], [node, rdf.type, onto(`${attrType}Document`)]];
}

function babsToTriple(bab: Bab, legalTrace: LegalTrace): Triple[] {
  const { _key, _judul, text, isi } = bab;
  const trace = { ...legalTrace, bab: _key };
  const docNode = namedNode(getLegalUri(trace));
  const babNode = namedNode(getBabUri(trace));
  const isiNodes = isBagians(isi)
    ? isi.flatMap((b) => bagianToTriple(b, babNode, trace))
    : isi.flatMap((p) => pasalToTriple(p, babNode, trace));

  return [
    [docNode, 'hasBab', babNode],
    [babNode, 'partOf', docNode],
    [babNode, rdf.type, onto('Bab')],
    [babNode, 'hasKey', _key],
    [babNode, 'hasJudul', _judul],
    [babNode, 'hasText', text],
    ...isiNodes,
  ];
}

function bagianToTriple(bagian: Bagian, parent: NamedNode, babTrace: BabTrace): Triple[] {
  const { _key, isi, text } = bagian;
  const trace = { ...babTrace, bagian: _key };
  const bagianNode = namedNode(getBagianUri(trace));
  const isiNodes = isParagrafs(isi)
    ? isi.flatMap((p) => paragrafToTriple(p, bagianNode, trace))
    : isi.flatMap((p) => pasalToTriple(p, bagianNode, trace));

  return [
    [parent, 'hasBagian', bagianNode],
    [bagianNode, 'partOf', parent],
    [bagianNode, 'hasKey', _key],
    [bagianNode, 'hasText', text],
    [bagianNode, rdf.type, onto('Bagian')],
    ...isiNodes,
  ];
}

function paragrafToTriple(
  paragraf: Paragraf,
  parent: NamedNode,
  bagianTrace: BagianTrace
): Triple[] {
  const { _key, isi, text } = paragraf;
  const trace = { ...bagianTrace, paragraf: _key };
  const paragrafNode = namedNode(getParagrafUri(trace));

  return [
    [parent, 'hasBagian', paragrafNode],
    [paragrafNode, 'partOf', parent],
    [paragrafNode, 'hasKey', _key],
    [paragrafNode, 'hasText', text],
    [paragrafNode, rdf.type, onto('Paragraf')],
    ...isi.flatMap((p) => pasalToTriple(p, paragrafNode, trace)),
  ];
}

function pasalToTriple(pasal: Pasal, parent: NamedNode, legalTrace: LegalTrace): Triple[] {
  const { _key, isi, text } = pasal;
  const trace: PasalTrace = { ...legalTrace, pasal: _key, _pasalTraceType: true };
  const pasalNode = namedNode(getPasalUri(trace));

  return [
    [parent, 'hasPasal', pasalNode],
    [pasalNode, 'partOf', parent],
    [pasalNode, 'hasKey', _key],
    [pasalNode, 'hasText', text.text],
    [pasalNode, rdf.type, onto('Pasal')],
    ...referencesToTriple(pasalNode, text.references),
    ...pasalContentToTriple(pasalNode, isi, trace),
  ];
}

function pasalContentToTriple(
  pasalNode: NamedNode,
  content: string | Points | Ayat[] | undefined,
  trace: PasalTrace
): Triple[] {
  if (isNil(content)) return [];

  if (isArray(content) && isAyats(content)) {
    return content.flatMap((a) => ayatToTriple(pasalNode, a, trace));
  }
  if (isString(content)) return [];

  return points2Triple(pasalNode, content, trace);
}

function ayatToTriple(parent: NamedNode, ayat: Ayat, pasalTrace: PasalTrace): Triple[] {
  const { _key, text, isi } = ayat;
  const trace: AyatTrace = { ...pasalTrace, ayat: _key, _ayatTraceType: true };
  const ayatNode = namedNode(getAyatUri(trace));

  return [
    [parent, 'hasAyat', ayatNode],
    [ayatNode, 'partOf', parent],
    [ayatNode, 'hasKey', _key],
    [ayatNode, 'hasText', text.text],
    ...referencesToTriple(ayatNode, text.references),
    [ayatNode, rdf.type, onto('ayat')],
    ...points2Triple(ayatNode, isi, trace),
  ];
}

function points2Triple(
  parent: NamedNode,
  points: Points | undefined,
  trace: PointParent
): Triple[] {
  if (isNil(points)) return [];
  const { _description, text, isi } = points;

  return [
    [parent, rdf.type, onto('Points')],
    [parent, 'hasDescription', _description.text],
    [parent, 'hasText', text],
    ...referencesToTriple(parent, _description.references),
    ..._(isi)
      .flatMap((i) => pointToTriple(parent, i, trace))
      .value(),
  ];
}

function pointToTriple(parent: NamedNode, point: Point, parentTrace: PointParent): Triple[] {
  const { _key, isi, text } = point;
  const trace: PointTrace = { _pointTraceType: true, point: _key, parent: parentTrace };
  const pointNode = namedNode(getPointUri(trace));
  const isiTriples: Triple[] = isNil(isi)
    ? [[pointNode, 'hasText', text.text]]
    : points2Triple(pointNode, isi, trace);

  return [
    [parent, 'hasPoint', pointNode],
    [pointNode, 'partOf', parent],
    [pointNode, rdf.type, onto('Point')],
    [pointNode, 'hasKey', _key],
    ...referencesToTriple(pointNode, text.references),
    ...isiTriples,
  ];
}

function referencesToTriple(parent: NamedNode, references: Reference[]): Triple[] {
  return references.map(({ uri }) => [parent, 'references', namedNode(uri)]);
}

json2ttl();

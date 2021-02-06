import { chain, isNil, isNumber, isString, toPairs } from 'lodash';
import * as n3 from 'n3';
import { isExternalVocab, rdf, xsdPrefix } from './vocab/external';
import { Triple, TripleCompact } from './triple';
import { getLegalUri, LegalTrace } from '../uri';

const { triple, namedNode, literal } = n3.DataFactory;

export const baseUri = 'http://example.org/legal/';

export function triples2Ttl(triples: Triple[]): string {
  const ontoBase = onto('');
  const prefixes = { legal: ontoBase.value, xsd: xsdPrefix };
  const nonNilTriple = chain(triples).map(toNonNilTriple).compact().value();
  const quads = nonNilTriple.flatMap(tripleToQuad);
  const ttlStr = new n3.Writer({ prefixes }).quadsToString(quads);
  const processedTtlStr = ttlStr.replaceAll(`<${rdf.type}>`, 'a');
  const prefixStr = toPairs(prefixes)
    .map(([short, prefix]) => `@prefix ${short}: <${prefix}> .`)
    .join('\n');

  return `${prefixStr}\n\n${processedTtlStr}`;
}
function toNonNilTriple([s, p, o]: Triple): TripleCompact | undefined {
  if (isNil(o)) return undefined;
  return [s, p, o];
}
function tripleToQuad([subject, predicate, object]: TripleCompact): n3.Quad[] {
  const _subject = node(subject);
  const _predicate = isExternalVocab(predicate) ? namedNode(predicate) : onto(predicate);
  const _object = isString(object) || isNumber(object) ? literal(object) : node(object);
  return [triple(_subject, _predicate, _object)];
}
function onto(string: string): n3.NamedNode<string> {
  return namedNode(`${baseUri}ontology/${string}`);
}
function node(trace: LegalTrace): n3.NamedNode<string> {
  const uri = getLegalUri(trace);
  return namedNode(uri);
}
// function getLegalClass(trace: LegalTrace): string {
//   if (isPointTrace(trace)) return 'Point';
//   if (isAyatTrace(trace)) return 'Ayat';
//   if (isPasalTrace(trace)) return 'Pasal';
//   if (isMetadataTrace(trace)) return 'Metadata';
//   if (isParagrafTrace(trace)) return 'Paragraf';
//   if (isBagianTrace(trace)) return 'Bagian';
//   if (isBabTrace(trace)) return 'Bab';
//   return 'Document';
// }

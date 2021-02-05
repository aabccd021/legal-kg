import { LegalVocab } from './vocab/legal';
import { compact, isNil, isNumber, isString, toPairs } from 'lodash';
import * as n3 from 'n3';
import { ExternalVocab, isExternalVocab, rdf, xsdPrefix } from './vocab/external';
import { Triple } from './triple';
const { triple, namedNode, literal } = n3.DataFactory;

export const baseUri = 'http://example.org/legal/';

export function triples2Ttl(triples: Triple[]): string {
  const ontoBase = onto('');
  const prefixes = { legal: ontoBase.value, xsd: xsdPrefix };
  const quads = compact(triples.map(tripleToQuad));
  const ttlStr = new n3.Writer({ prefixes }).quadsToString(quads);
  const processedTtlStr = ttlStr.replaceAll(`<${rdf.type}>`, 'a');
  const prefixStr = toPairs(prefixes)
    .map(([short, prefix]) => `@prefix ${short}: <${prefix}> .`)
    .join('\n');

  return `${prefixStr}\n\n${processedTtlStr}`;
}
function tripleToQuad([subject, predicate, object]: Triple): n3.Quad | undefined {
  if (isNil(object)) return undefined;
  const _predicate = isExternalVocab(predicate) ? namedNode(predicate) : onto(predicate);
  const _object = isString(object) || isNumber(object) ? literal(object) : object;
  return triple(onto(subject), _predicate, _object);
}
function onto(string: string): n3.NamedNode<string> {
  return namedNode(`${baseUri}ontology/${string}`);
}

type Vocab = LegalVocab | ExternalVocab;

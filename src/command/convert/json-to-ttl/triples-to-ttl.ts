import { isNil, isNumber, isString, toPairs, compact, upperFirst } from 'lodash';
import * as n3 from 'n3';
import { LegalTriple } from './triple';
import _ from 'lodash';
import { LegalNode, getOntologyBaseUri, nodeToUri } from '../../../legal';

const { triple, namedNode, literal } = n3.DataFactory;

/**
 * Vocab
 */
const rdfType = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';

/**
 * Node
 */
function node(node: LegalNode): n3.NamedNode<string> {
  const uri = nodeToUri(node);
  return namedNode(uri);
}
function onto(predicate: string): n3.NamedNode<string> {
  const ontologyBaseUri = getOntologyBaseUri();
  return namedNode(`${ontologyBaseUri}/${predicate}`);
}

/**
 * triples2ttl
 */
export function triplesToTtl(triples: LegalTriple[]): string {
  const ontologyBaseUri = getOntologyBaseUri();
  const prefixes = { legal: `${ontologyBaseUri}/` };

  const coreQuads = triples.map(tripleToQuad);
  const classTypeQuads = getClassTypeQuads(triples);
  const alternativeVocabQuads = getAlternativeVocabQuads(triples);

  const allQuads: n3.Quad[] = compact([...coreQuads, ...classTypeQuads, ...alternativeVocabQuads]);

  const ttlStr = new n3.Writer({ prefixes }).quadsToString(allQuads);
  const processedTtlStr = ttlStr.replaceAll(`<${rdfType}>`, 'a');
  const prefixStr = toPairs(prefixes)
    .map(([short, prefix]) => `@prefix ${short}: <${prefix}> .`)
    .join('\n');

  return `${prefixStr}\n\n${processedTtlStr}`;
}

function tripleToQuad([subject, predicate, object]: LegalTriple): n3.Quad | undefined {
  if (isNil(object)) return undefined;
  const _subject = node(subject);
  const _predicate = onto(predicate);
  const _object = isString(object) || isNumber(object) ? literal(object) : node(object);
  return triple(_subject, _predicate, _object);
}

/**
 * Node Classes
 */
function getClassTypeQuads(triples: LegalTriple[]): n3.Quad[] {
  return _(triples)
    .map(([s]) => s)
    .uniq()
    .map((x) => triple(node(x), namedNode(rdfType), onto(upperFirst(x.nodeType))))
    .value();
}

/**
 * PartOf
 */
function getAlternativeVocabQuads(triples: LegalTriple[]): n3.Quad[] {
  return _(triples)
    .map(([_s, _p, o]) => {
      if (isNil(o) || isString(o) || isNumber(o)) return undefined;
      // if (
      // p === 'ayatHasPoint' ||
      // p === 'babHasBagian' ||
      // p === 'babHasPasal' ||
      // p === 'bagianHasParagraf' ||
      // p === 'bagianHasPasal' ||
      // p === 'documentHasBab' ||
      // p === 'paragrafHasPasal' ||
      // p === 'pasalHasAyat' ||
      // p === 'pasalHasPoint' ||
      // p === 'pointHasPoint'
      // ) {
      // return triple(node(o), onto('partOf'), node(s));
      // }
      return undefined;
    })
    .compact()
    .value();
}

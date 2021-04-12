import { isNil, isNumber, isString, toPairs, compact, upperFirst, chain } from 'lodash';
import * as n3 from 'n3';
import { LegalTriple } from './triple';
import _ from 'lodash';
import {
  LegalNode,
  getOntologyBaseUri,
  nodeToUri,
  DateNode,
  padStartIfNumber,
} from '../../../legal';

const { triple, namedNode, literal } = n3.DataFactory;

/**
 * Vocab
 */
const rdfType = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';

/**
 * Node
 */
function legalNodeToN3(node: LegalNode): n3.NamedNode<string> {
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
  const prefixes = { legal: `${ontologyBaseUri}/`, xsd: 'http://www.w3.org/2001/XMLSchema#' };

  const coreQuads = triples.map(tripleToQuad);
  const classTypeQuads = getClassTypeQuads(triples);
  const alternativeVocabQuads = getAlternativeVocabQuads(triples);

  const allQuads: n3.Quad[] = compact([...coreQuads, ...classTypeQuads, ...alternativeVocabQuads]);
  console.log(`${allQuads.length} triples generated`);

  const ttlStr = new n3.Writer({ prefixes }).quadsToString(allQuads);
  const processedTtlStr = chain(
    ttlStr.replaceAll(`<${rdfType}>`, 'a').replaceAll('"@date .', '"^^xsd:date .').split('\n')
  )
    .uniq()
    .join('\n')
    .value();
  const prefixStr = toPairs(prefixes)
    .map(([short, prefix]) => `@prefix ${short}: <${prefix}> .`)
    .join('\n');

  return `${prefixStr}\n\n${processedTtlStr}`;
}

function tripleToQuad([subject, predicate, object]: LegalTriple): n3.Quad | undefined {
  if (isNil(object)) return undefined;
  const _subject = legalNodeToN3(subject);
  const _predicate = onto(predicate);
  const _object = objectToN3Node(object);
  return triple(_subject, _predicate, _object);
}

function objectToN3Node(o: string | number | LegalNode | DateNode): n3.Literal | n3.NamedNode {
  if (isString(o) || isNumber(o)) return literal(o);
  if (o.nodeType === 'date') {
    const yearStr = padStartIfNumber(o.year, { pad: 4 });
    const monthStr = padStartIfNumber(o.month, { pad: 2 });
    const dateStr = padStartIfNumber(o.date, { pad: 2 });
    return literal(`${yearStr}-${monthStr}-${dateStr}`, 'date');
  }
  return legalNodeToN3(o);
}

/**
 * Node Classes
 */
function getClassTypeQuads(triples: LegalTriple[]): n3.Quad[] {
  return _(triples)
    .map(([s]) => s)
    .uniq()
    .map((x) => triple(legalNodeToN3(x), namedNode(rdfType), onto(upperFirst(x.nodeType))))
    .value();
}

/**
 * PartOf
 */
function getAlternativeVocabQuads(triples: LegalTriple[]): n3.Quad[] {
  return _(triples)
    .map(([s, p, o]) => {
      if (isNil(o) || isString(o) || isNumber(o) || o.nodeType === 'date') return undefined;
      if (
        p === 'ayatHasPointSet' ||
        p === 'ayatHasText' ||
        p === 'ayatSetHasAyat' ||
        p === 'babHasBagianSet' ||
        p === 'babHasPasalSet' ||
        p === 'babSetHasBab' ||
        p === 'bagianHasParagrafSet' ||
        p === 'bagianHasPasalSet' ||
        p === 'bagianSetHasBagian' ||
        p === 'documentHasBabSet' ||
        p === 'documentHasPasal' ||
        p === 'paragrafHasPasalSet' ||
        p === 'paragrafSetHasParagraf' ||
        p === 'pasalHasPasalVersion' ||
        p === 'pointHasPointSet' ||
        p === 'pasalSetHasPasal' ||
        p === 'pointSetHasPoint' ||
        p === 'pasalVersionHasPointSet' ||
        p === 'pasalVersionHasAyatSet'
      ) {
        return triple(legalNodeToN3(o), onto('partOf'), legalNodeToN3(s));
      }
      return undefined;
    })
    .compact()
    .value();
}

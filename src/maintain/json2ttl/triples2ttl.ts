import { assertNever } from 'assert-never';
import { isNil, isNumber, isString, toPairs, compact } from 'lodash';
import * as n3 from 'n3';
import { Triple } from './triple';
import _ from 'lodash';
import { LegalTrace, getLegalUri } from '../../uri';
import { isDocumentTrace } from '../../uri/document-type';

const { triple, namedNode, literal } = n3.DataFactory;

export const baseUri = 'http://example.org/legal/';

/**
 * Vocab
 */
const rdfType = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' as const;
const ontoBase = `${baseUri}ontology/`;

/**
 * Node
 */
function node(trace: LegalTrace): n3.NamedNode<string> {
  const uri = getLegalUri(trace);
  return namedNode(uri);
}
function onto(predicate: string): n3.NamedNode<string> {
  return namedNode(`${ontoBase}${predicate}`);
}

/**
 * triples2ttl
 */
export function triples2Ttl(triples: Triple[]): string {
  const prefixes = { legal: ontoBase };

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

function tripleToQuad([subject, predicate, object]: Triple): n3.Quad | undefined {
  if (isNil(object)) return undefined;
  const _subject = node(subject);
  const _predicate = onto(predicate);
  const _object = isString(object) || isNumber(object) ? literal(object) : node(object);
  return triple(_subject, _predicate, _object);
}

/**
 * Node Classes
 */
function getClassTypeQuads(triples: Triple[]): n3.Quad[] {
  return _(triples)
    .map(([s]) => s)
    .uniq()
    .map((x) => triple(node(x), namedNode(rdfType), onto(getLegalClass(x))))
    .value();
}
type LegalClass =
  | 'Document'
  | 'Point'
  | 'Ayat'
  | 'Pasal'
  | 'Metadata'
  | 'Paragraf'
  | 'Bagian'
  | 'Bab';
function getLegalClass(trace: LegalTrace): LegalClass {
  if (isDocumentTrace(trace)) return 'Document';
  if (trace._structureType === 'point') return 'Point';
  if (trace._structureType === 'ayat') return 'Ayat';
  if (trace._structureType === 'pasal') return 'Pasal';
  if (trace._structureType === 'metadata') return 'Metadata';
  if (trace._structureType === 'paragraf') return 'Paragraf';
  if (trace._structureType === 'bagian') return 'Bagian';
  if (trace._structureType === 'bab') return 'Bab';
  assertNever(trace);
}

/**
 * PartOf
 */
function getAlternativeVocabQuads(triples: Triple[]): n3.Quad[] {
  return _(triples)
    .map(([s, p, o]) => {
      if (isNil(o) || isString(o) || isNumber(o)) return undefined;
      if (
        p === 'hasAyat' ||
        p === 'hasBab' ||
        p === 'hasBagian' ||
        p === 'hasMetadata' ||
        p === 'hasParagraf' ||
        p === 'hasPasal' ||
        p === 'hasPoint'
      ) {
        return triple(node(o), onto('partOf'), node(s));
      }
      return undefined;
    })
    .compact()
    .value();
}

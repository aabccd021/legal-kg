import { values } from 'lodash';

export type ExternalVocab = RDFVocab | XSDVocab;
export function isExternalVocab(x: string): x is ExternalVocab {
  return isRDF(x) || isXSD(x);
}

/**
 * RDF
 */
const RDF_PREFIX = ['http://www.w3.org/1999/02/22-rdf-syntax-ns#'] as const;
const RDF_SUFFIX = ['first', 'langString', 'nil', 'rest', 'type'] as const;
type RDFPrefix = typeof RDF_PREFIX[number];
type RDFSuffix = typeof RDF_SUFFIX[number];
type RDFVocab = `${RDFPrefix}${RDFSuffix}`;
export const rdfPrefix = RDF_PREFIX[0];
export const rdf: { [P in RDFSuffix]: RDFVocab } = {
  first: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#first',
  langString: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
  nil: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#nil',
  rest: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#rest',
  type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
};
function isRDF(x: string): x is RDFSuffix {
  return (values(rdf) as readonly string[]).indexOf(x) >= 0;
}

/**
 * XSD
 */
const XSD_PREFIX = ['http://www.w3.org/2001/XMLSchema#'] as const;
const XSD_SUFFIX = ['boolean', 'decimal', 'double', 'integer', 'string'] as const;
type XSDPrefix = typeof XSD_PREFIX[number];
type XSDSuffix = typeof XSD_SUFFIX[number];
type XSDVocab = `${XSDPrefix}${XSDSuffix}`;
export const xsdPrefix = XSD_PREFIX[0];
export const xsd: { [P in XSDSuffix]: XSDVocab } = {
  boolean: 'http://www.w3.org/2001/XMLSchema#boolean',
  decimal: 'http://www.w3.org/2001/XMLSchema#decimal',
  double: 'http://www.w3.org/2001/XMLSchema#double',
  integer: 'http://www.w3.org/2001/XMLSchema#integer',
  string: 'http://www.w3.org/2001/XMLSchema#string',
};
function isXSD(x: string): x is XSDVocab {
  return (values(xsd) as readonly string[]).indexOf(x) >= 0;
}

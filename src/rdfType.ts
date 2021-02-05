import { DataFactory } from 'n3';

const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
export const XSD = 'http://www.w3.org/2001/XMLSchema#';
const { namedNode } = DataFactory;
// const SWAP = 'http://www.w3.org/2000/10/swap/';

export const xsd = {
  decimal: namedNode(`${XSD}decimal`),
  boolean: namedNode(`${XSD}boolean`),
  double: namedNode(`${XSD}double`),
  integer: namedNode(`${XSD}integer`),
  string: namedNode(`${XSD}string`),
};
export const rdf = {
  type: namedNode(`${RDF}type`),
  nil: namedNode(`${RDF}nil`),
  first: namedNode(`${RDF}first`),
  rest: namedNode(`${RDF}rest`),
  langString: namedNode(`${RDF}langString`),
};
//   owl: {
//     sameAs: 'http://www.w3.org/2002/07/owl#sameAs',
//   },
//   r: {
//     forSome: `${SWAP}reify#forSome`,
//     forAll: `${SWAP}reify#forAll`,
//   },
//   log: {
//     implies: `${SWAP}log#implies`,
//   },
// };

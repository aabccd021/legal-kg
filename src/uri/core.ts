import { isNil, isNumber, isString } from 'lodash';
import { DataFactory, NamedNode, Quad } from 'n3';

export const baseUri = 'http://example.org/legal/';

const { triple, namedNode, literal } = DataFactory;

export function onto(string: string): NamedNode<string> {
  return namedNode(`${baseUri}ontology/${string}`);
}
export type Tuple = [NamedNode, string | NamedNode, string | number | NamedNode | undefined];
export function tupleToQuad([subject, predicate, object]: Tuple): Quad | undefined {
  if (isNil(object)) return undefined;
  const _predicate = isString(predicate) ? onto(predicate) : predicate;
  const _object = isString(object) || isNumber(object) ? literal(object) : object;
  return triple(subject, _predicate, _object);
}

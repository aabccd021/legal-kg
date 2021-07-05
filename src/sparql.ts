import { SparqlEndpointFetcher } from 'fetch-sparql-endpoint';

const fetcher = new SparqlEndpointFetcher();

type Row = Record<string, { value: string; termType: 'Literal' | 'NamedNode' }>;

export async function sparqlQuery({ queryStr }: { queryStr: string }): Promise<Row[]> {
  const bindingsStream = await fetcher.fetchBindings(
    'http://127.0.0.1:3030/lex2kg/sparql',
    queryStr
  );
  const end: Row[] = [];
  for await (const chunk of bindingsStream) {
    end.push((chunk as unknown) as Row);
  }
  return end;
}

import { readdirSync, readFileSync, unlinkSync, existsSync, writeFileSync } from 'fs';
import path from 'path';

import { SparqlEndpointFetcher } from 'fetch-sparql-endpoint';

const fetcher = new SparqlEndpointFetcher();

type Row = Record<string, { value: string }>;

async function query(): Promise<void> {
  const sparqlFileDirPath = 'example_queries';
  const queryResultFilePath = 'query_result.md';
  if (existsSync(queryResultFilePath)) {
    unlinkSync(queryResultFilePath);
  }
  const results: string[] = [];
  for (const fileName of readdirSync(sparqlFileDirPath)) {
    try {
      const baseName = path.basename(fileName, '.sparql');
      const queryStr = readFileSync(path.join(sparqlFileDirPath, fileName), {
        encoding: 'utf-8',
      });
      const bindingsStream = await fetcher.fetchBindings(
        'http://127.0.0.1:3030/tdb/sparql',
        queryStr
      );
      let idx = 0;
      const end = [];
      for await (const chunk of bindingsStream) {
        end.push(
          `\n|${idx}||\n|-|-|\n` +
            Object.entries((chunk as any) as Row)
              .map(([key, val]) => `|${key}|${val.value.replaceAll('\n', '\\n')}|`)
              .join('\n')
        );
        idx += 1;
      }
      results.push(
        `# Query_${baseName}\nquery:\n\`\`\`sparql\n${queryStr}\n\`\`\`\nresult:\n${end.join(
          '\n\n'
        )}`
      );
    } catch (e) {
      results.push(JSON.stringify(e));
      console.log(e);
    }
  }
  writeFileSync(queryResultFilePath, results.join('\n\n'));
}
query();

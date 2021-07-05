import { readdirSync, readFileSync, unlinkSync, existsSync, writeFileSync } from 'fs';
import path from 'path';
import { sparqlQuery } from './sparql';

async function query(): Promise<void> {
  const sparqlFileDirPath = 'example_queries';
  const queryResultFilePath = 'query_result.md';
  if (existsSync(queryResultFilePath)) {
    unlinkSync(queryResultFilePath);
  }
  const results: string[] = [];
  for (const fileName of readdirSync(sparqlFileDirPath)) {
    if (!fileName.endsWith('.sparql')) {
      continue;
    }
    console.time(fileName);
    try {
      const baseName = path.basename(fileName, '.sparql');
      const queryStr = readFileSync(path.join(sparqlFileDirPath, fileName), 'utf-8');
      const res = await sparqlQuery({ queryStr });
      const end: string[] = res.map(
        (row, idx) =>
          `|${idx}||\n|-|-|\n` +
          Object.entries(row)
            .map(([key, val]) => `|${key}|${val.value.replaceAll('\n', '\\n')}|`)
            .join('\n')
      );
      results.push(
        `# Query_${baseName}\n\n` +
          `query:\n\n\`\`\`sparql\n${queryStr}\n\`\`\`\n\nresult:\n${end.join('\n\n')}`
      );
    } catch (e) {
      results.push(JSON.stringify(e));
    }
    console.timeEnd(fileName);
  }
  writeFileSync(queryResultFilePath, results.join('\n\n'));
}

query();

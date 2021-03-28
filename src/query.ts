import { newEngine } from '@comunica/actor-init-sparql-file';
import { compact, curry, isUndefined } from 'lodash';
import * as fs from 'fs';
import path from 'path';
import { DocumentNode, pathToNode } from './legal/document';
import { getDocumentData, nodeToFilePathWith } from './data';
import { toValueOfKey } from './util';

export async function query(args: { legalId?: string }): Promise<void> {
  const nodes: DocumentNode[] = !isUndefined(args.legalId)
    ? [pathToNode(args.legalId)]
    : getDocumentData('yaml');
  const ttlFilePaths = nodes.map(nodeToFilePathWith('ttl')).map(toValueOfKey('path'));
  const sparqlFileDirPath = 'example_queries';
  const sparqlContexes = fs
    .readdirSync(sparqlFileDirPath)
    .filter(isSparqlFilePath)
    .map(queryFileNameToSparqlContextWith(sparqlFileDirPath));
  for (const { queryStr, resultFilePath } of sparqlContexes) {
    console.log(`querying ${resultFilePath}`);
    const result = await _getQueryResult(queryStr, ttlFilePaths);
    fs.writeFileSync(resultFilePath, result);
  }
}

function isSparqlFilePath(filePath: string): boolean {
  return path.extname(filePath) === '.sparql';
}

type SparqlContext = { queryStr: string; resultFilePath: string };

const queryFileNameToSparqlContextWith = curry(queryFileNameToSparqlContext);
function queryFileNameToSparqlContext(sparqlFileDirPath: string, fileName: string): SparqlContext {
  const sparqlFilePath = path.join(sparqlFileDirPath, fileName);
  const queryStr = fs.readFileSync(sparqlFilePath, { encoding: 'utf-8' });
  const baseName = path.basename(fileName, '.sparql');
  const resultFileName = path.format({ name: `${baseName}_result`, ext: '.txt' });
  const resultFilePath = path.join(sparqlFileDirPath, resultFileName);
  return { queryStr, resultFilePath };
}

async function _getQueryResult(queryStr: string, sources: string[]): Promise<string> {
  const result = await newEngine().query(queryStr, { sources });

  if (result.type == 'bindings') {
    const bindings = await result.bindings();

    return compact(bindings)
      .map((y) => result.variables.map((x) => `${x}: ${y.get(x).value}`).join('\n'))
      .join('\n\n');
  }
  throw Error('unknown result type');
}

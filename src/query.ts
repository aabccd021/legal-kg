import { newEngine } from '@comunica/actor-init-sparql-file';
import { compact, curry, isUndefined, isEmpty } from 'lodash';
import * as fs from 'fs';
import path from 'path';
import { getDocumentData, nodeToFile } from './data';
import { DocumentNode, nodeToName } from './legal/document';
import { joinWith, sequential, writeFile } from './util';

export async function query(args: { legalDocPath?: string }): Promise<void> {
  const sparqlFileDirPath = 'example_queries';
  const queryArr = fs.readdirSync(sparqlFileDirPath).map(fileNameToQueryWith(sparqlFileDirPath));
  if (!isUndefined(args.legalDocPath)) throw Error('TODO');
  await sequential(getDocumentData('ttl').map(queryNodeWith(queryArr)));
}

type Query = { str: string; name: string };

const fileNameToQueryWith = curry(fileNameToQuery);
function fileNameToQuery(sparqlFileDirPath: string, fileName: string): Query {
  const sparqlFilePath = path.join(sparqlFileDirPath, fileName);
  const str = fs.readFileSync(sparqlFilePath, { encoding: 'utf-8' });
  const name = path.basename(fileName, '.sparql');
  return { str, name };
}

const queryNodeWith = curry(queryNode);
function queryNode(queryArr: Query[], node: DocumentNode): Promise<void> {
  console.log(`Querying ${nodeToName(node)}`);
  return sequential(queryArr.map(toQueryResultWith(node)))
    .then(joinWith('\n'))
    .then(writeFile(nodeToFile('query_result', node).path));
}

const toQueryResultWith = curry(toQueryResult);
function toQueryResult(node: DocumentNode, query: Query): Promise<string> {
  console.log(`    ${query.name}`);
  return _getQueryResult(query, [nodeToFile('ttl', node).path]);
}

async function _getQueryResult(query: Query, sources: string[]): Promise<string> {
  const result = await newEngine().query(query.str, { sources });
  if (result.type == 'bindings') {
    const bindings = await result.bindings();
    const content = compact(bindings)
      .map((y) => result.variables.map((x) => `| |${x}| ${y.get(x).value}|`).join('\n'))
      .map((resultStr, idx) => `| ${idx} | | |\n${resultStr}`)
      .join('\n');
    const contentTable = isEmpty(content) ? 'empty result' : `\n| | | |\n|-|-|-|\n${content}`;
    return `\n# ${query.name}\n${contentTable}`;
  }
  throw Error('unknown result type');
}

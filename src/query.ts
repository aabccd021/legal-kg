import { curry, isUndefined } from 'lodash';
import * as fs from 'fs';
import path from 'path';
import { DocumentNode, nodeToName } from './document';
import { getDocumentData, nodeToFile } from './util';

export async function query(args: { legalDocPath?: string }): Promise<void> {
  const sparqlFileDirPath = 'example_queries';
  const queryArr = fs.readdirSync(sparqlFileDirPath).map(fileNameToQueryWith(sparqlFileDirPath));
  if (!isUndefined(args.legalDocPath)) throw Error('TODO');
  for (const node of getDocumentData('ttl')) {
    console.log(`Querying ${nodeToName(node)}`);
    await queryNode(queryArr, node);
  }
}

type Query = { str: string; name: string };

const fileNameToQueryWith = curry(fileNameToQuery);
function fileNameToQuery(sparqlFileDirPath: string, fileName: string): Query {
  const sparqlFilePath = path.join(sparqlFileDirPath, fileName);
  const str = fs.readFileSync(sparqlFilePath, { encoding: 'utf-8' });
  const name = path.basename(fileName, '.sparql');
  return { str, name };
}

async function queryNode(queryArr: Query[], node: DocumentNode): Promise<void> {
  let results: string[] = [];
  for (const query of queryArr) {
    console.time(`    ${query.name}`);
    results = [...results, await toQueryResult(node, query)];
    console.timeEnd(`    ${query.name}`);
  }
  fs.writeFileSync(nodeToFile('query_result', node).path, results.join('\n'));
}

function toQueryResult(node: DocumentNode, query: Query): Promise<string> {
  return _getQueryResult(query, [nodeToFile('ttl', node).path]);
}

async function _getQueryResult(query: Query, sources: string[]): Promise<string> {
  return 'result';
  // const result = await newEngine().query(query.str, { sources });
  // if (result.type == 'bindings') {
  //   const bindings = await result.bindings();
  //   const content = compact(bindings)
  //     .map((y) => result.variables.map((x) => `| |${x}| ${y.get(x)?.value}|`).join('\n'))
  //     .map((resultStr, idx) => `| ${idx} | | |\n${resultStr}`)
  //     .join('\n');
  //   const contentTable = isEmpty(content) ? 'empty result' : `\n| | | |\n|-|-|-|\n${content}`;
  //   return `\n# ${query.name}\n${contentTable}`;
  // }
  // throw Error('unknown result type');
}

// TODO: query using fuseki

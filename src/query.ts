// import { newEngine } from '@comunica/actor-init-sparql-file';
// import { compact } from 'lodash';
// import * as fs from 'fs';
// import path from 'path';

// export async function query({
//   legals,
//   extractedDirPath,
// }: {
//   legals: string[];
//   extractedDirPath: string;
// }): Promise<void> {
//   const ttlFilePaths = legals.map((legal) => path.join(extractedDirPath, legal, `${legal}.ttl`));
//   const ontologyFilePath = path.join('ontology', 'legal.ttl');
//   const tripleFilePaths = [...ttlFilePaths, ontologyFilePath];
//   const queryDirPath = 'example_queries';
//   const queryDirFileNames = fs.readdirSync(queryDirPath);
//   const queryFileNames = queryDirFileNames.filter((f) => path.extname(f) === '.sparql');

//   for (const queryFileName of queryFileNames) {
//     console.log(`querying ${queryFileName}`);
//     const query = fs.readFileSync(path.join(queryDirPath, queryFileName)).toString();
//     const result = await _getQueryResult(query, tripleFilePaths);
//     const baseName = path.basename(queryFileName, '.sparql');
//     const queryResultFileName = path.format({
//       name: `${baseName}_result`,
//       ext: '.txt',
//     });
//     fs.writeFileSync(path.join(queryDirPath, queryResultFileName), result);
//   }
// }

// async function _getQueryResult(queryStr: string, sources: string[]): Promise<string> {
//   const result = await newEngine().query(queryStr, { sources });

//   if (result.type == 'bindings') {
//     const bindings = await result.bindings();

//     return compact(bindings)
//       .map((y) => result.variables.map((x) => `${x}: ${y.get(x).value}`).join('\n'))
//       .join('\n\n');
//   }
//   throw Error('unknown result type');
// }

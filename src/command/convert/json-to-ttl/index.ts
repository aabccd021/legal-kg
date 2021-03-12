// import * as fs from 'fs';
// import { jsonToTriples } from './json-to-triples';
// import { triplesToTtl } from './triples-to-ttl';
// import { Document, DocumentNode } from '../../../legal/document/index';
// import { getDocumentData, getDocumentFilePath } from '../../../data';
// import pTimeout from 'p-timeout';

// type Option = { overwrite: boolean };
// export function jsonToTtl(option: Option): void {
//   const jsonNodes = getDocumentData('json');
//   jsonNodes.forEach((jsonNode) => {
//     pTimeout(handleJson(jsonNode, option), 1000);
//   });
// }

// async function handleJson(jsonNode: DocumentNode, option: Option): Promise<void> {
//   const { overwrite } = option;
//   const jsonFile = getDocumentFilePath(jsonNode, 'json');
//   const { path: ttlPath, exists: ttlExists } = getDocumentFilePath(jsonNode, 'ttl');

//   try {
//     if (!overwrite && ttlExists) {
//       console.log(`Skipped json-to-ttl ${ttlPath}`);
//       return;
//     }

//     const jsonFileContent = await fs.promises.readFile(jsonFile.path);
//     const json = JSON.parse(jsonFileContent.toString()) as Document;
//     const triples = jsonToTriples(json);
//     const ttl = triplesToTtl(triples);

//     fs.writeFileSync(ttlPath, ttl);

//     console.log(`Finished json-to-ttl ${ttlPath}`);
//   } catch {
//     console.log(`Error json-to-ttl ${ttlPath}`);
//   }
// }

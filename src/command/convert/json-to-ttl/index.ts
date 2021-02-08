import * as fs from 'fs';
import { json2triples } from './json-to-triples';
import { triples2Ttl } from './triples-to-ttl';
import { Document } from '../../../legal/document/index';
import { getDocumentData, getDocumentFilePath } from '../../../data';

export function json2ttl(): void {
  const nodes = getDocumentData('json');
  nodes.forEach((node) => {
    const jsonPath = getDocumentFilePath(node, 'json');
    const ttlPath = getDocumentFilePath(node, 'ttl');

    try {
      const jsonString = fs.readFileSync(jsonPath).toString();
      const json = JSON.parse(jsonString) as Document;
      const triples = json2triples(json);
      const ttl = triples2Ttl(triples);

      fs.writeFileSync(ttlPath, ttl);

      console.log(`Finished json2ttl ${ttlPath}`);
    } catch {
      console.log(`Error pdf2text ${ttlPath}`);
    }
  });
}

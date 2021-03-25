import * as fs from 'fs';
import { Document, DocumentNode } from '../../../legal/document/index';
import { getDocumentData, getDocumentFilePath } from '../../../data';
import * as yaml from 'js-yaml';
import { yamlToTriples } from './json-to-triples';
import { triplesToTtl } from './triples-to-ttl';

export function yamlToTtl(): void {
  const jsonNodes = getDocumentData('yaml');
  jsonNodes.forEach(handleJson);
}

function handleJson(jsonNode: DocumentNode): void {
  console.log(`Start json-to-ttl ${JSON.stringify(jsonNode)}`);
  const yamlFile = getDocumentFilePath(jsonNode, 'yaml');
  const { path: ttlPath } = getDocumentFilePath(jsonNode, 'ttl');

  const yamlContent = yaml.load(fs.readFileSync(yamlFile.path, 'utf8')) as Document;
  const triples = yamlToTriples(yamlContent);
  const ttl = triplesToTtl(triples);

  fs.writeFileSync(ttlPath, ttl);

  console.log(`Finished json-to-ttl ${ttlPath}`);
}

yamlToTtl();

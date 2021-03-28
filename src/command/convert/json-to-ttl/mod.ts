import * as fs from 'fs';
import { Document, DocumentNode } from '../../../legal/document/index';
import { getDocumentData, nodeToFilePath } from '../../../data';
import * as yaml from 'js-yaml';
import { yamlToTriples } from './json-to-triples';
import { triplesToTtl } from './triples-to-ttl';

export function yamlToTtl(): void {
  const jsonNodes = getDocumentData('yaml');
  jsonNodes.forEach(handleJson);
}

function handleJson(node: DocumentNode): void {
  console.log(`Start json-to-ttl ${JSON.stringify(node)}`);
  const yamlFile = nodeToFilePath('yaml', node);
  const { path: ttlPath } = nodeToFilePath('ttl', node);

  const yamlContent = yaml.load(fs.readFileSync(yamlFile.path, 'utf8')) as Document;
  const triples = yamlToTriples(yamlContent);
  const ttl = triplesToTtl(triples);

  fs.writeFileSync(ttlPath, ttl);

  console.log(`Finished json-to-ttl ${ttlPath}`);
}

yamlToTtl();

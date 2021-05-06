import * as fs from 'fs';
import { DocumentNode, nodeToName } from './document/index';
import { Document } from './component';
import * as yaml from 'js-yaml';
import { yamlToTriples } from './data_to_ttl/data-to-triples';
import { triplesToTtl } from './data_to_ttl/triples-to-ttl';
import { getDocumentData, nodeToFile, shouldOverwrite } from './util';

export function yamlToTtl(): void {
  const jsonNodes = getDocumentData('yaml');
  jsonNodes.forEach(handleJson);
}

function handleJson(node: DocumentNode): void {
  console.log('\nstart', node);
  const yamlFile = nodeToFile('yaml', node);
  const ttlFile = nodeToFile('ttl', node);

  if (!shouldOverwrite() && ttlFile.exists) {
    console.log('skipped because exists');
    return;
  }

  const yamlContent = yaml.load(fs.readFileSync(yamlFile.path, 'utf8')) as Document;
  const triples = yamlToTriples(yamlContent);
  const ttl = triplesToTtl(triples);

  fs.writeFileSync(ttlFile.path, ttl);

  console.log(`Finished json-to-ttl ${nodeToName(node)}`);
}

yamlToTtl();

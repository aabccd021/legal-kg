import { getDocumentData, nodeToFile } from './util';
import * as yaml from 'js-yaml';
import { readFileSync, writeFileSync } from 'fs';
import { yamlToTriples } from './data_to_ttl/data-to-triples';
import { triplesToTtl } from './data_to_ttl/triples-to-ttl';
import { Document } from './component';

getDocumentData('data').forEach((node) => {
  const dataFile = nodeToFile('data', node);
  const ttlFile = nodeToFile('ttl', node);
  const document = yaml.load(readFileSync(dataFile.path, 'utf8')) as Document;
  const triples = triplesToTtl(yamlToTriples(document));
  writeFileSync(ttlFile.path, triples);
});

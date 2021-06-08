import { getDocumentData, nodeToFile } from './util';
import * as yaml from 'js-yaml';
import { readFileSync, writeFileSync } from 'fs';
import { yamlToTriples } from './data_to_ttl/data-to-triples';
import { triplesToTtl } from './data_to_ttl/triples-to-ttl';
import { Document } from './component';

getDocumentData('data').forEach((node) => {
  try {
    const dataFile = nodeToFile('data', node);
    const ttlFile = nodeToFile('ttl', node);
    const documentFile = readFileSync(dataFile.path, 'utf8');
    if (documentFile.length === 0) {
      console.log('empty file');
      return;
    }
    const triples = triplesToTtl(yamlToTriples(yaml.load(documentFile) as Document));
    writeFileSync(ttlFile.path, triples);
  } catch (e) {
    console.log(e);
  }
});

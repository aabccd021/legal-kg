import * as fs from 'fs';
import { json2triples } from './json-to-triples';
import { triples2Ttl } from './triples-to-ttl';
import { Document } from '../../../legal/document/index';
import { DataDir, getDocumentData, getDocFilePath } from '../../../data';
import { getConfig } from '../../../utils';

export function json2ttl(): void {
  const { dataDir } = getConfig();
  const jsonDir: DataDir = { dir: dataDir, dataType: 'json' };
  const ttlDir: DataDir = { dir: dataDir, dataType: 'ttl' };

  const datas = getDocumentData(jsonDir);
  datas.forEach((data) => {
    const jsonPath = getDocFilePath(data, jsonDir);
    const ttlPath = getDocFilePath(data, ttlDir);

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

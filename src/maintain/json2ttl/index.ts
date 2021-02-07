import { Document } from '../../type';

import { DataDir, getDocumentData, getDocFilePath } from '../utils';
import * as fs from 'fs';
import { json2triples } from './json2triples';
import { triples2Ttl } from './triples2ttl';
import { getConfig } from '../../utils';

function json2ttl(): void {
  const { dataDir } = getConfig();
  const jsonDir: DataDir = { dir: dataDir, dataType: 'json' };
  const ttlDir: DataDir = { dir: dataDir, dataType: 'ttl' };

  const datas = getDocumentData(jsonDir);
  datas.forEach((data) => {
    const jsonPath = getDocFilePath(data, jsonDir);
    const ttlPath = getDocFilePath(data, ttlDir);

    const jsonString = fs.readFileSync(jsonPath).toString();
    const json = JSON.parse(jsonString) as Document;
    const triples = json2triples(json);
    const ttl = triples2Ttl(triples);

    fs.writeFileSync(ttlPath, ttl);

    console.log(`Finished json2ttl ${ttlPath}`);
  });
}

json2ttl();

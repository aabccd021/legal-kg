import { LegalDocument } from '../../type';

import { DataDir, getLegalData, getDocFilePath } from '../utils';
import * as fs from 'fs';
import { json2triples } from './json2triples';
import { triples2Ttl } from './triples2ttl';

function json2ttl(): void {
  const legalDir = 'maintained_legals';
  const jsonDir: DataDir = { legalDir, dataType: 'json' };
  const ttlDir: DataDir = { legalDir, dataType: 'ttl' };

  const legals = getLegalData(jsonDir);
  legals.forEach((legal) => {
    const jsonPath = getDocFilePath(legal, jsonDir);
    const ttlPath = getDocFilePath(legal, ttlDir);

    const jsonString = fs.readFileSync(jsonPath).toString();
    const json = JSON.parse(jsonString) as LegalDocument;
    const triples = json2triples(json);
    const ttl = triples2Ttl(triples);

    fs.writeFileSync(ttlPath, ttl);

    console.log(`Finished json2ttl ${ttlPath}`);
  });
}

json2ttl();

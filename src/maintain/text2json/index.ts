import { DataDir, getDocFilePath, getDocumentData } from '../utils';
import { text2rawJson } from './text2rawJson';
import * as fs from 'fs';
import { rawJson2json } from './rawJson2json';
import stringify from 'json-stable-stringify';

function text2json(): void {
  const legalDir = 'maintained_documents';
  const textDir: DataDir = { dir: legalDir, dataType: 'text' };
  const jsonDir: DataDir = { dir: legalDir, dataType: 'json' };

  const legals = getDocumentData(textDir);
  legals.forEach((legal) => {
    const textPath = getDocFilePath(legal, textDir);
    const jsonPath = getDocFilePath(legal, jsonDir);

    const text = fs.readFileSync(textPath).toString();
    const rawJson = text2rawJson(text, legal);
    const json = rawJson2json(rawJson, legal);

    fs.writeFileSync(jsonPath, stringify(json, { space: 2 }));

    console.log(`Finished text2json ${jsonPath}`);
  });
}

text2json();

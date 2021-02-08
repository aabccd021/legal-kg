import { text2rawJson } from './text-to-raw-json';
import * as fs from 'fs';
import { rawJson2json } from './raw-json-to-json';
import stringify from 'json-stable-stringify';
import { DataDir, getDocumentData, getDocFilePath } from '../../../data';
import { getConfig } from '../../../config';

export function text2json(): void {
  const { dataDir } = getConfig();
  const textDir: DataDir = { dir: dataDir, dataType: 'text' };
  const jsonDir: DataDir = { dir: dataDir, dataType: 'json' };

  const legals = getDocumentData(textDir);
  legals.forEach((legal) => {
    const textPath = getDocFilePath(legal, textDir);
    const jsonPath = getDocFilePath(legal, jsonDir);

    try {
      const text = fs.readFileSync(textPath).toString();
      const rawJson = text2rawJson(text, legal);
      const json = rawJson2json(rawJson, legal);

      fs.writeFileSync(jsonPath, stringify(json, { space: 2 }));

      console.log(`Finished text2json ${jsonPath}`);
    } catch {
      console.log(`Error pdf2text ${jsonPath}`);
    }
  });
}

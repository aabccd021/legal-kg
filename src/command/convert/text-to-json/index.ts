import { text2rawJson } from './text-to-raw-json';
import * as fs from 'fs';
import { rawJson2json } from './raw-json-to-json';
import stringify from 'json-stable-stringify';
import { getDocumentData, getDocumentFilePath } from '../../../data';

export function text2json(): void {
  const nodes = getDocumentData('text');
  nodes.forEach((node) => {
    const textPath = getDocumentFilePath(node, 'text');
    const jsonPath = getDocumentFilePath(node, 'json');

    try {
      const text = fs.readFileSync(textPath).toString();
      const rawJson = text2rawJson(text, node);
      const json = rawJson2json(rawJson, node);

      fs.writeFileSync(jsonPath, stringify(json, { space: 2 }));

      console.log(`Finished text2json ${jsonPath}`);
    } catch {
      console.log(`Error pdf2text ${jsonPath}`);
    }
  });
}

import { textToRawJson } from './text-to-raw-json';
import * as fs from 'fs';
import { rawJsonToJson } from './raw-json-to-json';
import stringify from 'json-stable-stringify';
import { getDocumentData, getDocumentFilePath } from '../../../data';
import { DocumentNode } from '../../../legal/document';
import pTimeout from 'p-timeout';

type Option = { overwrite: boolean };
export function textToJson(option: Option): void {
  const texts = getDocumentData('text');
  texts.forEach((text) => {
    pTimeout(handleText(text, option), 1000);
  });
}

async function handleText(textNode: DocumentNode, option: Option): Promise<void> {
  const { overwrite } = option;
  const textFile = getDocumentFilePath(textNode, 'text');
  const { path: jsonPath, exists: jsonExists } = getDocumentFilePath(textNode, 'json');

  try {
    if (!overwrite && jsonExists) {
      console.log(`Skipped text-to-json ${jsonPath}`);
      return;
    }
    const file = await fs.promises.readFile(textFile.path);
    const text = file.toString();

    const rawJson = textToRawJson(text, textNode);
    const json = rawJsonToJson(rawJson, textNode);

    await fs.promises.writeFile(jsonPath, stringify(json, { space: 2 }));

    console.log(`Finished text-to-json ${jsonPath}`);
  } catch (message) {
    console.log(`Error text-to-json ${jsonPath}`);
    console.error(message);
  }
}

import { textToRawJson } from './text-to-raw-json';
import * as fs from 'fs';
import { rawJsonToJson } from './raw-json-to-json';
import stringify from 'json-stable-stringify';
import { getDocumentData, getDocumentFilePath } from '../../../data';
import { DocumentNode } from '../../../legal/document';
import pTimeout from 'p-timeout';

type Option = { overwrite: boolean };
export async function textToJson(option: Option): Promise<void> {
  const texts = getDocumentData('text');
  for (const text of texts) {
    try {
      await pTimeout(handleText(text, option), 20000);
    } catch {
      console.warn(`timed out ${JSON.stringify(text)}`);
    }
  }
}

async function handleText(textNode: DocumentNode, option: Option): Promise<void> {
  console.log(`Start processing ${JSON.stringify(textNode)}`);
  const { overwrite } = option;
  const textFile = getDocumentFilePath(textNode, 'text');
  const { path: jsonPath, exists: jsonExists } = getDocumentFilePath(textNode, 'json');

  try {
    if (!overwrite && jsonExists) {
      console.log(`Skipped text-to-json ${jsonPath}`);
      return;
    }
    const file = fs.readFileSync(textFile.path);
    const text = file.toString();

    const rawJson = textToRawJson(text, textNode);
    const json = rawJsonToJson(rawJson, textNode);

    console.log(`Writing text-to-json ${jsonPath}`);
    fs.writeFileSync(jsonPath, stringify(json, { space: 2 }));

    console.log(`Finished text-to-json ${jsonPath}`);
  } catch (message) {
    console.log(`Error text-to-json ${jsonPath}`);
    console.error(message);
  }
  console.log();
}

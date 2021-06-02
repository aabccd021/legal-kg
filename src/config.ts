import { isNil } from 'lodash';
import * as fs from 'fs';

type Config = {
  dataDir: string;
  uriBase: string;
  unclassifiedPdfDir: string;
};
export function getConfig(): Config {
  const config = JSON.parse(fs.readFileSync('legal-config.json').toString()) as Config;
  if (isNil(config.dataDir)) throw Error('dataDir not specified');
  if (isNil(config.uriBase)) throw Error('uriBase dir not specified');
  if (isNil(config.unclassifiedPdfDir)) throw Error('unclassifiedPdfDir dir not specified');
  return config;
}

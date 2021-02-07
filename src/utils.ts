import { isNil } from 'lodash';
import * as fs from 'fs';
type Config = {
  dataDir: string;
  uriBase: string;
  legalDataDir: string;
};
export function getConfig(): Config {
  const config = JSON.parse(fs.readFileSync('legalconfig.json').toString()) as Config;
  if (isNil(config.dataDir)) throw Error('document dir not specified');
  if (isNil(config.uriBase)) throw Error('uriBase dir not specified');
  if (isNil(config.legalDataDir)) throw Error('legalDataDir dir not specified');
  return config;
}

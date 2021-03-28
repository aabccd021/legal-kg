import yargs from 'yargs';
import { query } from './query';

yargs
  .command({
    command: 'query',
    describe: 'Query',
    handler: query,
  })
  .demandCommand().argv;

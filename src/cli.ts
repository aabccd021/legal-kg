import yargs from 'yargs';
import { query } from './query';

yargs
  .command<{ legalId?: string }>({
    command: 'query',
    describe: 'Query',
    builder: {
      legalId: {
        string: true,
      },
    },
    handler: query,
  })
  .demandCommand().argv;

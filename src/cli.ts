import yargs from 'yargs';
import { jsonToMd } from './command/convert/json_to_md/mod';
import { downloadPdf } from './command/download-pdf';
import { updateIndex } from './command/update-index';

type CommandOption = { overwrite: boolean };

yargs
  .command({
    command: 'update-index',
    describe: 'Update legal index',
    handler: updateIndex,
  })
  .command<CommandOption>({
    command: 'download-pdf',
    describe: 'Download legal pdf',
    builder: {
      overwrite: {
        boolean: true,
        default: false,
        describe: 'Overwrite existing pdf file',
      },
    },
    handler: downloadPdf,
  })
  .command<CommandOption>({
    command: 'convert:pdf-to-text',
    describe: 'Convert legal pdf to text file',
    builder: {
      overwrite: {
        boolean: true,
        default: false,
        describe: 'Overwrite existing pdf',
      },
    },
    handler: () => console.log('UNIMPLEMENTED'),
  })
  .command<CommandOption>({
    command: 'convert:text-to-json',
    describe: 'Convert legal text file to json',
    builder: {
      overwrite: {
        boolean: true,
        default: false,
        describe: 'Overwrite existing json',
      },
    },
    handler: () => console.log('UNIMPLEMENTED'),
  })
  .command<CommandOption>({
    command: 'convert:json-to-md',
    describe: 'Convert legal json to markdown',
    builder: {
      overwrite: {
        boolean: true,
        default: false,
        describe: 'Overwrite existing markdown',
      },
    },
    handler: jsonToMd,
  })
  // .command<CommandOption>({
  //   command: 'convert:json-to-ttl',
  //   describe: 'Convert legal json to turtle file',
  //   builder: {
  //     overwrite: {
  //       boolean: true,
  //       default: false,
  //       describe: 'Overwrite existing turtle file',
  //     },
  //   },
  // handler: jsonToTtl,
  // })

  .demandCommand().argv;

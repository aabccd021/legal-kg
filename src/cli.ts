import yargs, { Options } from 'yargs';
import { updateIndex } from './command/update-index';

type CommandOption = { overwrite: Options };

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
    handler: (argv) => {
      console.log(argv);
      console.log(argv.overwrite);
      console.log(typeof argv.overwrite);
      // downloadPdf({ overwrite: false });
    },
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
    handler: (args) => console.log(args.overwrite),
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
    handler: (args) => console.log(args.overwrite),
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
    handler: (args) => console.log(args.overwrite),
  })
  .command<CommandOption>({
    command: 'convert:json-to-ttl',
    describe: 'Convert legal json to turtle file',
    builder: {
      overwrite: {
        boolean: true,
        default: false,
        describe: 'Overwrite existing turtle file',
      },
    },
    handler: (args) => console.log(args.overwrite),
  })

  .demandCommand().argv;

import { writeFileSync } from 'fs';
import { getDocumentData } from './util';

const tahunNomor = getDocumentData('ttl')
  .map((node) => {
    if (node.docType === 'noTahun') {
      return [node.tahun, node.nomor].join(',');
    }
    throw Error();
  })
  .join('\n');

writeFileSync('converted_docs.csv', `tahun,nomor\n${tahunNomor}`);

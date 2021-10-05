import * as readline from 'readline';
import { sparqlQuery } from './sparql';

type Context =
  | { type: 'init' | 'search' | 'selectDoc' | 'showData' }
  | { type: 'selectData' | 'selectPasal'; doc: string };

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let context: Context = {
  type: 'init',
};

console.log(
  `Ada yang bisa dibantu?
1. Mencari Peraturan Perundang-undangan`
);

rl.on('line', async function (line) {
  context = await reducer(line, context);
});

async function reducer(inputStr: string, context: Context): Promise<Context> {
  if (context.type === 'init') {
    if (inputStr === '1') {
      console.log('Masukkan Keyword Peraturan: ');
      return { type: 'search' };
    }
  }
  if (context.type === 'search') {
    const res = await sparqlQuery({
      queryStr: `
PREFIX lex2kg-o: <https://example.org/lex2kg/ontology/>

SELECT ?doc ?title
WHERE {
  ?doc a lex2kg-o:Peraturan .
  ?doc lex2kg-o:tentang ?title.
  FILTER REGEX(STR(?title), "${inputStr.toUpperCase()}")
}
`,
    });
    console.log(
      `Berikut adalah peraturan yang judulnya mengandung ${inputStr}` +
        res.map((row) => row.doc?.value.replace('https://example.org/lex2kg/', '')).join('\n') +
        '\n\nPilih salah satu untuk melihat lebih lanjut: '
    );
    return { type: 'selectDoc' };
  }
  if (context.type === 'selectDoc') {
    const doc = inputStr;
    console.log(`Data ${doc}:` + `\n-metadata\n-menimbang\n-konten\n\n`);
    console.log('Pilih data yang ingin anda lihat: ');
    return { type: 'selectData', doc };
  }
  if (context.type === 'selectData') {
    const dataType = inputStr;
    if (dataType === 'metadata') {
      const legalURI = context.doc;
      const res = await sparqlQuery({
        queryStr: `
PREFIX o: <https://example.org/lex2kg/ontology/>
SELECT ?label ?data
WHERE {
<https://example.org/lex2kg/${legalURI}> 
 o:yurisdiksi| o:jenisPeraturan| o:tahun| o:bahasa| o:tentang|
 o:disahkanPada| o:disahkanDi| o:disahkanOleh| o:jabatanPengesah ?data ; ?label ?data .
}
`,
      });
      console.log(
        '\n' +
          res
            .map(
              (row) =>
                `${row.label?.value.replace('https://example.org/lex2kg/ontology/', '')}: ${
                  row.data?.value
                }`
            )
            .join('\n') +
          '\n'
      );
      console.log('Pilih data yang ingin anda lihat: ');
      return { type: 'selectData', doc: context.doc };
    }
    if (dataType === 'menimbang') {
      const legalURI = context.doc;
      const res = await sparqlQuery({
        queryStr: `
PREFIX o: <https://example.org/lex2kg/ontology/>
SELECT DISTINCT ?ditimbang
WHERE {
<https://example.org/lex2kg/${legalURI}> o:menimbang ?menimbang . 
?menimbangText o:bagianDari* ?menimbang .
?menimbangText o:merujuk ?ditimbang .
 }
`,
      });
      console.log(
        '\n' +
          res
            .map((row) => `${row.ditimbang?.value.replace('https://example.org/lex2kg/', '')}`)
            .join('\n') +
          '\n'
      );
      console.log('Pilih data yang ingin anda lihat: ');
      return { type: 'selectData', doc: context.doc };
    }
    if (dataType === 'konten') {
      const legalURI = context.doc;
      const res = await sparqlQuery({
        queryStr: `
PREFIX o: <https://example.org/lex2kg/ontology/>
SELECT (COUNT(?pasal) as ?pasalCount) 
WHERE {
  ?pasal o:bagianDari+ <https://example.org/lex2kg/${legalURI}>; a o:Pasal.
}
`,
      });
      console.log('Pilih nomor pasal [1-' + res[0]?.['pasalCount']?.value + ']');
      return { type: 'selectPasal', doc: context.doc };
    }
  }
  if (context.type === 'selectPasal') {
    const noPasal = inputStr;
    const legalURI = context.doc;
    const res = await sparqlQuery({
      queryStr: `
    PREFIX o: <https://example.org/lex2kg/ontology/>
SELECT DISTINCT ?teks WHERE {
?pasal o:bagianDari+ <https://example.org/lex2kg/${legalURI}>; a o:Pasal;
o:nomor ${noPasal} . ?komponen o:bagianDari* ?pasal;
o:teks ?teks.
}
ORDER BY ?komponen
`,
    });
    console.log(`Konten Pasal ${noPasal} ${legalURI}:`);
    console.log(res.map((row) => row.teks?.value).join('\n'));
    console.log('\nPilih data yang ingin anda lihat: ');
    return { type: 'selectData', doc: context.doc };
  }
  throw Error('unknown command');
}

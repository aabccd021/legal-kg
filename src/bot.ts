import * as readline from 'readline';
import { sparqlQuery } from './sparql';

type Context = { type: 'init' | 'search' | 'searchResult'; text: string };

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let context: Context = {
  type: 'init',
  text: `Ada yang bisa dibantu?
1. Mencari Peraturan Perundang-undangan`,
};

console.log(context.text);

rl.on('line', async function (line) {
  context = await reducer(line, context);
  process.stdout.write(context.text);
  if (context.type === 'searchResult') {
    process.exit(0);
  }
});

async function reducer(inputStr: string, context: Context): Promise<Context> {
  if (context.type === 'init') {
    if (inputStr === '1') {
      return { type: 'search', text: 'Masukkan Keyword Peraturan: ' };
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
    return {
      type: 'searchResult',
      text:
        `Berikut adalah peraturan yang judulnya mengandung ${inputStr}` +
        res.map((row) => row.doc?.value.replace('https://example.org/lex2kg', '')).join('\n'),
    };
  }
  return { ...context, text: `Input tidak diketahui\n${context.text}` };
}

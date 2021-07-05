import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

type Context = { type: 'init'; text: string } | { type: 'search'; text: string };

const initHelp = `Ada yang bisa dibantu?
1. Mencari Peraturan Perundang-undangan`;

let context: Context = {
  type: 'init',
  text: initHelp,
};

console.log(context.text);

rl.on('line', function (line) {
  context = reducer(line, context);
  console.log(context.text);
});

function reducer(input: string, context: Context): Context {
  if (context.type === 'init') {
    if (input === '1') {
      return { type: 'search', text: 'Masukkan Keyword Peraturan' };
    }
  }
	if (context.type === 'search') {

	}
  return { ...context, text: `Input tidak diketahui\n${context.text}` };
}

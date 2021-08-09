import { readdirSync, readFileSync, unlinkSync, existsSync, writeFileSync } from 'fs';
import path from 'path';

async function query(): Promise<void> {
  const sparqlFileDirPath = 'example_queries';
  const queryResultFilePath = 'query_result.tex';
  if (existsSync(queryResultFilePath)) {
    unlinkSync(queryResultFilePath);
  }
  const results: string[] = [];
  for (const fileName of readdirSync(sparqlFileDirPath)) {
    if (!fileName.endsWith('.sparql')) {
      continue;
    }
    if (fileName.endsWith('_latest.sparql')) {
      continue;
    }
    console.time(fileName);
    try {
      const baseName = path.basename(fileName, '.sparql');
      const queryStr = readFileSync(path.join(sparqlFileDirPath, fileName), 'utf-8');
      // const res = await sparqlQuery({ queryStr });
      // const end: string[] = res.map((row, idx) => {
      //   const rowe = Object.entries(row);
      //   return (
      //     `    \\multirow{2}*{${idx}} & ` +
      //     `\\texttt{?${rowe[0]?.[0]}} & ` +
      //     `\\texttt{${rowe[0]?.[1].value
      //       .replaceAll('\n', '\\textbackslash n')
      //       .replaceAll('\\', '\\textbackslash ')
      //       .replaceAll('#', '\\#')
      //       .replaceAll('https://example.org/lex2kg/', ':')}} \\\\ \\cline{2-3}` +
      //     rowe
      //       .slice(1)
      //       .map(
      //         ([key, val]) =>
      //           `\n                     & \\texttt{?${key}}` +
      //           ` & \\texttt{${val.value
      //             .replaceAll('\n', '\\textbackslash n')
      //             .replaceAll('\\', '\\textbackslash ')
      //             .replaceAll('#', '\\#')
      //             .replaceAll('https://example.org/lex2kg/', ':')}}\\\\\\hline`
      //       )
      //       .join('')
      //   );
      // });
      results.push(
        `\\noindent No.${baseName}:
\\begin{lstlisting}
${queryStr}
\\end{lstlisting}
`

        // \\noindent Hasil Query:
        // \\begin{table}
        //   \\begin{tabular}{|l|l|l|}
        //     \\hline
        // ${end.join('\n')}
        //   \\end{tabular}
        // \\end{table}`
      );
    } catch (e) {
      results.push(JSON.stringify(e));
    }
    console.timeEnd(fileName);
  }
  writeFileSync(queryResultFilePath, results.join('\n\n'));
}

query();

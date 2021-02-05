import _ from 'lodash';
import { PDFExtract } from 'pdf.js-extract';

export async function pdf2text(filePath: string): Promise<string[]> {
  const pdf = await new PDFExtract().extract(filePath);
  return _(pdf.pages)
    .compact()
    .map(({ content }) => _(content).map('str').value())
    .flatMap()
    .value();
}

//   python3 script/pdf2text.py pdf/PERGUB33-2020.pdf extracted/PERGUB33-2020/PERGUB33-2020.txt

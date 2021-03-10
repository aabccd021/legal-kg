import { isUndefined } from 'lodash';
import { toArabic } from 'roman-numerals';
import { Span } from '../util';

export function nomorKeyOfSpan(span: Span): number | undefined {
  const { str } = span;
  // Handle S5 -> 5
  const numberStr = str?.match(/^(l|S|S?[0-9]+)\./)?.[0]?.match(/^(l|S|S?[0-9]+)/)?.[0];
  return safeParseInt(numberStr);
}

export function pasalKeyOfSpan(span: Span): number | undefined {
  const { str } = span;
  if (/^Pasal!? ?/.test(str)) return safeParseInt(str.replace(/^Pasal!? ?/, ''));
  return undefined;
}

export function babKeyOfSpan(span: Span): number | undefined {
  try {
    return toArabic(span.str.replace(/^BAB ?/, ''));
  } catch {
    return undefined;
  }
}

export function bagianKeyOfSpan(span: Span): number | undefined {
  const { str } = span;
  if (!/^Bagian /.test(str)) return undefined;
  const keyStr = str.replace(/^Bagian /, '');
  if (keyStr === 'Kesatu' || keyStr === 'Pertama') return 1;
  if (keyStr === 'Kedua') return 2;
  if (keyStr === 'Ketiga') return 3;
  if (keyStr === 'Keempat') return 4;
  if (keyStr === 'Kelima') return 5;
  if (keyStr === 'Keenam') return 6;
  if (keyStr === 'Ketujuh') return 7;
  if (keyStr === 'Kedelapan') return 8;
  if (keyStr === 'Kesembilan') return 9;
  if (keyStr === 'Kesepuluh') return 10;
  if (keyStr === 'Kesebelas') return 11;
  throw Error(`Bagian key ${keyStr} is unknown on line: ${str}`);
}

export function paragrafKeyOfSpan(span: Span): number | undefined {
  const { str } = span;
  if (!/^Paragraf /.test(str)) return undefined;
  return safeParseInt(str?.replace(/^Paragraf /, ''));
}

export function safeParseInt(str: string | undefined): number | undefined {
  if (isUndefined(str)) return undefined;
  const cleanedStr = clean(str);
  if (!/^[0-9]+$/.test(cleanedStr)) return undefined;
  try {
    const parseResult = parseInt(cleanedStr);
    if (isNaN(parseResult)) return undefined;
    return parseResult;
  } catch {
    return undefined;
  }
}

function clean(str: string): string {
  if (str === 'S5') return '5';
  if (str === 'S1') return '51';
  if (str === 'S') return '5';
  if (str === 'l') return '1';
  return str;
}

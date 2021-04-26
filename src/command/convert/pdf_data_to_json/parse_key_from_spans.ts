import { isUndefined } from 'lodash';
import { toArabic } from 'roman-numerals';
import { neverString, Span } from '../../../util';

export function nomorKeyOfSpan(span: Span): number | undefined {
  const { str } = span;
  // Handle S5 -> 5
  // if (str.startsWith('0.')) return 9;
  const numberStr = str
    ?.match(/^(l|S|(l|S)?[0-9]+)\s?\./)?.[0]
    ?.replace(' ', '')
    .slice(0, -1);
  return safeParseInt(numberStr);
}

export function removeNomorKey(span: Span): Span {
  const str = span.str.split('.').slice(1).join('.').trim();
  return { ...span, str };
}

export function hurufKeyOfSpan(span: Span): number | undefined {
  return span.str
    ?.match(/^([A-Z]|[a-z]|Cc)[.)-]/)?.[0]
    ?.toLowerCase()
    ?.charCodeAt(0);
}

export function removeHurufKey(span: Span): Span {
  const splitter = span.str[1] ?? neverString();
  const str = span.str.split(splitter).slice(1).join(splitter).trim();
  return { ...span, str };
}

export function pasalKeyOfSpan(span: Span): number | undefined {
  const { str } = span;
  if (/^Pasa(l|i)!? ?/.test(str)) return safeParseInt(str.replace(/^Pasa(l|i)!? ?/, ''));
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

export function ayatKeyOf(span: Span): number | undefined {
  const { str } = span;
  if (str.startsWith('(l)')) return 1;
  if (str.startsWith('(S)')) return 5;
  if (str.startsWith('(44')) return 4;
  const firstMatch = str.match(/^\(?S?[0-9]+\)/)?.[0];
  if (!isUndefined(firstMatch)) {
    return safeParseInt(firstMatch?.split(')')?.[0]?.replace('(', '')?.replace('S', ''));
  }
  return undefined;
}
export function removeAyatKey(spans: Span[]): Span[] {
  const [first, ...rest] = spans;
  if (isUndefined(first)) throw Error();
  const newFirst = { ...first, str: ayatFirstStrWithoutKeyOf(first.str) };
  return [newFirst, ...rest];
}

function ayatFirstStrWithoutKeyOf(str: string): string {
  if (str.startsWith('(l)')) return str.slice('(l)'.length).trim();
  return str.split(')').slice(1).join(')').trim();
}

function clean(str: string): string {
  if (str === 'S5') return '5';
  if (str === 'S1') return '51';
  if (str === 'S') return '5';
  if (str === 'l') return '1';
  if (str.includes('l')) return str.replace('l', '1');
  return str.trim();
}

// TODO: http://example.org/legal/document/uu/2020/11/pasal/0081/version/0000000000/point/0038
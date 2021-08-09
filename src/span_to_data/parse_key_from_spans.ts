import { isUndefined } from 'lodash';
import { toArabic } from 'roman-numerals';
import { neverString, Span } from '../util';

export function nomorKeyOfSpan(span: Span): number | undefined {
  const { str } = span;
  // Handle S5 -> 5
  // if (str.startsWith('0.')) return 9;
  // TODO: give example
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
  return (
    span.str
      // TODO: give example
      ?.match(/^([A-Z]|[a-z]|Cc)[.)-]/)?.[0]
      ?.toLowerCase()
      ?.charCodeAt(0)
  );
}

export function removeHurufKey(span: Span): Span {
  const splitter = span.str[1] ?? neverString();
  const str = span.str.split(splitter).slice(1).join(splitter).trim();
  return { ...span, str };
}

export function pasalKeyOfSpan(span: Span): number | undefined {
  const { str } = span;
  // TODO: give example
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
  if (!/^Bagian Ke/.test(str)) return undefined;
  const keyStr = str.replace(/^Bagian /, '').toLowerCase();
  if (keyStr === 'kesatu' || keyStr === 'Pertama') return 1;
  if (/^kedua/.test(keyStr)) return 2;
  if (/^ketiga/.test(keyStr)) return 3;
  if (/^keempat/.test(keyStr)) return 4;
  if (/^kelima/.test(keyStr)) return 5;
  if (/^keenam/.test(keyStr)) return 6;
  if (/^ketujuh/.test(keyStr)) return 7;
  if (/^kedelapan/.test(keyStr)) return 8;
  if (/^kesembilan/.test(keyStr)) return 9;
  if (/^kesepuluh/.test(keyStr)) return 10;
  if (/^kesebelas/.test(keyStr)) return 11;
  if (/^kedua ?belas/.test(keyStr)) return 12;
  if (/^ketiga ?belas/.test(keyStr)) return 13;
  if (/^keempat ?belas/.test(keyStr)) return 14;
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

// TODO: give example
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

// TODO: give example
function ayatFirstStrWithoutKeyOf(str: string): string {
  if (str.startsWith('(l)')) return str.slice('(l)'.length).trim();
  return str.split(')').slice(1).join(')').trim();
}

// TODO: give example
function clean(str: string): string {
  if (str === 'S5') return '5';

  if (str === 'S1') return '51';

  if (str === 'S') return '5';

  if (str === 'l') return '1';

  if (str === '2D') return '2';

  if (str === 'D1') return '21';

  if (str.includes('l')) return str.replace('l', '1');
  return str.trim();
}

// TODO: https://example.org/lex2kg/uu/2020/11/pasal/0081/version/0000000000/point/0038

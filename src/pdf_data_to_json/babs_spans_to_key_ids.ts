import { curry, mean, isUndefined } from 'lodash';
import { lastOf, neverNum, neverString, Span } from '../util';
import {
  babKeyOfSpan,
  bagianKeyOfSpan,
  nomorKeyOfSpan,
  paragrafKeyOfSpan,
  pasalKeyOfSpan,
  safeParseInt,
} from './parse_key_from_spans';

export type KeyIds = {
  babKeyOfid: SpanIdKeyMap<number>;
  lastBabKey?: number;
  bagianKeyOfId: SpanIdKeyMap<number>;
  lastBagianKey?: number;
  paragrafKeyOfId: SpanIdKeyMap<number>;
  lastParagrafKey?: number;
  pasalKeyOfId: SpanIdKeyMap<number>;
  amendPasalKeyOfId: SpanIdKeyMap<string>;
  lastAmendedNomor?: { key: number; id: number };
  lastNomor?: { key: number; id: number };
  lastPasalKey?: number;
  nomorKeyOfId: SpanIdKeyMap<number>;
  amendNomorKeyOfId: SpanIdKeyMap<number>;
  afterPasalXls: number[];
  afterNonPasal: boolean;
};

export type SpanIdKeyMap<T> = { [id: number]: T };

export function babsSpansToKeyIds(hasAmendPasal: boolean, spans: Span[]): KeyIds {
  const initialAcc: KeyIds = {
    babKeyOfid: {},
    bagianKeyOfId: {},
    paragrafKeyOfId: {},
    pasalKeyOfId: {},
    amendPasalKeyOfId: {},
    nomorKeyOfId: {},
    amendNomorKeyOfId: {},
    afterPasalXls: [],
    afterNonPasal: false,
  };
  return spans.reduce(toKeysWith(hasAmendPasal), initialAcc);
}

const toKeysWith = curry(toKeys);

function toKeys(
  hasAmendPasal: boolean,
  acc: KeyIds,
  span: Span,
  idx: number,
  spans: Span[]
): KeyIds {
  const {
    babKeyOfid,
    bagianKeyOfId,
    paragrafKeyOfId,
    pasalKeyOfId,
    amendPasalKeyOfId,
    lastAmendedNomor,
    nomorKeyOfId,
    amendNomorKeyOfId,
    lastNomor,
    afterNonPasal,
    afterPasalXls,
    lastBabKey,
    lastBagianKey,
    lastParagrafKey,
    lastPasalKey,
  } = acc;

  const newBabKey = babKeyOfSpan(span);
  if (isUndefined(lastBabKey)) {
    if (newBabKey !== 1) throw Error('impossible');
    return { ...acc, babKeyOfid: { [span.id]: newBabKey }, lastBabKey: newBabKey };
  }
  if (newBabKey === lastBabKey + 1) {
    return {
      ...acc,
      afterNonPasal: true,
      babKeyOfid: { ...babKeyOfid, [span.id]: newBabKey },
      lastBabKey: newBabKey,
    };
  }

  const newBagianKey = bagianKeyOfSpan(span);
  if (!isUndefined(newBagianKey) && (newBagianKey === 1 || newBagianKey - 1 === lastBagianKey)) {
    return {
      ...acc,
      afterNonPasal: true,
      bagianKeyOfId: { ...bagianKeyOfId, [span.id]: newBagianKey },
      lastBagianKey: newBagianKey,
    };
  }

  const newParagrafKey = paragrafKeyOfSpan(span);
  if (
    !isUndefined(newParagrafKey) &&
    (newParagrafKey === 1 || newParagrafKey - 1 === lastParagrafKey)
  ) {
    return {
      ...acc,
      afterNonPasal: true,
      paragrafKeyOfId: { ...paragrafKeyOfId, [span.id]: newParagrafKey },
      lastParagrafKey: newParagrafKey,
    };
  }

  const newAfterPasal = spans[idx + 1];
  const newPasalKey = pasalKeyOfSpan(span);
  if (!isUndefined(newAfterPasal) && !isUndefined(newPasalKey)) {
    const newAcc: KeyIds = {
      ...acc,
      afterNonPasal: false,
      pasalKeyOfId: { ...pasalKeyOfId, [span.id]: newPasalKey },
      afterPasalXls: [...afterPasalXls, newAfterPasal.xL],
      lastPasalKey: newPasalKey,
    };

    if (isUndefined(lastPasalKey)) {
      if (newPasalKey === 1) return newAcc;
      throw Error('Impossible');
    } else {
      if (newPasalKey === lastPasalKey + 1) {
        if (
          !hasAmendPasal ||
          afterNonPasal ||
          newAfterPasal.str.startsWith('Beberapa ketentuan') ||
          Math.abs(newAfterPasal.xL - mean(afterPasalXls)) < 13
        ) {
          return newAcc;
        }

        const lastAfterPasalXl = lastOf(afterPasalXls);
        if (!isUndefined(lastAfterPasalXl) && Math.abs(newAfterPasal.xL - lastAfterPasalXl) < 1) {
          console.log(`===IRREGULAR_PASAL ${newPasalKey}===`);
          console.log('span:', span);
          console.log('afterPasal:', newAfterPasal);
          console.log('===\n');
          return newAcc;
        }
      }

      // Amended Pasal
      return {
        ...acc,
        afterNonPasal: false,
        amendPasalKeyOfId: { ...amendPasalKeyOfId, [span.id]: `${newPasalKey}` },
        amendNomorKeyOfId: newNomorKeyOfIdOf(amendNomorKeyOfId, lastNomor),
        lastAmendedNomor: lastNomor,
      };
    }
  }

  // Amended Pasal
  const amendedPasalRegexp = /^Pasal [0-9]+[A-Z]+$/;
  if (amendedPasalRegexp.test(span.str)) {
    return {
      ...acc,
      amendPasalKeyOfId: { ...amendPasalKeyOfId, [span.id]: span.str },
      amendNomorKeyOfId: newNomorKeyOfIdOf(amendNomorKeyOfId, lastNomor),
      lastAmendedNomor: lastNomor,
    };
  }
  if (/^[0-9]+. Pasal [0-9]+ dihapus.$/.test(span.str)) {
    const x = span.str.split(' ')[0]?.replaceAll('.', '');
    const amendNomor = safeParseInt(x) ?? neverNum(x);
    const amendedPasalKey = span.str.split(' ')[2] ?? neverString();
    return {
      ...acc,
      amendNomorKeyOfId: { ...amendNomorKeyOfId, [span.id]: amendNomor },
      nomorKeyOfId: { ...nomorKeyOfId, [span.id]: amendNomor },
      amendPasalKeyOfId: { ...amendPasalKeyOfId, [span.id]: amendedPasalKey },
      lastNomor: { id: span.id, key: amendNomor },
    };
  }
  const newNomorKey = nomorKeyOfSpan(span);
  if (!isUndefined(newNomorKey)) {
    return {
      ...acc,
      nomorKeyOfId: { ...nomorKeyOfId, [span.id]: newNomorKey },
      lastNomor: { id: span.id, key: newNomorKey },
    };
  }

  return acc;
}

function newNomorKeyOfIdOf(
  oldKeyOfId: SpanIdKeyMap<number>,
  lastNomor: { id: number; key: number } | undefined
): SpanIdKeyMap<number> {
  if (isUndefined(lastNomor)) return oldKeyOfId;
  return { ...oldKeyOfId, [lastNomor.id]: lastNomor.key };
}

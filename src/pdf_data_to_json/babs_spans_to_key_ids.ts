import { curry, mean, isUndefined } from 'lodash';
import { lastOf, Span } from '../util';
import {
  babKeyOfSpan,
  bagianKeyOfSpan,
  nomorKeyOfSpan,
  paragrafKeyOfSpan,
  pasalKeyOfSpan,
} from './parse_key_from_spans';

export type KeyIds = {
  babKeyOfid: SpanIdKeyMap;
  lastBabKey?: number;
  bagianKeyOfId: SpanIdKeyMap;
  lastBagianKey?: number;
  paragrafKeyOfId: SpanIdKeyMap;
  lastParagrafKey?: number;
  pasalKeyOfId: SpanIdKeyMap;
  amendPasalKeyOfId: SpanIdKeyMap;
  lastPasalKey?: number;
  nomorKeyOfId: SpanIdKeyMap;
  lastNomorKey?: number;
  afterPasalXls: number[];
  afterNonPasal: boolean;
};

export type SpanIdKeyMap = { [id: number]: number };

export function babsSpansToKeyIds(hasAmendPasal: boolean, spans: Span[]): KeyIds {
  const initialAcc: KeyIds = {
    babKeyOfid: {},
    bagianKeyOfId: {},
    paragrafKeyOfId: {},
    pasalKeyOfId: {},
    amendPasalKeyOfId: {},
    nomorKeyOfId: {},
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
    nomorKeyOfId,
    afterNonPasal,
    afterPasalXls,
    lastBabKey,
    lastBagianKey,
    lastParagrafKey,
    lastPasalKey,
    lastNomorKey,
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
      return {
        ...acc,
        afterNonPasal: false,
        amendPasalKeyOfId: { ...amendPasalKeyOfId, [span.id]: newPasalKey },
      };
    }
  }

  const newNomorKey = nomorKeyOfSpan(span);
  if (
    !isUndefined(newNomorKey) &&
    (newNomorKey === 1 || newNomorKey - 1 === lastNomorKey) &&
    Math.abs(span.xL - mean(afterPasalXls)) < 13
  ) {
    return {
      ...acc,
      afterNonPasal: true,
      nomorKeyOfId: { ...nomorKeyOfId, [span.id]: newNomorKey },
      lastNomorKey: newNomorKey,
    };
  }

  return acc;
}

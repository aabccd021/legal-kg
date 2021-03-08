import { curry, mean, chain, isUndefined } from 'lodash';
import { lastOf, Span } from '../util';
import {
  babKeyOfSpan,
  bagianKeyOfSpan,
  paragrafKeyOfSpan,
  pasalKeyOfSpan,
} from './parse_key_from_spans';

export type BabKeySpanIds = {
  babKeyOfid: SpanIdKeyMap;
  lastBabKey?: number;
  bagianKeyOfId: SpanIdKeyMap;
  lastBagianKey?: number;
  paragrafKeyOfId: SpanIdKeyMap;
  lastParagrafKey?: number;
  pasalKeyOfId: SpanIdKeyMap;
  lastPasalKey?: number;
  afterPasalXls: number[];
  afterNonPasal: boolean;
};

export type SpanIdKeyMap = { [id: number]: number };

export function babsSpansToKeyIds(spans: Span[]): BabKeySpanIds {
  const initialAcc: BabKeySpanIds = {
    babKeyOfid: {},
    bagianKeyOfId: {},
    paragrafKeyOfId: {},
    pasalKeyOfId: {},
    afterPasalXls: [],
    afterNonPasal: false,
  };
  const hasAmendPasal = spansHasAmendPasal(spans);
  return spans.reduce(toKeysWith(hasAmendPasal), initialAcc);
}

const toKeysWith = curry(toKeys);

function toKeys(
  hasAmendPasal: boolean,
  acc: BabKeySpanIds,
  span: Span,
  idx: number,
  spans: Span[]
): BabKeySpanIds {
  const {
    babKeyOfid,
    bagianKeyOfId,
    paragrafKeyOfId,
    pasalKeyOfId,
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
  if (isUndefined(newAfterPasal) || isUndefined(newPasalKey)) return acc;

  const newAcc: BabKeySpanIds = {
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
  }
  return acc;
}

function spansHasAmendPasal(spans: Span[]): boolean {
  return chain(spans)
    .reduce<number[]>((xls, span, idx, spans) => {
      if (isUndefined(pasalKeyOfSpan(span))) return xls;
      const afterPasal = spans[idx + 1];
      if (isUndefined(afterPasal)) return xls;
      return [...xls, afterPasal.xL];
    }, [])
    .thru(getStandardDeviation)
    .thru((std) => std > 6)
    .value();
}

function getStandardDeviation(array: number[]): number {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

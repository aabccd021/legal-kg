import { curry, isEmpty, mean, chain, isUndefined } from 'lodash';
import { Span, lastOf } from '../util';
import {
  babKeyOfSpan,
  bagianKeyOfSpan,
  paragrafKeyOfSpan,
  pasalKeyOfSpan,
} from './parse_key_from_spans';

export type BabKeySpanIds = {
  babs: SpanKeyIdx[];
  bagians: SpanKeyIdx[];
  paragrafs: SpanKeyIdx[];
  pasals: PasalSpanKeyIdx[];
  afterNonPasal: boolean;
};

type SpanKeyIdx = { key: number; spanId: number };
type PasalSpanKeyIdx = SpanKeyIdx & { afterPasalXl: number };

export function babsSpansToKeyIds(spans: Span[]): BabKeySpanIds {
  const initialAcc: BabKeySpanIds = {
    babs: [],
    bagians: [],
    paragrafs: [],
    pasals: [],
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
  const { babs, bagians, paragrafs, pasals, afterNonPasal } = acc;

  const newBabKey = babKeyOfSpan(span);
  if (!isUndefined(newBabKey)) {
    if ((newBabKey === 1 && isEmpty(babs)) || newBabKey - 1 === lastOf(babs)?.key) {
      return {
        ...acc,
        afterNonPasal: true,
        babs: [...babs, { key: newBabKey, spanId: span.id }],
      };
    }
  }

  const newBagianKey = bagianKeyOfSpan(span);
  if (!isUndefined(newBagianKey)) {
    if (newBagianKey === 1 || newBagianKey - 1 === lastOf(bagians)?.key) {
      return {
        ...acc,
        afterNonPasal: true,
        bagians: [...bagians, { key: newBagianKey, spanId: span.id }],
      };
    }
  }

  const newParagrafKey = paragrafKeyOfSpan(span);
  if (!isUndefined(newParagrafKey)) {
    if (newParagrafKey === 1 || newParagrafKey - 1 === lastOf(paragrafs)?.key) {
      return {
        ...acc,
        paragrafs: [...paragrafs, { key: newParagrafKey, spanId: span.id }],
        afterNonPasal: true,
      };
    }
  }

  const newAfterPasal = spans[idx + 1];
  const newPasalKey = pasalKeyOfSpan(span);
  if (isUndefined(newAfterPasal) || isUndefined(newPasalKey)) return acc;

  const newAcc: BabKeySpanIds = {
    ...acc,
    afterNonPasal: false,
    pasals: [...pasals, { key: newPasalKey, spanId: span.id, afterPasalXl: newAfterPasal.xL }],
  };

  const lastPasal = lastOf(pasals);
  if (isUndefined(lastPasal)) {
    if (newPasalKey === 1) return newAcc;
  } else {
    if (newPasalKey - 1 === lastPasal.key) {
      if (
        !hasAmendPasal ||
        afterNonPasal ||
        newAfterPasal.str.startsWith('Beberapa ketentuan') ||
        Math.abs(newAfterPasal.xL - mean(pasals.map(({ afterPasalXl }) => afterPasalXl))) < 13
      ) {
        return newAcc;
      }

      if (Math.abs(newAfterPasal.xL - lastPasal.afterPasalXl) < 1) {
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

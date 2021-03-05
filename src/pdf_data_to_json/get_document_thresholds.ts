import { isUndefined } from 'lodash';
import { Span } from '../util';
import { pasalKeyOfSpan } from './parse_key_from_spans';

export type BabsThresholds = { amendPasal?: number };

type SpansStatistics = { afterPasalXls: number[] };

export function getBabsThresholds(spans: Span[]): BabsThresholds {
  const initialStatistics: SpansStatistics = { afterPasalXls: [] };
  const { afterPasalXls } = spans.reduce(toStatistics, initialStatistics);
  const amendPasal = amendPasalThresholdFromXls(afterPasalXls);
  return { amendPasal };
}

function toStatistics(
  statistics: SpansStatistics,
  span: Span,
  idx: number,
  spans: Span[]
): SpansStatistics {
  const { afterPasalXls: xlsAfterPasal } = statistics;
  const newPasalKey = pasalKeyOfSpan(span);

  // span is pasal
  if (isUndefined(newPasalKey)) return statistics;

  const spanAfterPasal = spans.slice(idx + 1)[0];

  // console.log(spanAfterPasal?.pageNum, spanAfterPasal?.str);

  const xlAfterPasal = spanAfterPasal?.xL;
  const newXLAfterPasal = isUndefined(xlAfterPasal)
    ? xlsAfterPasal
    : [...xlsAfterPasal, xlAfterPasal];

  return { afterPasalXls: newXLAfterPasal };
}

// function amendPasalThresholdFromXls(xls: number[]): number | undefined {
//   // if (getStandardDeviation(xls)<6) return undefined;
//   return getMostSparseMidPoint(xls);
// }

// function getStandardDeviation(array: number[]): number {
//   const n = array.length;
//   const mean = array.reduce((a, b) => a + b) / n;
//   return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
// }

function amendPasalThresholdFromXls(xls: number[]): number | undefined {
  const { middle, maxDelta } = xls.reduce<Acc>(
    (acc, cur) => {
      const { prev, maxDelta, middle } = acc;
      const newPrev = cur;
      if (isUndefined(prev)) {
        const newAcc: Acc = { ...acc, prev: newPrev };
        return newAcc;
      }
      const delta = cur - prev;
      const isLarger = delta > maxDelta;
      const newMaxDistance = isLarger ? delta : maxDelta;
      const newMiddle = isLarger ? (cur + prev) / 2 : middle;
      const newAcc: Acc = { maxDelta: newMaxDistance, prev: newPrev, middle: newMiddle };
      return newAcc;
    },
    { maxDelta: 0, middle: 0 }
  );
  console.log('maxdelta', maxDelta);
  console.log('middle', middle);
  if (maxDelta < 34) return undefined;
  return middle;
}

type Acc = {
  prev?: number;
  maxDelta: number;
  middle: number;
};

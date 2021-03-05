import { isUndefined, max, min } from 'lodash';
import { neverNum, Span } from '../util';
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

function amendPasalThresholdFromXls(xls: number[]): number | undefined {
  const xlMax = max(xls) ?? neverNum();
  const xlMin = min(xls) ?? neverNum();
  const xlRange = xlMax - xlMin;

  // if has no amend pasal
  if (xlRange < 90) return undefined;
  return (xlMax + xlMin) / 2;
}

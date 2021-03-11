import {
  AmendDeletePasalPoint,
  AmendedPoint,
  AmendUpdatePasalPoint,
} from './../legal/structure/amend';
import { Paragraf } from './../legal/structure/paragraf';
import { chain, curry, isEmpty, isUndefined } from 'lodash';
import { ReferenceText } from '../legal/reference';
import { Bab } from '../legal/structure/bab';
import { Bagian } from '../legal/structure/bagian';
import { IsiPasal, Pasal } from '../legal/structure/pasal';
import { Span } from '../util';
import { KeyIds } from './babs_spans_to_key_ids';
import { getSpansInRange, spanIdKeyMapOf, toSpansWith } from './util';
import { AmendPoints } from '../legal/structure/amend';

export type Context = {
  hasAmendPasal: boolean;
  keyIds: KeyIds;
};

export function babsOfKeyIds(context: Context, spans: Span[]): Bab[] {
  return chain(spans)
    .thru(toSpansWith(context.keyIds.babKeyOfid))
    .thru(({ spansOfKey }) => spansOfKey)
    .toPairs()
    .map(spansToBabWith(context))
    .value();
}

const spansToBabWith = curry(spansToBab);
function spansToBab(context: Context, keySpans: [string, Span[]]): Bab {
  const { bagianKeyOfId, pasalKeyOfId } = context.keyIds;
  const [key, spans] = keySpans;
  const { spanIdKeyMap, toStructure } = spanIdKeyMapOf(
    [bagianKeyOfId, spansToBagian],
    [pasalKeyOfId, spansToPasal],
    spans,
    context
  );
  const { preKeySpans, spansOfKey } = toSpansWith(spanIdKeyMap, spans);
  const isi = chain(spansOfKey).toPairs().thru<Bagian[] | Pasal[]>(toStructure).value();
  const _judul = preKeySpans.map(({ str }) => str).join(' ');
  const _key = parseInt(key);
  return { _type: 'bab', _key, _judul, isi };
}

function spansToBagian(context: Context, keySpans: [string, Span[]]): Bagian {
  const { paragrafKeyOfId, pasalKeyOfId } = context.keyIds;
  const [key, spans] = keySpans;
  const { spanIdKeyMap, toStructure } = spanIdKeyMapOf(
    [paragrafKeyOfId, spansToParagraf],
    [pasalKeyOfId, spansToPasal],
    spans,
    context
  );
  const { preKeySpans, spansOfKey } = toSpansWith(spanIdKeyMap, spans);
  const isi = chain(spansOfKey).toPairs().thru<Paragraf[] | Pasal[]>(toStructure).value();
  const _judul = preKeySpans.map(({ str }) => str).join(' ');
  const _key = parseInt(key);
  return { _type: 'bagian', _key, _judul, isi };
}

function spansToParagraf(context: Context, keySpans: [string, Span[]]): Paragraf {
  const { pasalKeyOfId } = context.keyIds;
  const [key, spans] = keySpans;
  const { preKeySpans, spansOfKey } = toSpansWith(pasalKeyOfId, spans);
  const isi = chain(spansOfKey).toPairs().map(spansToPasalWith(context)).value();
  const _judul = preKeySpans.map(({ str }) => str).join(' ');
  const _key = parseInt(key);
  return { _type: 'paragraf', _key, _judul, isi };
}

const spansToPasalWith = curry(spansToPasal);
function spansToPasal(context: Context, keySpans: [string, Span[]]): Pasal {
  // const { amendPasalKeyOfId } = context.keyIds;
  const [key, spans] = keySpans;
  // const childStructure = spanIdKeyMapOf(
  //   ['paragraf', paragrafKeyOfId],
  //   ['pasal', pasalKeyOfId],
  //   spans
  // );
  // const spanIdKeyMap = childStructure === 'paragraf' ? paragrafKeyOfId : pasalKeyOfId;
  // const { spansOfKey } = toSpansWith(spanIdKeyMap, spans);
  const isi = isiPasalOf(context, spans);
  const _key = parseInt(key);

  return { _type: 'pasal', _key, isi };
}

function isiPasalOf(context: Context, spans: Span[]): IsiPasal {
  const { keyIds, hasAmendPasal } = context;
  const { amendNomorKeyOfId } = keyIds;
  if (hasAmendPasal && !isEmpty(getSpansInRange(amendNomorKeyOfId, spans))) {
    return amendPointsOf(context, spans);
  }
  return chain(spans)
    .map(({ str }) => str)
    .join(' ')
    .thru(stringToEmptyReference)
    .value();
}

function amendPointsOf(context: Context, spans: Span[]): AmendPoints {
  const { keyIds } = context;
  const { amendNomorKeyOfId } = keyIds;
  const { preKeySpans, spansOfKey } = toSpansWith(amendNomorKeyOfId, spans);
  const isi = chain(spansOfKey).toPairs().map(spansToAmendedPointWith(context)).compact().value();
  const description = chain(preKeySpans)
    .map(({ str }) => str)
    .join(' ')
    .thru(stringToEmptyReference)
    .value();
  return { _type: 'amendPoints', description, isi };
}

const spansToAmendedPointWith = curry(spansToAmendedPoint);
function spansToAmendedPoint(
  context: Context,
  keySpans: [string, Span[]]
): AmendedPoint | undefined {
  // const { keyIds } = context;
  // const { amendPasalKeyOfId } = keyIds;
  // const [key, spans] = keySpans;
  // const _key = parseInt(key);
  // const pasalKeys = uniq(amendPasalKeyOfId[spans[0]?.id ?? neverNum()]);
  // if (isUndefined(pasalKeys)) console.log(spans[0]?.id, spans[0]?.pageNum, spans[0]?.str);
  // const isi = chain(spans)
  //   .map(({ str }) => str)
  //   .join(' ')
  //   .thru(stringToEmptyReference)
  //   .value();
  // return { _type: 'amendedPoint', _key, pasalKeys, isi };

  // const { keyIds } = context;
  // const { amendDeletePasalKeyOfId } = keyIds;
  // const [key, spans] = keySpans;
  // const _key = parseInt(key);
  // const pasalKeys = uniq(amendPasalKeyOfId[spans[0]?.id ?? neverNum()]);
  return (
    spansToAmendDeletePasalPoint(context, keySpans) ??
    spansToAmendUpdatePasalPoint(context, keySpans)
  );
}

function spansToAmendDeletePasalPoint(
  context: Context,
  keySpans: [string, Span[]]
): AmendDeletePasalPoint | undefined {
  const [nomorKey, spans] = keySpans;
  const _nomorKey = parseInt(nomorKey);
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const deletedPasalKey = context.keyIds.amendDeletePasalKeyOfId[firstSpanId];
  if (isUndefined(deletedPasalKey)) return undefined;
  return { _type: 'amendPoint', _nomorKey, _operation: 'delete', _pasalKey: deletedPasalKey };
}

function spansToAmendUpdatePasalPoint(
  context: Context,
  keySpans: [string, Span[]]
): AmendUpdatePasalPoint | undefined {
  const [nomorKey, spans] = keySpans;
  const _nomorKey = parseInt(nomorKey);
  const firstSpanId = spans[0]?.id;
  if (isUndefined(firstSpanId)) return undefined;
  const _pasalKey = context.keyIds.amendUpdatePasalKeyOfId[firstSpanId];
  if (isUndefined(_pasalKey)) return undefined;
  const isi = chain(spans)
    .map(({ str }) => str)
    .join(' ')
    .thru(stringToEmptyReference)
    .value();
  return { _type: 'amendPoint', _operation: 'update', _nomorKey, _pasalKey, isi };
}

// function amendPasalOf(context: Context, spans: Span[]): AmendPoints {
//   const { keyIds } = context;
//   const { amendPasalKeyOfId } = keyIds;
//   const { preKeySpans, spansOfKey } = toSpansWith(amendPasalKeyOfId, spans);
// }

function stringToEmptyReference(text: string): ReferenceText {
  return { _type: 'referenceText', references: [], text };
}

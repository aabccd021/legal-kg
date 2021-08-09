import { curry, mean, isUndefined, isEmpty } from 'lodash';
import { lastOf, neverNum, neverString, Span } from '../util';
import {
  ayatKeyOf,
  babKeyOfSpan,
  bagianKeyOfSpan,
  nomorKeyOfSpan,
  paragrafKeyOfSpan,
  pasalKeyOfSpan,
  safeParseInt,
} from './parse_key_from_spans';

export type KeyIds = {
  spanIdToBabKeyMap: SpanIdToComponentKeyMap<number>;
  lastBabKey?: number;
  spanIdToBagianKeyMap: SpanIdToComponentKeyMap<number>;
  lastBagianKey?: number;
  spanIdToParagrafKeyMap: SpanIdToComponentKeyMap<number>;
  lastParagrafKey?: number;
  spanIdToPasalKeyMap: SpanIdToComponentKeyMap<number>;
  spanIdToAmendPasalKeyMap: SpanIdToComponentKeyMap<string[]>;
  spanIdToDeletePasalKeyMap: SpanIdToComponentKeyMap<string>;
  spanIdToUpdatePasalKeyMap: SpanIdToComponentKeyMap<string>;
  spanIdToInsertPasalKeyMap: SpanIdToComponentKeyMap<Record<number, string>>;
  spanIdToAyatKeyMap: SpanIdToComponentKeyMap<number>;
  lastAyatKey?: number;
  ayatXls: number[];
  spanIdToAmendAyatKeyMap: SpanIdToComponentKeyMap<number>;
  lastAmendAyatKey?: number;
  amendAyatXls: number[];
  lastAmendedNomor?: { key: number; id: number };
  lastNomor?: { key: number; id: number };
  lastPasalKey?: number;
  spanIdToNomorKeyMap: SpanIdToComponentKeyMap<number>;
  spanIdToAmendNomorKeyMap: SpanIdToComponentKeyMap<number>;
  selfAmendPasalKeyOfId: number[];
  afterTruePasal: boolean;
  afterPasalXls: number[];
  afterAbovePasal: boolean;
};

export type SpanIdToComponentKeyMap<T> = { [id: number]: T };

export function babsSpansToKeyIds(
  hasAmendPasal: boolean,
  rootOrganizer: 'bab' | 'pasal',
  spans: Span[]
): KeyIds {
  const initialAcc: KeyIds = {
    spanIdToBabKeyMap: {},
    spanIdToBagianKeyMap: {},
    spanIdToParagrafKeyMap: {},
    spanIdToPasalKeyMap: {},
    spanIdToAmendPasalKeyMap: {},
    spanIdToNomorKeyMap: {},
    spanIdToAmendNomorKeyMap: {},
    spanIdToDeletePasalKeyMap: {},
    spanIdToUpdatePasalKeyMap: {},
    spanIdToInsertPasalKeyMap: {},
    selfAmendPasalKeyOfId: [],
    afterPasalXls: [],
    spanIdToAyatKeyMap: {},
    ayatXls: [],
    spanIdToAmendAyatKeyMap: {},
    amendAyatXls: [],
    afterAbovePasal: false,
    afterTruePasal: false,
  };
  return spans.reduce(toKeysWith(hasAmendPasal, rootOrganizer), initialAcc);
}

const toKeysWith = curry(toKeys);

function toKeys(
  hasAmendPasal: boolean,
  rootOrganizer: 'bab' | 'pasal',
  acc: KeyIds,
  span: Span,
  idx: number,
  spans: Span[]
): KeyIds {
  const {
    spanIdToBabKeyMap,
    spanIdToBagianKeyMap,
    spanIdToParagrafKeyMap,
    spanIdToPasalKeyMap,
    spanIdToAmendPasalKeyMap,
    spanIdToDeletePasalKeyMap,
    spanIdToUpdatePasalKeyMap,
    spanIdToInsertPasalKeyMap,
    lastAmendedNomor,
    spanIdToNomorKeyMap,
    spanIdToAmendNomorKeyMap,
    lastNomor,
    afterAbovePasal,
    afterTruePasal,
    afterPasalXls,
    selfAmendPasalKeyOfId,
    lastBabKey,
    lastBagianKey,
    lastParagrafKey,
    lastPasalKey,
    spanIdToAyatKeyMap,
    ayatXls,
    lastAyatKey,
    spanIdToAmendAyatKeyMap,
    amendAyatXls,
    lastAmendAyatKey,
  } = acc;

  if (rootOrganizer === 'bab') {
    const newBabKey = babKeyOfSpan(span);
    if (isUndefined(lastBabKey)) {
      if (newBabKey !== 1) throw Error('impossible');
      return { ...acc, spanIdToBabKeyMap: { [span.id]: newBabKey }, lastBabKey: newBabKey };
    }
    if (newBabKey === lastBabKey + 1) {
      return {
        ...acc,
        afterAbovePasal: true,
        spanIdToBabKeyMap: { ...spanIdToBabKeyMap, [span.id]: newBabKey },
        lastBabKey: newBabKey,
      };
    }
  }

  const newBagianKey = bagianKeyOfSpan(span);
  if (!isUndefined(newBagianKey) && (newBagianKey === 1 || newBagianKey - 1 === lastBagianKey)) {
    return {
      ...acc,
      afterAbovePasal: true,
      spanIdToBagianKeyMap: { ...spanIdToBagianKeyMap, [span.id]: newBagianKey },
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
      afterAbovePasal: true,
      spanIdToParagrafKeyMap: { ...spanIdToParagrafKeyMap, [span.id]: newParagrafKey },
      lastParagrafKey: newParagrafKey,
    };
  }

  // Amended Hapus Pasal
  if (/^[0-9]+\. Pasal [0-9]+[A-Z]? dihapus\.$/.test(span.str)) {
    const nomorStr = span.str.split(' ')[0]?.replaceAll('.', '');
    const amendNomor = safeParseInt(nomorStr) ?? neverNum(nomorStr);
    const amendedPasalKey = span.str.split(' ')[2] ?? neverString();
    const newLastNomor = { id: span.id, key: amendNomor };

    if (newLastNomor.key !== 1 && newLastNomor.key - 1 !== lastAmendedNomor?.key) {
      console.log(
        'EXCEPTION 1',
        `{PAGE ${span.pageNum}}`,
        JSON.stringify(newLastNomor),
        JSON.stringify(lastAmendedNomor),
        span.str
      );
    }

    return {
      ...acc,
      spanIdToAmendNomorKeyMap: { ...spanIdToAmendNomorKeyMap, [span.id]: amendNomor },
      spanIdToNomorKeyMap: { ...spanIdToNomorKeyMap, [span.id]: amendNomor },
      spanIdToAmendPasalKeyMap: newAmendPasalKeyOfIdOf(
        spanIdToAmendPasalKeyMap,
        span.id,
        amendedPasalKey
      ),
      spanIdToDeletePasalKeyMap: { ...spanIdToDeletePasalKeyMap, [span.id]: amendedPasalKey },
      lastNomor: newLastNomor,
      lastAmendedNomor: newLastNomor,
      afterTruePasal: false,
    };
  }

  // Amended Ubah Pasal
  if (/^S?[0-9]+(\.|,) (Ketentuan|Penjelasan) Pasal [0-9]+[A-Z]?/.test(span.str)) {
    const nomorStr = span.str.split(' ')[0]?.replaceAll('.', '')?.replaceAll(',', '');
    const amendNomor = safeParseInt(nomorStr) ?? neverNum(nomorStr);
    const amendedPasalKey = span.str.split(' ')[3] ?? neverString();
    const newLastNomor = { id: span.id, key: amendNomor };

    if (
      newLastNomor.key !== 1 &&
      newLastNomor.key - 1 !== lastAmendedNomor?.key &&
      newLastNomor.key !== lastAmendedNomor?.key
    ) {
      console.log(
        'EXCEPTION 3',
        `{PAGE ${span.pageNum}}`,
        JSON.stringify(newLastNomor),
        JSON.stringify(lastAmendedNomor),
        span.str
      );
    }

    return {
      ...acc,
      spanIdToAmendNomorKeyMap: { ...spanIdToAmendNomorKeyMap, [span.id]: amendNomor },
      spanIdToAmendPasalKeyMap: newAmendPasalKeyOfIdOf(
        spanIdToAmendPasalKeyMap,
        span.id,
        amendedPasalKey
      ),
      spanIdToUpdatePasalKeyMap: { ...spanIdToUpdatePasalKeyMap, [span.id]: amendedPasalKey },
      spanIdToNomorKeyMap: { ...spanIdToNomorKeyMap, [span.id]: amendNomor },
      lastNomor: newLastNomor,
      lastAmendedNomor: newLastNomor,
      afterTruePasal: false,
    };
  }

  if (/^[0-9]+\. Di antara (Pasal|Bab)/.test(span.str)) {
    const nomorStr = span.str.split(' ')[0]?.replaceAll('.', '');
    const amendNomor = safeParseInt(nomorStr) ?? neverNum(nomorStr);
    const newLastNomor = { id: span.id, key: amendNomor };
    return {
      ...acc,
      spanIdToAmendNomorKeyMap: { ...spanIdToAmendNomorKeyMap, [span.id]: amendNomor },
      spanIdToInsertPasalKeyMap: { ...spanIdToInsertPasalKeyMap, [span.id]: {} },
      spanIdToNomorKeyMap: { ...spanIdToNomorKeyMap, [span.id]: amendNomor },
      lastNomor: newLastNomor,
      lastAmendedNomor: newLastNomor,
      afterTruePasal: false,
    };
  }

  if (/^[0-9]+\. Ketentuan judul BAB/.test(span.str)) {
    const nomorStr = span.str.split(' ')[0]?.replaceAll('.', '');
    const amendNomor = safeParseInt(nomorStr) ?? neverNum(nomorStr);
    const newLastNomor = { id: span.id, key: amendNomor };
    return {
      ...acc,
      spanIdToAmendNomorKeyMap: { ...spanIdToAmendNomorKeyMap, [span.id]: amendNomor },
      spanIdToNomorKeyMap: { ...spanIdToNomorKeyMap, [span.id]: amendNomor },
      lastNomor: newLastNomor,
      lastAmendedNomor: newLastNomor,
      afterTruePasal: false,
    };
  }

  const newAfterPasal = spans[idx + 1];
  const newPasalKey = pasalKeyOfSpan(span);
  if (!isUndefined(newAfterPasal) && !isUndefined(newPasalKey)) {
    // True Pasal
    const newAcc: KeyIds = {
      ...acc,
      afterAbovePasal: false,
      spanIdToPasalKeyMap: { ...spanIdToPasalKeyMap, [span.id]: newPasalKey },
      afterPasalXls: [...afterPasalXls, newAfterPasal.xL],
      lastPasalKey: newPasalKey,
      afterTruePasal: true,
    };

    if (isUndefined(lastPasalKey)) {
      if (newPasalKey === 1) return newAcc;
      throw Error(`Impossible ${JSON.stringify({ newPasalKey, lastPasalKey, span })}`);
    } else {
      if (newPasalKey === lastPasalKey + 1) {
        if (
          !hasAmendPasal ||
          afterAbovePasal ||
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

      if (
        !isUndefined(lastNomor) &&
        lastNomor.key !== 1 &&
        lastNomor.key - 1 !== lastAmendedNomor?.key &&
        lastNomor.key !== lastAmendedNomor?.key
      ) {
        console.log(
          'EXCEPTION 2',
          `{PAGE ${span.pageNum}}`,
          span.str,
          JSON.stringify(lastNomor),
          JSON.stringify(lastAmendedNomor)
        );
      }
      // Amended Pasal
      return {
        ...acc,
        afterAbovePasal: false,
        spanIdToAmendPasalKeyMap: newAmendPasalKeyOfIdOf(
          spanIdToAmendPasalKeyMap,
          lastNomor?.id,
          `${newPasalKey}`
        ),
        spanIdToAmendNomorKeyMap: newNomorKeyOfIdOf(spanIdToAmendNomorKeyMap, lastNomor),
        spanIdToInsertPasalKeyMap: newAmendInsertPasalKeyOfIdOf(acc, lastNomor?.id, {
          [span.id]: `${newPasalKey}`,
        }),
        selfAmendPasalKeyOfId: [...selfAmendPasalKeyOfId, span.id],
        lastAmendedNomor: lastNomor,
        afterTruePasal: false,
        amendAyatXls: [],
      };
    }
  }

  // Amended Pasal
  // handle `Pasal DD2A` -> `Pasal 22A`
  // handle `Pasal S51A` -> `Pasal 51A`
  // handle `Pasal 3DA` -> `Pasal 32A`
  // TODO: give example
  if (/^Pasal (S|DD)?[0-9]+[A-Z]{0,2}$/.test(span.str)) {
    if (
      !isUndefined(lastNomor) &&
      lastNomor.key !== 1 &&
      lastNomor.key - 1 !== lastAmendedNomor?.key &&
      lastNomor.key !== lastAmendedNomor?.key &&
      !afterTruePasal
    )
      throw Error(
        JSON.stringify(span) + JSON.stringify(lastNomor) + JSON.stringify(lastAmendedNomor)
      );

    const newPasalKey = span.str.slice('Pasal '.length);
    return {
      ...acc,
      afterAbovePasal: false,
      spanIdToAmendPasalKeyMap: newAmendPasalKeyOfIdOf(
        spanIdToAmendPasalKeyMap,
        lastNomor?.id,
        newPasalKey
      ),
      spanIdToAmendNomorKeyMap: newNomorKeyOfIdOf(spanIdToAmendNomorKeyMap, lastNomor),
      spanIdToInsertPasalKeyMap: newAmendInsertPasalKeyOfIdOf(acc, lastNomor?.id, {
        [span.id]: newPasalKey,
      }),
      selfAmendPasalKeyOfId: [...selfAmendPasalKeyOfId, span.id],
      lastAmendedNomor: lastNomor,
      afterTruePasal: false,
      amendAyatXls: [],
    };
  }

  const newAyatKey = ayatKeyOf(span);

  if (!isUndefined(newAyatKey) && (newAyatKey === 1 || newAyatKey - 1 === lastAyatKey)) {
    const ayatXlsMean = mean(ayatXls);

    // TODO: give example
    if (isEmpty(ayatXls) || span.xL < ayatXlsMean || span.xL - ayatXlsMean < 9) {
      return {
        ...acc,
        spanIdToAyatKeyMap: { ...spanIdToAyatKeyMap, [span.id]: newAyatKey },
        lastAyatKey: newAyatKey,
        ayatXls: [...ayatXls, span.xL],
      };
    }
  }

  if (!isUndefined(newAyatKey) && (newAyatKey === 1 || newAyatKey - 1 === lastAmendAyatKey)) {
    const amendAyatXlsMean = mean(amendAyatXls);
    if (isEmpty(amendAyatXls) || Math.abs(amendAyatXlsMean - span.xL) < 20) {
      return {
        ...acc,
        spanIdToAmendAyatKeyMap: { ...spanIdToAmendAyatKeyMap, [span.id]: newAyatKey },
        lastAmendAyatKey: newAyatKey,
        amendAyatXls: [...amendAyatXls, span.xL],
      };
    }
  }

  const detectedNomorKey = nomorKeyOfSpan(span);
  if (!isUndefined(detectedNomorKey)) {
    const newNomorKey = getNewNomorKey(detectedNomorKey, lastNomor?.key);
    return {
      ...acc,
      spanIdToNomorKeyMap: { ...spanIdToNomorKeyMap, [span.id]: newNomorKey },
      lastNomor: { id: span.id, key: newNomorKey },
    };
  }
  return acc;
}

function getNewNomorKey(detectedNomorKey: number, lastNomorKey: number | undefined): number {
  if (isUndefined(lastNomorKey)) return detectedNomorKey;
  const zeroReplacement = lastNomorKey + 1;
  const keyStr = `${detectedNomorKey}`;
  if (parseInt(keyStr.replace('0', '9')) === zeroReplacement) return zeroReplacement;
  return detectedNomorKey;
}

function newNomorKeyOfIdOf(
  oldKeyOfId: SpanIdToComponentKeyMap<number>,
  lastNomor: { id: number; key: number } | undefined
): SpanIdToComponentKeyMap<number> {
  if (isUndefined(lastNomor)) return oldKeyOfId;
  return { ...oldKeyOfId, [lastNomor.id]: lastNomor.key };
}
function newAmendPasalKeyOfIdOf(
  amendPasalKeyOfId: SpanIdToComponentKeyMap<string[]>,
  lastNomorId: number | undefined,
  newPasalKey: string
): SpanIdToComponentKeyMap<string[]> {
  if (isUndefined(lastNomorId)) return amendPasalKeyOfId;
  const newAmendedPasalKey = [...(amendPasalKeyOfId[lastNomorId] ?? []), newPasalKey];
  return { ...amendPasalKeyOfId, [lastNomorId]: newAmendedPasalKey };
}

function newAmendInsertPasalKeyOfIdOf(
  keyIds: KeyIds,
  lastNomorId: number | undefined,
  newPasalKeySpan: Record<number, string>
): SpanIdToComponentKeyMap<Record<number, string>> {
  const { spanIdToInsertPasalKeyMap } = keyIds;
  if (isUndefined(lastNomorId)) return spanIdToInsertPasalKeyMap;
  const amendedPasalKey = spanIdToInsertPasalKeyMap[lastNomorId];
  if (isUndefined(amendedPasalKey)) return spanIdToInsertPasalKeyMap;
  const newAmendedPasalKey = { ...amendedPasalKey, ...newPasalKeySpan };
  return { ...spanIdToInsertPasalKeyMap, [lastNomorId]: newAmendedPasalKey };
}

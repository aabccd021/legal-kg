import { curry, mean, isUndefined, isEmpty } from 'lodash';
import { lastOf, neverNum, neverString, Span } from '../../../util';
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
  babKeyOfid: SpanIdKeyMap<number>;
  lastBabKey?: number;
  bagianKeyOfId: SpanIdKeyMap<number>;
  lastBagianKey?: number;
  paragrafKeyOfId: SpanIdKeyMap<number>;
  lastParagrafKey?: number;
  pasalKeyOfId: SpanIdKeyMap<number>;
  amendPasalKeyOfId: SpanIdKeyMap<string[]>;
  amendDeletePasalKeyOfId: SpanIdKeyMap<string>;
  amendUpdatePasalKeyOfId: SpanIdKeyMap<string>;
  amendInsertPasalKeyOfId: SpanIdKeyMap<string[]>;
  ayatKeyOfId: SpanIdKeyMap<number>;
  lastAyatKey?: number;
  ayatXls: number[];
  amendAyatKeyOfId: SpanIdKeyMap<number>;
  lastAmendAyatKey?: number;
  amendAyatXls: number[];
  lastAmendedNomor?: { key: number; id: number };
  lastNomor?: { key: number; id: number };
  lastPasalKey?: number;
  nomorKeyOfId: SpanIdKeyMap<number>;
  amendNomorKeyOfId: SpanIdKeyMap<number>;
  selfAmendPasalKeyOfId: number[];
  afterTruePasal: boolean;
  afterPasalXls: number[];
  afterAbovePasal: boolean;
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
    amendDeletePasalKeyOfId: {},
    amendUpdatePasalKeyOfId: {},
    amendInsertPasalKeyOfId: {},
    selfAmendPasalKeyOfId: [],
    afterPasalXls: [],
    ayatKeyOfId: {},
    ayatXls: [],
    amendAyatKeyOfId: {},
    amendAyatXls: [],
    afterAbovePasal: false,
    afterTruePasal: false,
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
    amendDeletePasalKeyOfId,
    amendUpdatePasalKeyOfId,
    amendInsertPasalKeyOfId,
    lastAmendedNomor,
    nomorKeyOfId,
    amendNomorKeyOfId,
    lastNomor,
    afterAbovePasal,
    afterTruePasal,
    afterPasalXls,
    selfAmendPasalKeyOfId,
    lastBabKey,
    lastBagianKey,
    lastParagrafKey,
    lastPasalKey,
    ayatKeyOfId,
    ayatXls,
    lastAyatKey,
    amendAyatKeyOfId,
    amendAyatXls,
    lastAmendAyatKey,
  } = acc;

  const newBabKey = babKeyOfSpan(span);
  if (isUndefined(lastBabKey)) {
    if (newBabKey !== 1) throw Error('impossible');
    return { ...acc, babKeyOfid: { [span.id]: newBabKey }, lastBabKey: newBabKey };
  }
  if (newBabKey === lastBabKey + 1) {
    return {
      ...acc,
      afterAbovePasal: true,
      babKeyOfid: { ...babKeyOfid, [span.id]: newBabKey },
      lastBabKey: newBabKey,
    };
  }

  const newBagianKey = bagianKeyOfSpan(span);
  if (!isUndefined(newBagianKey) && (newBagianKey === 1 || newBagianKey - 1 === lastBagianKey)) {
    return {
      ...acc,
      afterAbovePasal: true,
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
      afterAbovePasal: true,
      paragrafKeyOfId: { ...paragrafKeyOfId, [span.id]: newParagrafKey },
      lastParagrafKey: newParagrafKey,
    };
  }

  // Amended Hapus Pasal
  if (/^[0-9]+\. Pasal [0-9]+[A-Z]? dihapus.$/.test(span.str)) {
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
      amendNomorKeyOfId: { ...amendNomorKeyOfId, [span.id]: amendNomor },
      nomorKeyOfId: { ...nomorKeyOfId, [span.id]: amendNomor },
      amendPasalKeyOfId: newAmendPasalKeyOfIdOf(amendPasalKeyOfId, span.id, amendedPasalKey),
      amendDeletePasalKeyOfId: { ...amendDeletePasalKeyOfId, [span.id]: amendedPasalKey },
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
      amendNomorKeyOfId: { ...amendNomorKeyOfId, [span.id]: amendNomor },
      amendPasalKeyOfId: newAmendPasalKeyOfIdOf(amendPasalKeyOfId, span.id, amendedPasalKey),
      amendUpdatePasalKeyOfId: { ...amendUpdatePasalKeyOfId, [span.id]: amendedPasalKey },
      nomorKeyOfId: { ...nomorKeyOfId, [span.id]: amendNomor },
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
      amendNomorKeyOfId: { ...amendNomorKeyOfId, [span.id]: amendNomor },
      amendInsertPasalKeyOfId: { ...amendInsertPasalKeyOfId, [span.id]: [] },
      nomorKeyOfId: { ...nomorKeyOfId, [span.id]: amendNomor },
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
      amendNomorKeyOfId: { ...amendNomorKeyOfId, [span.id]: amendNomor },
      nomorKeyOfId: { ...nomorKeyOfId, [span.id]: amendNomor },
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
      pasalKeyOfId: { ...pasalKeyOfId, [span.id]: newPasalKey },
      afterPasalXls: [...afterPasalXls, newAfterPasal.xL],
      lastPasalKey: newPasalKey,
      afterTruePasal: true,
    };

    if (isUndefined(lastPasalKey)) {
      if (newPasalKey === 1) return newAcc;
      throw Error('Impossible');
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
        amendPasalKeyOfId: newAmendPasalKeyOfIdOf(
          amendPasalKeyOfId,
          lastNomor?.id,
          `${newPasalKey}`
        ),
        amendNomorKeyOfId: newNomorKeyOfIdOf(amendNomorKeyOfId, lastNomor),
        amendInsertPasalKeyOfId: newAmendInsertPasalKeyOfIdOf(
          amendInsertPasalKeyOfId,
          lastNomor?.id,
          `${newPasalKey}`
        ),
        selfAmendPasalKeyOfId: [...selfAmendPasalKeyOfId, span.id],
        lastAmendedNomor: lastNomor,
        afterTruePasal: false,
      };
    }
  }

  // Amended Pasal
  // handle `Pasal DD2A` -> `Pasal 22A`
  // handle `Pasal S51A` -> `Pasal 51A`
  // handle `Pasal 3DA` -> `Pasal 32A`
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
      amendPasalKeyOfId: newAmendPasalKeyOfIdOf(amendPasalKeyOfId, lastNomor?.id, newPasalKey),
      amendNomorKeyOfId: newNomorKeyOfIdOf(amendNomorKeyOfId, lastNomor),
      amendInsertPasalKeyOfId: newAmendInsertPasalKeyOfIdOf(
        amendInsertPasalKeyOfId,
        lastNomor?.id,
        newPasalKey
      ),
      selfAmendPasalKeyOfId: [...selfAmendPasalKeyOfId, span.id],
      lastAmendedNomor: lastNomor,
      afterTruePasal: false,
    };
  }

  const newAyatKey = ayatKeyOf(span);

  if (
    !isUndefined(newAyatKey) &&
    (newAyatKey === 1 || newAyatKey - 1 === lastAyatKey) &&
    (isEmpty(ayatXls) || Math.abs(mean(ayatXls) - span.xL) < 13)
  ) {
    return {
      ...acc,
      ayatKeyOfId: { ...ayatKeyOfId, [span.id]: newAyatKey },
      lastAyatKey: newAyatKey,
      ayatXls: [...ayatXls, span.xL],
    };
  }

  if (
    !isUndefined(newAyatKey) &&
    (newAyatKey === 1 || newAyatKey - 1 === lastAmendAyatKey) &&
    (isEmpty(amendAyatXls) || Math.abs(mean(amendAyatXls) - span.xL) < 15)
  ) {
    return {
      ...acc,
      amendAyatKeyOfId: { ...amendAyatKeyOfId, [span.id]: newAyatKey },
      lastAmendAyatKey: newAyatKey,
      amendAyatXls: [...amendAyatXls, span.xL],
    };
  }

  const newNomorKey = nomorKeyOfSpan(span);
  if (!isUndefined(newNomorKey)) {
    // console.log(span.str);
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
function newAmendPasalKeyOfIdOf(
  amendPasalKeyOfId: SpanIdKeyMap<string[]>,
  lastNomorId: number | undefined,
  newPasalKey: string
): SpanIdKeyMap<string[]> {
  if (isUndefined(lastNomorId)) return amendPasalKeyOfId;
  const newAmendedPasalKey = [...(amendPasalKeyOfId[lastNomorId] ?? []), newPasalKey];
  return { ...amendPasalKeyOfId, [lastNomorId]: newAmendedPasalKey };
}

function newAmendInsertPasalKeyOfIdOf(
  amendInsertPasalKeyOfId: SpanIdKeyMap<string[]>,
  lastNomorId: number | undefined,
  newPasalKey: string
): SpanIdKeyMap<string[]> {
  if (isUndefined(lastNomorId)) return amendInsertPasalKeyOfId;
  const amendedPasalKey = amendInsertPasalKeyOfId[lastNomorId];
  if (isUndefined(amendedPasalKey)) return amendInsertPasalKeyOfId;
  const newAmendedPasalKey = [...amendedPasalKey, newPasalKey];
  return { ...amendInsertPasalKeyOfId, [lastNomorId]: newAmendedPasalKey };
}

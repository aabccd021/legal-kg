import { assertNever } from 'assert-never';
import { DocumentNode, getDocumentPath } from './document';
import { ComponentNode } from './component';
import { isString, reduce, isUndefined } from 'lodash';
import { getConfig } from './config';
import { safeParseInt } from './span_to_data/parse_key_from_spans';

export type LegalNode = DocumentNode | ComponentNode;

export type DateNode = {
  nodeType: 'date';
  date: number;
  month: number;
  year: number;
};

export function nodeToUri(node: LegalNode): string {
  if (node.nodeType === 'ayat')
    return `${nodeToUri(node.parentAyatSetNode)}/${padStartIfNumber(node.key)}`;
  if (node.nodeType === 'daftarAyat') return `${nodeToUri(node.parentPasalVersionNode)}/ayat`;
  if (node.nodeType === 'bab')
    return `${nodeToUri(node.parentBabSetNode)}/${padStartIfNumber(node.key)}`;
  if (node.nodeType === 'babSet') return `${nodeToUri(node.parentDocumentNode)}/bab`;
  if (node.nodeType === 'bagian')
    return `${nodeToUri(node.parentBagianSetNode)}/${padStartIfNumber(node.key)}`;
  if (node.nodeType === 'daftarBagian') return `${nodeToUri(node.parentBabNode)}/bagian`;
  if (node.nodeType === 'peraturan') return `${getConfig().uriBase}/${getDocumentPath(node)}`;
  if (node.nodeType === 'paragraf')
    return `${nodeToUri(node.parentParagrafSetNode)}/${padStartIfNumber(node.key)}`;
  if (node.nodeType === 'daftarParagraf') return `${nodeToUri(node.parentBagianNode)}/paragraf`;
  if (node.nodeType === 'pasal')
    return `${nodeToUri(node.parentNode)}/pasal/${padPasalIfNumber(node.key)}`;
  if (node.nodeType === 'daftarPasal') return `${nodeToUri(node.parentNode)}/daftarPasal`;
  if (node.nodeType === 'versiPasal') {
    const yearStr = padStartIfNumber(node.version.year, { pad: 4 });
    const monthStr = padStartIfNumber(node.version.month, { pad: 2 });
    const dateStr = padStartIfNumber(node.version.date, { pad: 2 });
    return `${nodeToUri(node.parentPasalNode)}/versi/${yearStr}${monthStr}${dateStr}`;
  }
  if (node.nodeType === 'huruf')
    return `${nodeToUri(node.parentPointSetNode)}/${padStartIfNumber(node.key)}`;
  if (node.nodeType === 'daftarHuruf') return `${nodeToUri(node.parentNode)}/huruf`;
  if (node.nodeType === 'segmen') return `${nodeToUri(node.parentNode)}/${node.textName}`;
  if (node.nodeType === 'menimbang') return `${nodeToUri(node.parentNode)}/menimbang`;
  if (node.nodeType === 'mengingat') return `${nodeToUri(node.parentNode)}/mengingat`;
  assertNever(node);
}

export function padStartIfNumber(x: string | number, arg?: { pad: number }): string {
  if (isString(x)) {
    const xNumber = safeParseInt(x);
    if (isUndefined(xNumber)) return x;
    return `${xNumber}`.padStart(arg?.pad ?? 4, '0');
  }
  return `${x}`.padStart(arg?.pad ?? 4, '0');
}

function padPasalIfNumber(x: string | number, arg?: { pad: number }): string {
  if (isString(x)) {
    const splitPoint = reduce(
      x,
      ({ splitIdx, ended }, char, idx) => {
        if (ended) return { splitIdx, ended };
        const charAsNumber = safeParseInt(char);
        if (isUndefined(charAsNumber)) return { splitIdx, ended: true };
        return { splitIdx: idx, ended };
      },
      { splitIdx: -1, ended: false }
    );
    const numberStr = x.slice(0, splitPoint.splitIdx + 1);
    const strStr = x.slice(splitPoint.splitIdx + 1);
    return numberStr.padStart(arg?.pad ?? 4, '0') + strStr;
  }
  return `${x}`.padStart(arg?.pad ?? 4, '0');
}
export function getOntologyBaseUri(): string {
  const { uriBase } = getConfig();
  return `${uriBase}/ontology`;
}

import { assertNever } from 'assert-never';
import { getConfig } from '../config';
import { DocumentNode, getDocumentPath } from './document';
import { ComponentNode } from './component';
import { isString, reduce, isUndefined } from 'lodash';
import { safeParseInt } from '../command/convert/pdf_data_to_json/parse_key_from_spans';

export type LegalNode = DocumentNode | ComponentNode;

export function nodeToUri(node: LegalNode): string {
  if (node.nodeType === 'ayat')
    return `${nodeToUri(node.parentAyatSetNode)}/${padStartIfNumber(node.key)}`;
  if (node.nodeType === 'ayatSet') return `${nodeToUri(node.parentPasalVersionNode)}/ayat`;
  if (node.nodeType === 'bab')
    return `${nodeToUri(node.parentBabSetNode)}/${padStartIfNumber(node.key)}`;
  if (node.nodeType === 'babSet') return `${nodeToUri(node.parentDocumentNode)}/bab`;
  if (node.nodeType === 'bagian')
    return `${nodeToUri(node.parentBagianSetNode)}/${padStartIfNumber(node.key)}`;
  if (node.nodeType === 'bagianSet') return `${nodeToUri(node.parentBabNode)}/bagian`;
  if (node.nodeType === 'document')
    return `${getConfig().uriBase}/document/${getDocumentPath(node)}`;
  if (node.nodeType === 'paragraf')
    return `${nodeToUri(node.parentParagrafSetNode)}/${padStartIfNumber(node.key)}`;
  if (node.nodeType === 'paragrafSet') return `${nodeToUri(node.parentBagianNode)}/paragraf`;
  if (node.nodeType === 'pasal')
    return `${nodeToUri(node.parentNode)}/pasal/${padPasalIfNumber(node.key)}`;
  if (node.nodeType === 'pasalSet') return `${nodeToUri(node.parentNode)}/pasals`;
  if (node.nodeType === 'pasalVersion')
    return `${nodeToUri(node.parentPasalNode)}/version/${padStartIfNumber(node.timeCreatedEpoch, {
      pad: 10,
    })}`;
  if (node.nodeType === 'point')
    return `${nodeToUri(node.parentPointSetNode)}/${padStartIfNumber(node.key)}`;
  if (node.nodeType === 'pointSet') return `${nodeToUri(node.parentNode)}/point`;
  if (node.nodeType === 'text') return `${nodeToUri(node.parentNode)}/${node.textName}`;
  assertNever(node);
}

function padStartIfNumber(x: string | number, arg?: { pad: number }): string {
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
    console.log({ x, numberStr, strStr });
    return numberStr.padStart(arg?.pad ?? 4, '0') + strStr;
  }
  return `${x}`.padStart(arg?.pad ?? 4, '0');
}
export function getOntologyBaseUri(): string {
  const { uriBase } = getConfig();
  return `${uriBase}/ontology`;
}

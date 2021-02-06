import { assertNever } from 'assert-never';
import {
  DocumentStructureTrace,
  getAyatUri,
  getMetadataUri,
  getPasalUri,
  getPointUri,
  getParagrafUri,
  getBagianUri,
  getBabUri,
} from './document-structure';
import { DocumentTrace, getDocumentUri, isDocumentTrace } from './document-type';

export type LegalTrace = DocumentTrace | DocumentStructureTrace;

export function getLegalUri(trace: LegalTrace): string {
  if (isDocumentTrace(trace)) return getDocumentUri(trace);
  if (trace._structureType === 'point') return getPointUri(trace);
  if (trace._structureType === 'ayat') return getAyatUri(trace);
  if (trace._structureType === 'pasal') return getPasalUri(trace);
  if (trace._structureType === 'metadata') return getMetadataUri(trace);
  if (trace._structureType === 'paragraf') return getParagrafUri(trace);
  if (trace._structureType === 'bagian') return getBagianUri(trace);
  if (trace._structureType === 'bab') return getBabUri(trace);
  assertNever(trace);
}

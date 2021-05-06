import { _DocumentHandler } from './_utils';

export type UudNode = {
  nodeType: 'document';
  docType: 'uud';
};

export const _uud: _DocumentHandler<UudNode> = {
  nodeOfPath: () => ({ docType: 'uud', nodeType: 'document' }),
  getPath: () => 'UUD',
  getName: () => 'UNDANG-UNDANG DASAR NEGARA REPUBLIK INDONESIA TAHUN 1945',
};

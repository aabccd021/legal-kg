import { _DocumentHandler } from './_utils';

export type UudNode = {
  _documentType: 'uud';
};

export const _uud: _DocumentHandler<UudNode> = {
  getPath: () => 'UUD',
  getName: () => 'UNDANG-UNDANG DASAR NEGARA REPUBLIK INDONESIA TAHUN 1945',
};

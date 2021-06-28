export type LegislationTypeNode =
  | LT_UUD_Node
  | LT_TapMPR_Node
  | LT_UU_Node
  | LT_Perpu_Node
  | LT_PP_Node
  | LT_Perpres_Node
  | LT_PeraturanMenteri_Node
  | LT_PerdaProvinsi_Node
  | LT_PeraturanGubernur_Node
  | LT_PerdaKabKota_Node
  | LT_PeraturanBupatiWalikota_Node
  | LT_KeputusanPresiden_Node
  | LT_KeputusanGubernur_Node
  | LT_KeputusanMenteri_Node
  | LT_KeputusanBupatiWalikota_Node;

export type LT_UUD_Node = {
  nodeType: 'legislationType';
  legislationType: 'UUD';
};

export type LT_TapMPR_Node = {
  nodeType: 'legislationType';
  legislationType: 'TapMPR';
};

export type LT_UU_Node = {
  nodeType: 'legislationType';
  legislationType: 'UU';
};

export type LT_Perpu_Node = {
  nodeType: 'legislationType';
  legislationType: 'Perpu';
};

export type LT_PP_Node = {
  nodeType: 'legislationType';
  legislationType: 'PP';
};

export type LT_Perpres_Node = {
  nodeType: 'legislationType';
  legislationType: 'Perpres';
};

export type LT_PeraturanMenteri_Node = {
  nodeType: 'legislationType';
  legislationType: 'PeraturanMenteri';
};

export type LT_PerdaProvinsi_Node = {
  nodeType: 'legislationType';
  legislationType: 'PerdaProvinsi';
};

export type LT_PeraturanGubernur_Node = {
  nodeType: 'legislationType';
  legislationType: 'PeraturanGubernur';
};

export type LT_PerdaKabKota_Node = {
  nodeType: 'legislationType';
  legislationType: 'PerdaKabKota';
};

export type LT_PeraturanBupatiWalikota_Node = {
  nodeType: 'legislationType';
  legislationType: 'PeraturanBupatiWalikota';
};

export type LT_KeputusanPresiden_Node = {
  nodeType: 'legislationType';
  legislationType: 'KeputusanPresiden';
};

export type LT_KeputusanGubernur_Node = {
  nodeType: 'legislationType';
  legislationType: 'KeputusanGubernur';
};

export type LT_KeputusanMenteri_Node = {
  nodeType: 'legislationType';
  legislationType: 'KeputusanMenteri';
};

export type LT_KeputusanBupatiWalikota_Node = {
  nodeType: 'legislationType';
  legislationType: 'KeputusanBupatiWalikota';
};

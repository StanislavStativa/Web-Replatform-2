import { LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
export type ITypesMyProjectDetails = {
  selectedIdToPreview: string;
  Icon: LinkField;
  handleBack: () => void;
  uniqueId: number;
};

export type ITypesProjectDetailsTableData = {
  sku: string;
  image: string;
  qty: string;
  description: string;
};
export type ITypesProjectSuccessTableData = {
  sku: string;
  image: string;
  qty: string;
  description: string;
};
export type ITypesProjectDetails = {
  isDeletable: boolean;
  isEditable: boolean;
  title: string;
};

export type ITypesUpdateProduct = {
  id: string;
  quantity: number;
};
export type ITypesDeleteProduct = {
  id: string;
};

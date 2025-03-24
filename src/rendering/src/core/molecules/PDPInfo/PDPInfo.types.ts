import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
export interface PDPInfoProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: ProductInfoSource;
  data: ProductInfo;
}
export interface ProductInfo {
  ProductDescription: string;
  CoveragePerBox: string;
  Specifications: SpecificationsOBJ;
  Documents: Documents[];
  ProductCode: string;
}
export interface SpecificationsOBJ {
  PDPInfo_Dimensions: PDPInfo_DimensionsArrayKeyValue[];
  PDPInfo_DesignInstallation: PDPInfo_DimensionsArrayKeyValue[];
  PDPInfo_TechnicalDetails: PDPInfo_DimensionsArrayKeyValue[];
}
export interface PDPInfo_DimensionsArrayKeyValue {
  Key: string;
  Value: string;
}

export interface Documents {
  Key: string;
  Name: string;
  Url: string;
}

export interface ProductInfoSource {
  EnableiIcon: Field;
  Prop65Warning: Field;
  Title: Field;
  CTA: LinkField;
  Image: Field;
  VideoURL: Field;
}

export interface AccordionSectionProps {
  value: string;
  title: string;
  content: React.ReactNode;
  expanded: string[];
  onToggle: (value: string) => void;
}
export interface SpecificationsSectionProps {
  data: PDPInfo_DimensionsArrayKeyValue[] | Documents[];
  title: string;
  isDocument: boolean;
}

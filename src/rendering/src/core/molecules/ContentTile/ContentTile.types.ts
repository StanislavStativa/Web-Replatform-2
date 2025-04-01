import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ContentTileFieldProps {
  CTA: LinkField;
  Image: Field<string>;
  Title: Field<string>;
  Description: Field<string>;
  Label?: Field<string>;
  SectionTitle: Field<string>;
  ImageSmartCropFormat: Field<string>;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
}
export interface ContentTileProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ContentTileFieldProps;
  };
  params: ComponentParams;
  isStack?: boolean;
  className?: string;
  buttonStyle?: string;
  TitleHeadingSize?: string;
}

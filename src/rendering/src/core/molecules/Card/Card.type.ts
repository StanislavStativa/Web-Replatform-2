import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface TextAndImageCardProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: TextAndImageCardItemProps;
  };
  params: ComponentParams;
  isNoImage?: boolean;
}
type ITypesIconValue = {
  src: string;
  alt: string;
  width: string;
  height: string;
};
export interface TextAndImageCardItemProps {
  CTA: LinkField;
  Description: Field<string>;
  HoverImage?: Field<string>;
  MobileHoverImage: Field<string>;
  TabletHoverImage: Field<string>;
  Image?: Field<string>;
  MobileImage?: Field<string>;
  TabletImage?: Field<string>;
  ImageSmartCropFormat?: Field<string>;
  Title: Field<string>;
  MobileTitle: Field<string>;
  MobileDescription: Field<string>;
  Icon?: {
    value: ITypesIconValue;
  };
}

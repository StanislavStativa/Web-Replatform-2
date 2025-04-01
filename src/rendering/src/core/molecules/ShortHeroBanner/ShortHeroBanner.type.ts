import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ShortHeroBannerFieldProps {
  CTA?: LinkField;
  Image: Field<string>;
  Title: Field<string>;
  Description: Field<string>;
  ImageSmartCropFormat?: Field<string>;
}
export interface ShortHeroBannerProps {
  fields: { CTA: LinkField; Title: string; Description: string };
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ShortHeroBannerFieldProps;
  };
  params: ComponentParams;
}

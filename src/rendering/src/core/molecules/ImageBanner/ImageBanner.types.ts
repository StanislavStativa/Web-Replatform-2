import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ImageBannerProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: ImageBannerFieldProps };
  params: ComponentParams;
}
export interface ImageBannerFieldProps {
  Image: Field<string>;
  TabletImage: Field<string>;
  MobileImage: Field<string>;
  CTA: LinkField;
  Video: LinkField;
  IsComponentClickable: string;
}

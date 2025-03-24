import { ComponentParams, ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface NoBorderImageProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: NoBorderImageFieldProps };
  params: ComponentParams;
}

export interface NoBorderImageFieldProps {
  Image: Field<string>;
  Caption: Field<string>;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
  ImageSmartCropFormat: Field<string>;
}

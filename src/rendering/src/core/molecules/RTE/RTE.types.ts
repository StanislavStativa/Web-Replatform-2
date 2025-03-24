export enum VARIANT {
  ConfirmationRTE = 'confirmationRTE',
}

import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
  RichTextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface RTEProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: RteFieldProps };
  params: ComponentParams;
}

export interface RteFieldProps {
  CTA: LinkField;
  Description: RichTextField;
  Title: Field<string>;
}

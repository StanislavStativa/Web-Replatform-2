import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ProRegistrationOptionProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ProRegistrationOptionFieldProps;
  };
  params: ComponentParams;
}

export interface ProRegistrationOptionFieldProps {
  Title: Field<string>;
  Description: Field<string>;
  CTA: LinkField;
  SecondaryCTA: LinkField;
}

import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface RegistrationConfirmationProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: RegistrationConfirmationFieldProps;
  };
  params: ComponentParams;
}

export interface RegistrationConfirmationFieldProps {
  CTA: LinkField;
  Description: Field<string>;
  Title: Field<string>;
}

import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Control, FieldValues } from 'react-hook-form';

export interface ResetPasswordProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ResetPasswordFieldProps;
  };
  params: ComponentParams;
}
export interface EmarsysSubmitActionProps {
  fields: {
    EmarsysAdditionalProperty: Field<string>;
  };
}
export interface EmarsysDetailsProps {
  fields: {
    EmailFieldId: Field<string>;
    SubmitAction: Array<EmarsysSubmitActionProps>;
  };
}
export interface ResetPasswordFieldProps {
  CTA: LinkField;
  CTALabel: Field<string>;
  Description: Field<string>;
  Title: Field<string>;
  Icon: LinkField;
  EmarsysDetails: EmarsysDetailsProps;
  RedirectURL: LinkField;
}
export interface FormFieldProps {
  name: string;
  placeholder: string;
  labelText: string;
  control?: Control<FieldValues>;
  autoCompleteOff?: boolean;
}
export interface FormErrorMessages {
  Error_Required_RepeatPassword: string;
  Error_Required_CurrentPassword: string;
  Error_Required_NewPassword: string;
  Error_passwords_do_not_match: string;
  Error_Passwordlength: string;
  Error_ExistingPassword: string;
}

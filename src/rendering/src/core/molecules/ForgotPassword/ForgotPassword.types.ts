import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
export interface ForgotPasswordFieldProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ForgotPasswordField;
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
interface ForgotPasswordField {
  CTALabel: Field<string>;
  Description: Field<string>;
  EmailMandatory: Field<string>;
  HomeLink: LinkField;
  InvalidEmail: Field<string>;
  Title: Field<string>;
  SuccessMessage: Field<string>;
  EmarsysDetails: EmarsysDetailsProps;
}
export interface FormErrorMessages {
  Error_email: string;
  Error_email_required: string;
}
export interface FormFieldProps {
  name: string;
  placeholderValue: string;
  showRequiredEmailMsgBelow?: boolean;
}

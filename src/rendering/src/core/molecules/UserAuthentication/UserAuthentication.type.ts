import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface UserAuthenticationProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesUserAuthentication;
  };
  params: ComponentParams;
}
type EmarsysField = {
  value: string;
};
type EmarsysAdditionalProperty = {
  value: string | undefined; // The value is expected to be a JSON string or undefined.
};
type SubmitActionItem = {
  fields: {
    EmarsysAdditionalProperty?: EmarsysAdditionalProperty; // Optional as it may not always exist.
  };
};
export type ITypesUserAuthentication = {
  Title: Field<string>;
  Icon: LinkField;
  CTALabel: Field<string>;
  RedirectURL: LinkField;
  SubTitle: Field<string>;
  Description: Field<string>;
  SecondaryCTATitle: Field<string>;
  HomeLink: LinkField;
  EmarsysDetails: {
    fields: {
      EmailFieldId?: EmarsysField;
      SubmitAction: SubmitActionItem[];
    };
  };
  SuccessMessage: Field<string>;
};
export interface FormErrorMessages {
  Error_Required_RepeatPassword: string;
  Error_Required_NewPassword: string;
  Error_passwords_do_not_match: string;
  Error_Passwordlength: string;
  Error_ExistingPassword: string;
}

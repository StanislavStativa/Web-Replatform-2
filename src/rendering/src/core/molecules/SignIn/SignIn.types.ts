import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
export interface SignInProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: SignInFormProps };
  params: ComponentParams;
}
export interface SignInFormProps {
  Description: Field<string>;
  Disclaimer: Field<string>;
  EmailMandatory: Field<string>;
  ForgotPasswordLink: LinkField;
  HomeLink: LinkField;
  InvalidEmail: Field<string>;
  LoginFailed: Field<string>;
  PasswordMandatory: Field<string>;
  RegisterPrompt: Field<string>;
  Title: Field<string>;
  SubTitle: Field<string>;
  Icon: LinkField;
  RegisterLink: LinkField;
  titleLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  ChangePasswordLink: {
    value: {
      href: string;
    };
  };
  Text: Field<string>;
}
export interface FormFieldProps {
  name: string;
  labelValue: string;
  placeholderValue: string;
}
export interface FormErrorMessages {
  Error_password_required: string;
  Error_email_required: string;
  Error_email: string;
  LogInFailed: string;
}

export type ITypesChangePasswordModal = {
  open: boolean;
  closeModal: () => void;
  password: string;
  email: string;
  rememberMe: boolean;
  ChangePasswordLink: {
    value: {
      href: string;
    };
  };
  HomeLink: LinkField;
  SubTitle: Field<string>;
  HeadingTag: string;
  Icon: LinkField;
  passwordChangeFlag: boolean;
};

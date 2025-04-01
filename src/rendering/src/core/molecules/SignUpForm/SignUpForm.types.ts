import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface SignUpFormProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: SignUpFormFieldProps };
  params: ComponentParams;
}
export interface SignUpFormFieldProps {
  CTA: LinkField;
  MainTitle: TextField;
  OptionList: Array<OptionListProps>;
  OptionTitle: TextField;
  Title: TextField;
  EmarsysDetails: EmarsysDetailsProps;
}
export interface OptionListProps {
  displayName: string;
  url: string;
  fields: {
    Key: TextField;
    Value: TextField;
  };
  id: string;
}

export interface FormErrorMessages {
  Error_email_required: string;
  Error_firstName_required: string;
  Error_lastName_required: string;
}

export interface EmarsysDetailsProps {
  fields: {
    BrontoEmailSubscriptionListFieldId: Field<string>;
    EmailFieldId: Field<string>;
    EmailOptInFieldId: Field<string>;
    FirstNameFieldId: Field<string>;
    LastNameFieldId: Field<string>;
    SubmitAction: Array<EmarsysSubmitActionProps>;
  };
}
export interface EmarsysSubmitActionProps {
  fields: {
    EmarsysAdditionalProperty: Field<string>;
  };
}

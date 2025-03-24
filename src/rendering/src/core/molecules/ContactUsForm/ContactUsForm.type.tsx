import {
  ComponentParams,
  ComponentRendering,
  RichTextField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ContactUsFormProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: FieldProps };
  params: ComponentParams;
}
export interface SelectProps {
  fields: { Title: { value: string } };
  id: string | number;
}

type SubmitActionType = {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: {
    EmarsysAdditionalProperty: {
      value: string;
    };
  };
};

export type FieldProps = {
  Title: TextField;
  Description: RichTextField;
  SubTitle: TextField;
  CTA: { value: { text: string; href: string } };
  TopicOptions: SelectProps[];
  EmarsysDetails: {
    id: string;
    name: string;
    displayName: string;
    fields: {
      DaytimePhoneFieldId: {
        value: string;
      };
      EmailFieldId: {
        value: string;
      };
      FirstNameFieldId: {
        value: string;
      };
      LastNameFieldId: {
        value: string;
      };
      MessageFieldId: {
        value: string;
      };
      SubmitAction: SubmitActionType[];
      TopicsFieldId: {
        value: string;
      };
      ZipCodeFieldId: {
        value: string;
      };
    };
  };
};

export interface InputFieldProps {
  name: string;
  labelValue: string;
  inputType?: string;
  maxLength?: number;
  className?: string;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export type FormData = {
  firstName: string;
  lastName: string;
  zipCode: string;
  email: string;
  telePhone: string;
  topic: string;
  message: string;
  recaptcha?: string;
};

export type ErrorMessages = {
  Error_email_required: string;
  Error_Valid_Email: string;
  Error_Daytime_Phone_Number_required: string;
  Error_Valid_Daytime_Phone_Number: string;
  Error_Message_Required: string;
};

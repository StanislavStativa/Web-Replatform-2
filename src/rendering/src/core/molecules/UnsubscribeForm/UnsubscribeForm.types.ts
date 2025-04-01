import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
export interface UnsubscribeFormProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: UnsubscribeFormFieldProps;
    params: ComponentParams;
  };
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

interface UnsubscribeFormFieldProps {
  APIEndPoint: Field<string>;
  CTA: LinkField;
  Label: Field<string>;
  Title: Field<string>;
  EmarsysDetails: {
    id: string;
    name: string;
    displayName: string;
    fields: {
      EmailFieldId: {
        value: string;
      };
      OptInFieldId: {
        value: string;
      };

      SubmitAction: SubmitActionType[];
    };
  };
}
export interface InputFieldProps {
  name: string;
  labelValue: string;
  inputType?: string;
  maxLength?: number;
  className?: string;
}
export type ErrorMessages = {
  Error_email_required: string;
  Error_Valid_Email: string;
};
export type FormData = {
  email: string;
};
export interface FormFieldProps {
  name: string;
  labelValue: string;
  placeholderValue: string;
}

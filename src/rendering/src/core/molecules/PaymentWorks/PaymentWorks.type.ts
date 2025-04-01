import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ITypesPaymentWorks {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesPaymentWorksFields;
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

export type ITypesPaymentWorksFields = {
  SubmitCTA: LinkField;
  FormDescription: Field<string>;
  FormTitle: Field<string>;
  EmarsysDetails: {
    fields: {
      SubmitAction?: SubmitActionItem[];
      FirstNameFieldId?: EmarsysField;
      LastNameFieldId?: EmarsysField;
      EmailFieldId?: EmarsysField;
    };
  };
};
export interface FormErrorMessages {
  Error_first_name_required: string;
  Error_first_name: string;
  Error_last_name_required: string;
  Error_last_name: string;
  Error_email_required: string;
  Error_email: string;
}

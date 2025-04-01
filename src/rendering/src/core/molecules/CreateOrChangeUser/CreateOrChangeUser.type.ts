import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ITypesCreateOrChangeUser {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesCreateOrChangeUserFields;
  };
  params: ComponentParams;
  isEdit?: boolean;
}
export interface EmarsysSubmitActionProps {
  fields: {
    EmarsysAdditionalProperty: Field<string>;
  };
}
export interface EmarsysDetailsProps {
  fields: {
    EmailFieldId: Field<string>;
    AddressFieldId: Field<string>;
    CityFieldId: Field<string>;
    CompanyNameFieldId: Field<string>;
    CustomerTypeFieldId: Field<string>;
    SAPCustomerFieldId: Field<string>;
    StateFieldId: Field<string>;
    StoreFieldId: Field<string>;
    LastNameFieldId: Field<string>;
    FirstNameFieldId: Field<string>;
    ZipCodeFieldId: Field<string>;
    DaytimePhoneFieldId: Field<string>;
    OptinId: Field<string>;
    SubmitAction: Array<EmarsysSubmitActionProps>;
  };
}
export type ITypesCreateOrChangeUserFields = {
  EmarsysDetails: EmarsysDetailsProps;
  CTA: LinkField;
  CTALabel: Field<string>;
  Description: Field<string>;
  CreateUserTitle: Field<string>;
  ChangeUserTitle: Field<string>;
  Icon: LinkField;
  SubTitle: Field<string>;
  NextLink: LinkField;
  BackLink: LinkField;
};

export interface FormErrorMessages {
  Error_first_name_required: string;
  Error_first_name: string;
  Error_last_name_required: string;
  Error_last_name: string;
  Error_email_required: string;
  Error_email: string;
  Error_phone_number_required: string;
  Error_phone_number: string;
}

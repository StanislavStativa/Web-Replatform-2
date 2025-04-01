import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface RegisterProUserWithCustomerIDProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: RegisterProUserWithCustomerIDProps;
  };
  params: ComponentParams;
}

export interface RegisterProUserWithCustomerIDProps {
  ToolTipText: Field<string>;
  CustomerIDImage: {
    value: {
      alt: string;
      height: string;
      src: string;
      width: string;
    };
  };
  Title: Field<string>;
  CTA: LinkField;
  CTALabel: Field<string>;
}

export interface RegProUserCustIdRegErrs {
  Error_Registration_CustomerNumber: string;
  Error_Registartion_EmailAddress: string;
  FormLabels_Telephonenumber: string;
  Error_email: string;
  Error_PhoneNumberValid: string;
}

export interface RegProUserCustIdFormFieldProps {
  name: string;
  placeholder: string;
}

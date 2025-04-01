import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Control, FieldValues } from 'react-hook-form';
import { ProAccountUserInfo } from './RegisterProUser.schema';
export interface RegisterProUserProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: RegisterProUserFieldProps;
  };
  params: ComponentParams;
}
export interface EmarsysSubmitActionProps {
  fields: {
    EmarsysAdditionalProperty: Field<string>;
  };
}
export interface EmarsysDetailsProps {
  jsonValue: {
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
  };
}
export interface RegisterProUserFieldProps {
  data: {
    datasource: {
      EmarsysDetails: EmarsysDetailsProps;
      Title: Field<string>;
      MainTitle: Field<string>;
      Description: Field<string>;
      PriorSubmissionMessage: Field<string>;
      ConfirmTitle: Field<string>;
      ConfirmRegistration: Field<string>;
      Link: {
        jsonValue: LinkField;
      };
      RegistrationConfirmationLink: {
        jsonValue: LinkField;
      };
      Image: Field<string>;
      State: {
        targetItems: {
          StateCode: {
            jsonValue: Field<string>;
          };
          StateName: {
            jsonValue: Field<string>;
          };
        }[];
      };
      Store: {
        targetItems: {
          StoreNumber: {
            jsonValue: Field<string>;
          };
          StoreName: {
            jsonValue: Field<string>;
          };
          State: {
            jsonValue: Field<string>;
          };
        }[];
      };
      TradeProfession: {
        targetItems: {
          name: string;
          TradeProfessionsName: {
            jsonValue: Field<string>;
          };
          TradeProfessionsValue: {
            jsonValue: Field<string>;
          };
        }[];
      };
    };
  };
  fetchedUserDataFromLocalStorage?: ProAccountUserInfo;
  clearErrorMessage: () => void;
}

export interface FormFieldProps {
  name: string;
  placeholder: string;
  control?: Control<FieldValues>;
  maxLength?: number;
}

export interface FormErrorMessages {
  Error_company_name_required: string;
  Error_first_name_required: string;
  Error_first_name: string;
  Error_last_name_required: string;
  Error_last_name: string;
  Error_email_required: string;
  Error_email: string;
  Error_phone_number_required: string;
  Error_phone_number: string;
  Error_city_required: string;
  Error_city_alphabets: string;
  Error_address_line_1_required: string;
  Error_address_line_2_required: string;
  Error_state_required: string;
  Error_zip_code_required: string;
  Error_zip_code: string;
  Error_Preferred_store_required: string;
  Error_trade_profession_required: string;
}

export interface createdProUserData {
  personalUserData?: ProAccountUserInfo;
  proUserStateNameData?: string;
  proUserProfession?: string;
  PriorSubmissionMessage: Field<string>;
  ConfirmTitle: Field<string>;
  ConfirmRegistration: Field<string>;
  handleConfirmSubmit: () => void;
  handleNavigateBack: () => void;
  HeadingTag: string;
  formSubmitedErrorMessage?: boolean;
}
// Define the structure for each target item
export interface TargetItem {
  StoreNumber: {
    jsonValue: Field<string>;
  };
  StoreName: {
    jsonValue: Field<string>;
  };
  State: {
    jsonValue: Field<string>;
  };
}

// Define the structure for Store

// Define the structure for the options in the groupedByState
interface Option {
  value: string;
  label: string;
  misc: string;
}

// Define the structure for groupedByState
export interface GroupedByState {
  [key: string]: Option[];
}

// Define the structure for preferredStoreOptions
export interface PreferredStoreOption {
  label: string;
  options: Option[];
}

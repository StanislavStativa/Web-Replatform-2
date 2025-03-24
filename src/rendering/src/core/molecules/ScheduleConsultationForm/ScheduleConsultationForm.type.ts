import {
  ComponentParams,
  ComponentRendering,
  Field,
  RichTextField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ScheduleConsultationFormProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: FieldProps };
  params: ComponentParams;
  onNext?: () => void;
  onBack?: () => void;
  onSuccessScreen?: () => void;
  data: DataProps;
  setData: React.Dispatch<React.SetStateAction<DataProps>>;
  shopStores: Stores;
  getZipCode: (zip: string | null) => void;
}

export type DataProps = {
  zipCode?: string;
  storeName?: string;
  projectAreas?: string;
  projectProgress?: string;
  referred?: string;
  date?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  time?: string;
  IsEmailSignUpRequested?: string;
  storeNumber?: string;
  storeStateCode?: string;
  storePhoneNumber?: string;
};

export type ProjectArea = {
  fields: { Key: TextField };
  id: string;
};

export type Project = {
  fields: { Key: { value: string } };
};

type SubmitActionType = {
  fields: {
    EmarsysAdditionalProperty: {
      value: string;
    };
  };
};

export type FieldProps = {
  Icon: { value: string };
  SectionTitle: TextField;
  HeadingTag: { value: string };
  ImageSmartCropFormat: Field<string>;
  Image: Field<string>;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
  Step2Image: Field<string>;
  ProjectAreaTitle: TextField;
  ProjectArea: ProjectArea[];
  ProjectTitle: TextField;
  Description: RichTextField;
  CheckboxTitle: TextField;
  PreferredTime: Project[];
  Project: Project[];
  Step2Title: RichTextField;
  Step2CheckboxTitle: TextField;
  Step3Title: TextField;
  EmarsysDetails: {
    id: string;
    name: string;
    displayName: string;
    fields: {
      ProjectProgressFieldId: {
        value: string;
      };
      ProjectAreasFieldId: {
        value: string;
      };
      FirstNameFieldId: {
        value: string;
      };
      LastNameFieldId: {
        value: string;
      };
      PhoneNumberFieldId: {
        value: string;
      };
      SubmitAction: SubmitActionType[];
      EmailFieldId: {
        value: string;
      };
      DateFieldId: {
        value: string;
      };
      ReferredFieldId: {
        value: string;
      };
      StoreNumberFieldId: {
        value: string;
      };
      TimeFieldId: {
        value: string;
      };
      ZipCodeFieldId: {
        value: string;
      };
      StreetAddressFieldId: {
        value: string;
      };
      CityFieldId: {
        value: string;
      };
      StateFieldId: {
        value: string;
      };
      EstimatedBudgetFieldId: {
        value: string;
      };
      DesignStyleFieldId: {
        value: string;
      };
      InspirationFieldId: {
        value: string;
      };
      OptInFieldValue: {
        value: string;
      };
    };
  };
  HTMLBody: Field<string>;
  StoreManagerHtmlMessage: Field<string>;
  StoreEmail: Field<string>;
};
export interface InputFieldProps {
  name: string;
  placeholderValue?: string;
  inputType: string;
  maxLength?: number;
  onBlur?: () => void;
}

export interface StepItemProps {
  className: string;
  stepNumber: number;
  currentStep: number;
  label: string;
}

export interface DatePickerFieldProps {
  name: string;
  formMethodsValue: {
    setValue: (name: string, value: string) => void;
    getValues: (name: string) => FormValues;
  };
  closedDays: number[];
}
type FormValues = {
  [key: string]: string | number | undefined;
};

export type Store = {
  City: string;
  Name: string;
  StateCode: string;
  StoreNumber: string;
  Phone1: string;
  SundayHours: string;
  MondayHours: string;
  TuesdayHours: string;
  WednesdayHours: string;
  ThursdayHours: string;
  FridayHours: string;
  SaturdayHours: string;
};

export type Stores = Store[];

export type ErrorMessages = {
  Error_Empty?: string;
  Error_ZipCodeValid?: string;
  Error_email_address?: string;
  Error_PhoneNumberValid?: string;
};

export type ITypesTimeSlot = {
  label: string;
  value: string;
};
export type ITypesStoreDetails = {
  SundayHours: string;
  MondayHours: string;
  TuesdayHours: string;
  WednesdayHours: string;
  ThursdayHours: string;
  FridayHours: string;
};

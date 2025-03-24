export type ITypesBillAddressForm = {
  isEdit: boolean;
  handleBack: () => void;
  stateData: Array<ITypesStateData>;
  selectedIdToPreview: string | null;
  isAddNew: boolean;
  isBilling: boolean;
  isShipping: boolean;
};

export type ITypesStateData = {
  displayName: string;
  name: string;
};

export interface FormErrorMessages {
  Error_company_name_required: string;
  Error_phone_number_required: string;
  Error_phone_number: string;
  Error_city_required: string;
  Error_city_alphabets: string;
  Error_address_line_1_required: string;
  Error_address_line_2_required: string;
  Error_state_required: string;
  Error_zip_code_required: string;
  Error_zip_code: string;
}

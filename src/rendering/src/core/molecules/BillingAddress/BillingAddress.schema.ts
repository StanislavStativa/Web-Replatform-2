import * as yup from 'yup';
import { BillingAddressFormErrorMessages } from './BillingAddress.types';

export const createBillingAddressSchema = (errors: BillingAddressFormErrorMessages) =>
  yup.object().shape({
    companyName: yup.string().required(errors.Error_company_name_required),

    addressLine1: yup.string().required(errors.Error_address_line_1_required),
    addressLine2: yup.string(),
    state: yup.string().required(errors.Error_state_required),
    zipCode: yup
      .string()
      .required(errors.Error_zip_code_required)
      .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, errors.Error_zip_code),
    city: yup
      .string()
      .trim()
      .required(errors.Error_city_required)
      .matches(/^[A-Za-z\s]+$/, errors.Error_city_alphabets),
    preferredStore: yup.string().required(errors.Error_Preferred_store_required),
  });

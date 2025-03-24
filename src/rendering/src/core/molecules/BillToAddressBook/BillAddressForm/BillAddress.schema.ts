import * as yup from 'yup';
import { FormErrorMessages } from './BillAddressForm.type';
export const createBillingAddressSchema = (errors: FormErrorMessages) =>
  yup.object().shape({
    companyName: yup.string().required(errors.Error_company_name_required),
    addressLine1: yup.string().required(errors.Error_address_line_1_required),
    addressLine2: yup.string(),
    city: yup
      .string()
      .trim()
      .required(errors.Error_city_required)
      .matches(/^[A-Za-z\s]+$/, errors.Error_city_alphabets),
    state: yup.string().required(errors.Error_state_required),
    zipCode: yup
      .string()
      .required(errors.Error_zip_code_required)
      .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, errors.Error_zip_code),
    shippingInstructions: yup.string(),
    phone: yup
      .string()
      .required(errors.Error_phone_number_required)
      .matches(/^(?:\(\d{3}\)\s?|\d{3}-)\d{3}-\d{2,4}$|^\d{8,10}$/, errors.Error_phone_number),
  });

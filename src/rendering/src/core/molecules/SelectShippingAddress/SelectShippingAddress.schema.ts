import * as yup from 'yup';
import { SelectShippingAddressFormErrorMessage } from './SelectShippingAddress.type';
export const createSelectShippingAddressSchema = (errors: SelectShippingAddressFormErrorMessage) =>
  yup.object().shape({
    savedAddress: yup.string(),
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
    rememberMe: yup.mixed(),
    shippingInstructions: yup.string(),
  });

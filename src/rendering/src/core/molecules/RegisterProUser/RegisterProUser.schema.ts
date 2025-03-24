import * as yup from 'yup';
import { FormErrorMessages } from './RegisterProUser.types';
export const createUserSchema = (errors: FormErrorMessages) =>
  yup.object().shape({
    companyName: yup.string().required(errors.Error_company_name_required),
    preferredStoreID: yup.string(),
    firstName: yup
      .string()
      .required(errors.Error_first_name_required)
      .matches(/^[A-Za-z0-9@#\$%\^\&\*\-_+=.!?,:;'"\/\\|\s]+$/, errors.Error_first_name), // Excludes (), {}, [], <>
    lastName: yup
      .string()
      .required(errors.Error_last_name_required)
      .matches(/^[A-Za-z0-9@#\$%\^\&\*\-_+=.!?,:;'"\/\\|\s]+$/, errors.Error_last_name),
    email: yup
      .string()
      .required(errors.Error_email_required)
      .matches(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        errors.Error_email
      ),

    phone: yup
      .string()
      .required(errors.Error_phone_number_required)
      .matches(/^(?:\(\d{3}\)\s?|\d{3}-)\d{3}-\d{2,4}$|^\d{8,10}$/, errors.Error_phone_number),
    city: yup
      .string()
      .trim()
      .required(errors.Error_city_required)
      .matches(/^[A-Za-z\s]+$/, errors.Error_city_alphabets),

    addressLine1: yup.string().required(errors.Error_address_line_1_required),
    addressLine2: yup.string(),
    state: yup.string().required(errors.Error_state_required),
    zipCode: yup
      .string()
      .required(errors.Error_zip_code_required)
      .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, errors.Error_zip_code),
    preferredStore: yup.string().required(errors.Error_Preferred_store_required),
    tradeProfessions: yup.string().required(errors.Error_trade_profession_required),
    isEmailOptIn: yup.boolean(),
    existingCustomerId: yup.string(),
  });

export type ProAccountUserInfo = yup.InferType<ReturnType<typeof createUserSchema>> & {
  password?: string;
};

export type PersonalAccountUserInfo = Omit<
  ProAccountUserInfo,
  'tradeProfessions' | 'existingCustomerId'
>;

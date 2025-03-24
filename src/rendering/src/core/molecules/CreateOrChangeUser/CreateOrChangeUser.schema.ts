import * as yup from 'yup';
import { FormErrorMessages } from './CreateOrChangeUser.type';
export const createChangeUserSchema = (errors: FormErrorMessages) =>
  yup.object().shape({
    firstName: yup
      .string()
      .required(errors.Error_first_name_required)
      .matches(/^[A-Za-z0-9@#\$%\^\&\*\-_+=.!?,:;'"\/\\|]+$/, errors.Error_first_name), // Excludes (), {}, [], <>
    lastName: yup
      .string()
      .required(errors.Error_last_name_required)
      .matches(/^[A-Za-z0-9@#\$%\^\&\*\-_+=.!?,:;'"\/\\|]+$/, errors.Error_last_name),
    email: yup
      .string()
      .required(errors.Error_email_required)
      .matches(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        errors.Error_email
      ),

    phoneNumber: yup
      .string()
      .required(errors.Error_phone_number_required)
      .matches(/^(?:\(\d{3}\)\s?|\d{3}-)\d{3}-\d{2,4}$|^\d{8,10}$/, errors.Error_phone_number),
  });

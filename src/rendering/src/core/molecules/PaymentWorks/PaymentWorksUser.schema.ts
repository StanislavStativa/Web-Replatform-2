import * as yup from 'yup';
import { FormErrorMessages } from './PaymentWorks.type';
export const paymentWorksUserSchema = (errors: FormErrorMessages) =>
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
  });

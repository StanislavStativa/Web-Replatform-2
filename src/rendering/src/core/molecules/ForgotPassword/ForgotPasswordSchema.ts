import * as yup from 'yup';
import { FormErrorMessages } from './ForgotPassword.types';
export const ForgotPasswordSchema = (errors: FormErrorMessages) =>
  yup.object().shape({
    email: yup
      .string()
      .required(errors.Error_email_required)
      .matches(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        errors.Error_email
      ),
  });

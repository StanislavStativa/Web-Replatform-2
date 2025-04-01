import * as yup from 'yup';
import { ErrorMessages } from './UnsubscribeForm.types';

export const UnsubscribeFormSchema = (errors: ErrorMessages) =>
  yup.object().shape({
    email: yup
      .string()
      .required(errors.Error_email_required) // Ensures the email field is not empty
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, errors.Error_Valid_Email),
  });

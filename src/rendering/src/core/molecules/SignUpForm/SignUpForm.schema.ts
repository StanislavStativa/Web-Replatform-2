import * as yup from 'yup';
import { type FormErrorMessages } from './SignUpForm.types';

export const createSignInFormSchema = (errorMessages: FormErrorMessages) =>
  yup.object().shape({
    firstName: yup.string().required(errorMessages.Error_firstName_required),
    lastName: yup.string().required(errorMessages.Error_lastName_required),
    email: yup
      .string()
      .email(errorMessages.Error_email_required)
      .required(errorMessages.Error_email_required),
    option: yup.string(),
  });

import * as yup from 'yup';
import { FormErrorMessages } from './SignIn.types';
export const createUserSchema = (errorMessages: FormErrorMessages) =>
  yup.object().shape({
    userName: yup
      .string()
      .transform((value) => value?.replace(/\s+/g, ''))
      .required(errorMessages.Error_email_required)
      .matches(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        errorMessages.Error_email
      ),
    password: yup.string().required(errorMessages.Error_password_required),
    rememberMe: yup.boolean(),
    roles: yup.mixed(),
  });

import * as yup from 'yup';
import { FormErrorMessages } from './UserAuthentication.type';
export const userAuthSchema = (errorMessages: FormErrorMessages) =>
  yup.object().shape({
    password: yup
      .string()
      .required(errorMessages.Error_Required_NewPassword)
      .min(10, errorMessages.Error_Passwordlength),

    repeatPassword: yup
      .string()
      .required(errorMessages.Error_Required_RepeatPassword)
      .oneOf([yup.ref('password')], errorMessages.Error_passwords_do_not_match),
    userName: yup.string(),
    roles: yup.mixed(),
    rememberMe: yup.boolean(),
  });

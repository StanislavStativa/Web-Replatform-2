import * as yup from 'yup';
import { FormErrorMessages } from '../ResetPassword/ResetPassword.types';

export const resetSignPasswordSchema = (errorMessages: FormErrorMessages) =>
  yup.object().shape({
    currentPassword: yup.string().required(errorMessages.Error_Required_CurrentPassword),
    newPassword: yup
      .string()
      .required(errorMessages.Error_Required_NewPassword)
      .min(10, errorMessages.Error_Passwordlength),

    repeatNewPassword: yup
      .string()
      .required(errorMessages.Error_Required_RepeatPassword)
      .oneOf([yup.ref('newPassword')], errorMessages.Error_passwords_do_not_match),
    userName: yup
      .string()

      .matches(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),
    roles: yup.mixed(),
    rememberMe: yup.boolean(),
  });

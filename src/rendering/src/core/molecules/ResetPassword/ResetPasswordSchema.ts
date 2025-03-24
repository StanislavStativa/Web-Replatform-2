import * as yup from 'yup';
import { FormErrorMessages } from './ResetPassword.types';
export const resetPasswordSchema = (errorMessages: FormErrorMessages) =>
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
  });

import * as yup from 'yup';
import { FormErrorMessages } from './EmailSearch.type';
export const createEmailSearchSchema = (errorMessages: FormErrorMessages) =>
  yup.object().shape({
    userName: yup
      .string()
      .transform((value) => value?.replace(/\s+/g, ''))
      .required(errorMessages.Error_email_required)
      .matches(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        errorMessages.Error_email
      ),
  });

import * as yup from 'yup';
import { ErrorMessages } from './ContactUsForm.type';

export const contactUsSchema = (errors: ErrorMessages) =>
  yup.object().shape({
    firstName: yup.string().optional(),
    lastName: yup.string().optional(),
    zipCode: yup.string().optional(),
    email: yup
      .string()
      .required(errors.Error_email_required)
      .matches(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        errors.Error_Valid_Email
      ),
    telePhone: yup
      .string()
      .required(errors.Error_Daytime_Phone_Number_required)
      .min(3, errors.Error_Valid_Daytime_Phone_Number)
      .matches(/^[0-9]+$/, errors.Error_Valid_Daytime_Phone_Number),
    topic: yup.string().optional(),
    message: yup.string().required(errors.Error_Message_Required),
    recaptcha: yup.string().optional(),
  });

import * as yup from 'yup';
import { type ErrorMessages } from './ScheduleConsultationForm.type';

export const InformationFormSchema = (errors: ErrorMessages) =>
  yup.object().shape({
    zipCode: yup
      .string()
      .required(errors.Error_Empty)
      .required(errors.Error_ZipCodeValid)
      .matches(/^\d{5}$/, errors.Error_ZipCodeValid),
    storeName: yup.string().required(errors.Error_Empty),
    projectAreas: yup.string().optional(),
    projectProgress: yup.string().optional(),
    referred: yup.string().optional(),
    storeNumber: yup.string().optional(),
    storeStateCode: yup.string().optional(),
    storePhoneNumber: yup.string().optional(),
  });

export const ScheduleFormSchema = (errors: ErrorMessages) =>
  yup.object().shape({
    firstName: yup.string().required(errors.Error_Empty),
    lastName: yup.string().required(errors.Error_Empty),
    date: yup.string().optional(),
    time: yup.string().optional(),
    email: yup
      .string()
      .required(errors.Error_Empty)
      .required(errors.Error_email_address)
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        errors.Error_email_address
      ),
    phoneNumber: yup
      .string()
      .required(errors.Error_Empty)
      .required(errors.Error_PhoneNumberValid)
      .matches(/^.{12}$/, errors.Error_PhoneNumberValid),
    IsEmailSignUpRequested: yup.string().optional(),
  });

import * as yup from 'yup';
import { RegProUserCustIdRegErrs } from './RegisterProUserWithCustomerID.types';

export const regProUserWithCustIdSchema = (errors: RegProUserCustIdRegErrs) =>
  yup.object().shape({
    email: yup
      .string()
      .required(errors.Error_Registartion_EmailAddress)
      .matches(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        errors.Error_email
      ),
    telephone: yup
      .string()
      .required(errors.FormLabels_Telephonenumber)
      .matches(/^(?:\(\d{3}\)\s?|\d{3}-)\d{3}-\d{2,4}$|^\d{8,10}$/, errors.Error_PhoneNumberValid),
    customerNumber: yup
      .string()
      .required(errors.Error_Registration_CustomerNumber)
      .matches(
        /^(?:\(\d{3}\)\s?|\d{3}-)\d{3}-\d{2,4}$|^\d{5,10}$/,
        errors.Error_Registration_CustomerNumber
      ),
  });

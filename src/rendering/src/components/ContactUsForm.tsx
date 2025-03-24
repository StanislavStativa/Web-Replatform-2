import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { type ContactUsFormProps } from '@/core/molecules/ContactUsForm/ContactUsForm.type';
import ContactUsForm from '@/core/molecules/ContactUsForm/ContactUsForm';

const Default = (props: ContactUsFormProps): JSX.Element => {
  return <ContactUsForm {...props} />;
};
export default withDatasourceCheck()(Default);

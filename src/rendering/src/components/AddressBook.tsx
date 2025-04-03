import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import BillToAddressBook from '@/core/molecules/BillToAddressBook/BillToAddressBook';
import { BillToAddressBookProps } from '@/core/molecules/BillToAddressBook/BillToAddressBook.types';

const Default = (props: BillToAddressBookProps): JSX.Element => {
  return <BillToAddressBook {...props} />;
};
export default withDatasourceCheck()(Default);

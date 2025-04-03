import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { type AccountCategoryCardsProps } from '@/core/molecules/AccountCategoryCards/AccountCategoryCards.type';
import AccountCategoryCards from '@/core/molecules/AccountCategoryCards/AccountCategoryCards';

const Default = (props: AccountCategoryCardsProps): JSX.Element => {
  return <AccountCategoryCards {...props} />;
};

export default withDatasourceCheck()(Default);

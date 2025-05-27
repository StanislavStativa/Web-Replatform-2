import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import ProductCard from '@/core/molecules/ProductCard/ProductCard';
import { ITypesProductCard } from '@/core/molecules/ProductCard/ProductCard.type';

export const Default = (props: ITypesProductCard): JSX.Element => {
  return <ProductCard {...props} />;
};
export default withDatasourceCheck()(Default);

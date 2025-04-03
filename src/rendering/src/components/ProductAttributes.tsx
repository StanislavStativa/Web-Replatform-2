import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { type ProductAttributesProps } from '@/core/molecules/ProductAttributes/ProductAttributes.types';
import { ProductAttributes } from '../core/molecules/ProductAttributes/ProductAttributes';

const Default = (props: ProductAttributesProps): JSX.Element => {
  return <ProductAttributes {...props} />;
};
export default withDatasourceCheck()(Default);

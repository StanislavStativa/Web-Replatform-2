import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import Products from '@/core/molecules/ProductListing/Products';
import { ProductListingProps } from '@/core/molecules/ProductListing/ProductListing.type';

const Default = (props: ProductListingProps): JSX.Element => {
  return <Products {...props} />;
};
export default withDatasourceCheck()(Default);

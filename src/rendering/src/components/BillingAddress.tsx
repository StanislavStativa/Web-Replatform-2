import BillingAddress from '@/core/molecules/BillingAddress/BillingAddress';
import { BillingAddressProps } from '@/core/molecules/BillingAddress/BillingAddress.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: BillingAddressProps): JSX.Element => {
  return <BillingAddress {...props} />;
};
export default withDatasourceCheck()(Default);

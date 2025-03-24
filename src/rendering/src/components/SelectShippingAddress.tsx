import SelectShippingAddress from '@/core/molecules/SelectShippingAddress/SelectShippingAddress';
import { SelectShippingAddressProps } from '@/core/molecules/SelectShippingAddress/SelectShippingAddress.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
const Default = (props: SelectShippingAddressProps): JSX.Element => {
  return <SelectShippingAddress {...props} />;
};

export default withDatasourceCheck()(Default);

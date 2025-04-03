import RegisterProUserWithCustomerID from '@/core/molecules/RegisterProUserWithCustomerID/RegisterProUserWithCustomerID';
import { RegisterProUserWithCustomerIDProps } from '@/core/molecules/RegisterProUserWithCustomerID/RegisterProUserWithCustomerID.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
const Default = (props: RegisterProUserWithCustomerIDProps): JSX.Element => {
  return <RegisterProUserWithCustomerID {...props} />;
};

export default withDatasourceCheck()(Default);

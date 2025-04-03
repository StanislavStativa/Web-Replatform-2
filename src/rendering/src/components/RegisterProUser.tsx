import RegisterProUser from '@/core/molecules/RegisterProUser/RegisterProUser';
import { type RegisterProUserProps } from '@/core/molecules/RegisterProUser/RegisterProUser.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
const Default = (props: RegisterProUserProps): JSX.Element => {
  return <RegisterProUser {...props} />;
};

export default withDatasourceCheck()(Default);

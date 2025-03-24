import RegisterPersonalUser from '@/core/molecules/RegisterPersonalUser/RegisterPersonalUser';
import { type RegisterPersonalUserProps } from '@/core/molecules/RegisterPersonalUser/RegisterPersonalUser.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
const Default = (props: RegisterPersonalUserProps): JSX.Element => {
  return <RegisterPersonalUser {...props} />;
};

export default withDatasourceCheck()(Default);

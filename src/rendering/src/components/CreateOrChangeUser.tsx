import CreateOrChangeUser from '@/core/molecules/CreateOrChangeUser/CreateOrChangeUser';
import { ITypesCreateOrChangeUser } from '@/core/molecules/CreateOrChangeUser/CreateOrChangeUser.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

export const Default = (props: ITypesCreateOrChangeUser): JSX.Element => {
  return <CreateOrChangeUser {...props} />;
};

export default withDatasourceCheck()(Default);

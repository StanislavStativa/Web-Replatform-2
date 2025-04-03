import { ITypesMyProjects } from '@/core/molecules/MyProjects/MyProject.type';
import MyProjects from '@/core/molecules/MyProjects/MyProjects';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

export const Default = (props: ITypesMyProjects): JSX.Element => {
  return <MyProjects {...props} />;
};
export default withDatasourceCheck()(Default);

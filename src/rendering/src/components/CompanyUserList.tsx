import CompanyUserList from '@/core/molecules/CompanyUserList/CompanyUserList';
import { ITypesCompanyUserList } from '@/core/molecules/CompanyUserList/CompanyUserList.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

export const Default = (props: ITypesCompanyUserList): JSX.Element => {
  return <CompanyUserList {...props} />;
};

export default withDatasourceCheck()(Default);

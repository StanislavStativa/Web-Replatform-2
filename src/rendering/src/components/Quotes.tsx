import AdvanceSearch from '@/core/molecules/AdvanceSearch/AdvanceSearch';
import { ITypesAdvanceSearch } from '@/core/molecules/AdvanceSearch/AdvanceSearch.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: ITypesAdvanceSearch): JSX.Element => {
  return <AdvanceSearch {...props} />;
};
export default withDatasourceCheck()(Default);

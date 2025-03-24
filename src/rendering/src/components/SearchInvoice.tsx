import SearchInvoice from '@/core/molecules/SearchInvoice/SearchInvoice';
import { ITypesSearchInvoice } from '@/core/molecules/SearchInvoice/SearchInvoice.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
export const Default = (props: ITypesSearchInvoice): JSX.Element => {
  return <SearchInvoice {...props} />;
};
export default withDatasourceCheck()(Default);

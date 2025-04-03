import PdfLinks from '@/core/molecules/PdfLinks/PdfLinks';
import { PdfLinksProps } from '@/core/molecules/PdfLinks/PdfLinks.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: PdfLinksProps): JSX.Element => {
  return <PdfLinks {...props} />;
};
export default withDatasourceCheck()(Default);

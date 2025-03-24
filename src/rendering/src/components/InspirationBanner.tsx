import InspirationBanner from '@/core/molecules/InspirationBanner/InspirationBanner';
import { type InspirationBannerProps } from '@/core/molecules/InspirationBanner/InspirationBanner.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: InspirationBannerProps): JSX.Element => {
  return <InspirationBanner {...props} />;
};
export default withDatasourceCheck()(Default);

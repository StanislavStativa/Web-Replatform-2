import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { type MultiAssetBannerProps } from '../core/molecules/MultiAssetBanner/MultiAssetBanner.types';
import MultiAssetBanner from '@/core/molecules/MultiAssetBanner/MultiAssetBanner';

const Default = (props: MultiAssetBannerProps): JSX.Element => {
  return <MultiAssetBanner {...props} />;
};
export default withDatasourceCheck()(Default);

import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import FeaturedTiles from '@/core/molecules/FeaturedTiles/FeaturedTiles';
import { type FeaturedTilesProps } from '@/core/molecules/FeaturedTiles/FeaturedTiles.types';

const Default = (props: FeaturedTilesProps): JSX.Element => {
  return <FeaturedTiles {...props} />;
};
export default withDatasourceCheck()(Default);

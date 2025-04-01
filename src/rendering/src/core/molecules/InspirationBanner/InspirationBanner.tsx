import { type InspirationBannerProps } from './InspirationBanner.type';
import HeroBanner from '@/core/molecules/HeroBanner/HeroBanner';

const InspirationBanner = (props: InspirationBannerProps): JSX.Element => {
  return (
    <HeroBanner
      rendering={{
        fields: props?.rendering?.fields,
        componentName: props?.rendering?.componentName,
        params: props?.params,
      }}
      params={props?.params}
      isInspirationBanner={true}
    />
  );
};

export default InspirationBanner;

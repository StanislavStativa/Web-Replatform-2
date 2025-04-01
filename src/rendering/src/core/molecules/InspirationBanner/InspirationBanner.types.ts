import { ComponentRendering, ComponentParams } from '@sitecore-jss/sitecore-jss-nextjs';
import { HeroBannerFieldProps } from '../HeroBanner/HeroBanner.types';

export interface InspirationBannerProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: HeroBannerFieldProps;
  };
  params: ComponentParams;
}

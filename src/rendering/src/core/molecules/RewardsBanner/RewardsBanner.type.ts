import { ComponentRendering, ComponentParams, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface RewardsBannerProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: RewardsBannerFieldProps };
  params: ComponentParams;
}

export interface RewardsBannerFieldProps {
  LeftSectionDescription: Field<string>;
  RightSectionDescription: Field<string>;
  LeftSectionTitle: Field<string>;
  RightSectionTitle: Field<string>;
  SectionTitle: Field<string>;
  SectionDescription: Field<string>;
}

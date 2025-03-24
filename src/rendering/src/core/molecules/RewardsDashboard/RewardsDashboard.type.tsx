import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface RewardsDashboardProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: RewardsDashboardFields };
  params: ComponentParams;
}

export interface RewardsDashboardFields {
  Icon: ImageField;
  Title: Field<string>;
  Description: Field<string>;
  CTA: LinkField;
  SecondaryCTA: LinkField;
  PromotionMessage: Field<string>;
}

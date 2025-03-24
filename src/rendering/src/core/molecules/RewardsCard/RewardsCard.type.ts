import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export enum PRICING_TIER {
  RETAIL = 'RETAIL',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}
export interface RewardsCardProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: RewardsCardFieldProps };
  params: ComponentParams;
}
export interface RewardsCardFieldProps {
  CTA: LinkField;
  Description: Field<string>;
  EnableProUsers: Field<string>;
  Title: Field<string>;
  Diamond_Pro: ImageField;
  Gold_Pro: ImageField;
  Platinum_Pro: ImageField;
  Silver_Pro: ImageField;
}

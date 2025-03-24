import { ComponentParams, ComponentRendering, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface ShipToCTAProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: ShipToCTAfieldProps };
  params: ComponentParams;
}

export interface ShipToCTAfieldProps {
  Caution: ImageField;
  PickupStore: ImageField;
  ShippAddress: ImageField;
  ShippAddressHover: ImageField;
  PickupStoreHover: ImageField;
}

import { ComponentParams, ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ProductListingFields } from '../ProductListing/ProductListing.type';

export interface ProductsCarouselProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ProductsCarouselFieldProps;
  };
  params: ComponentParams;
}

export interface ProductsCarouselFieldProps extends ProductListingFields {
  SectionTitle: Field<string>;
  ButtonText: Field<string>;
  ButtonFunctionality: Field<string>;
}

import { LayoutServiceData, LayoutServiceContext } from '@sitecore-jss/sitecore-jss-nextjs';

export type LayoutServiceProps = LayoutServiceData & {
  sitecore?: {
    context?: LayoutServiceContext & {
      productData?: {
        ProductName: string;
        ProductDescription: string;
        ImageLink: string;
        ProductCode: string;
        IsOnlinePurchasableRetail: string;
        IsOnlinePurchasablePro: string;
        Price: number;
        Brand: string;
        MetaDescription: string;
        PageTitle: string;
        UrlSlug: string;
      };
    };
  };
};

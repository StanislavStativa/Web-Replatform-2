import {
  ComponentRendering,
  ComponentParams,
  TextField,
  Field,
  RichTextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ITypesProductCard {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesProductCardFields;
  };
  params: ComponentParams;
}
export type ITypesKitOption = {
  KitOptionTitle: {
    jsonValue: TextField;
  };
  DisableSubMenu: {
    jsonValue: Field<boolean>;
  };
  ButtonText: {
    jsonValue: TextField;
  };
  ButtonFunctionality: {
    jsonValue: Field<string>;
  };
  DiscoverRfkId: {
    jsonValue: Field<string>;
  };
  APIEndPoint: {
    jsonValue: Field<string>;
  };
  DefaultItemsPerPageDesktop: {
    jsonValue: Field<string>;
  };
  DefaultItemsPerPageMobile: {
    jsonValue: Field<string>;
  };
};
export type ITypesJasonValue = {
  jsonValue: {
    value: string;
  };
};

export interface ITypesProductCardFields {
  data: {
    dataSource: {
      KitOptionText: {
        jsonValue: TextField;
      };
      MobileDescription: ITypesJasonValue;
      Heading: {
        jsonValue: TextField;
      };
      ButtonText: {
        jsonValue: TextField;
      };
      BackgroundColor: ITypesJasonValue;
      MainThumbnailImage: {
        jsonValue: Field<string>;
      };
      HideSubMenu: {
        jsonValue: Field<boolean>;
      };
      HideThumbnailImages: {
        jsonValue: Field<boolean>;
      };
      ThumbnailImage1: {
        jsonValue: Field<string>;
      };

      ThumbnailImage2: {
        jsonValue: Field<string>;
      };
      ThumbnailImage3: {
        jsonValue: Field<string>;
      };
      ThumbnailImage4: {
        jsonValue: Field<string>;
      };
      ThumbnailImage5: {
        jsonValue: Field<string>;
      };
      ThumbnailImage6: {
        jsonValue: Field<string>;
      };
      ThumbnailImage7: {
        jsonValue: Field<string>;
      };
      ThumbnailImage8: {
        jsonValue: Field<string>;
      };
      ExtendedImageDescription: {
        jsonValue: RichTextField;
      };
      ExtendedImageMobiledescription: {
        jsonValue: RichTextField;
      };
      ExtendedImageHeading: {
        jsonValue: TextField;
      };
      ExtendedImageMobileHeading: {
        jsonValue: TextField;
      };
      ExtendedImageDesktopImage1: {
        jsonValue: Field<string>;
      };
      ExtendedImageDesktopImage2: {
        jsonValue: Field<string>;
      };
      ExtendedImageDesktopImage3: {
        jsonValue: Field<string>;
      };
      ExtendedImageMobileImage1: {
        jsonValue: Field<string>;
      };
      ExtendedImageMobileImage2: {
        jsonValue: Field<string>;
      };
      ExtendedImageMobileImage3: {
        jsonValue: Field<string>;
      };
      ExtendedImageTabletImage1: {
        jsonValue: Field<string>;
      };
      ExtendedImageTabletImage2: {
        jsonValue: Field<string>;
      };
      ExtendedImageTabletImage3: {
        jsonValue: Field<string>;
      };
      children: {
        results: ITypesKitOption[];
      };
      ExtendedProductCarouselAPIEndPoint: {
        jsonValue: Field<string>;
      };
      ExtendedProductCarouselButtonFunctionality: {
        jsonValue: Field<string>;
      };
      ExtendedProductCarouselDefaultItemsPerPageDesktop: {
        jsonValue: Field<string>;
      };
      ExtendedProductCarouselDefaultItemsPerPageMobile: {
        jsonValue: Field<string>;
      };
      ExtendedProductCarouselDiscoverPodID: {
        jsonValue: Field<string>;
      };
      ExtendedProductCarouselDiscoverRfkId: {
        jsonValue: Field<string>;
      };
      ExtendedProductCarouselTitle: {
        jsonValue: TextField;
      };
      ExtendedProductCarouselButtonText: {
        jsonValue: TextField;
      };
    };
  };
}

export interface ITypesThumbnailImage {
  jsonValue?: {
    value?: string;
  };
}

export type ITypesThumbnailObj = {
  imgUrl: string;
  id: string;
};

import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
export interface StoresPickupProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: StoresPickupFieldProps };
  params: ComponentParams;
}

export interface StoresPickupFieldProps {
  data: {
    stores: {
      name: string;
      id: string;
      children: {
        total: number;
        results: {
          name: string;

          fields: {
            name: string;
            value: string;
          }[];
        }[];
      };
    };
  };
}

export interface IFullAddressType {
  [key: string]: string | undefined;
}

export interface IFullData {
  label: string;
  value: string;
  addressInfo: IFullAddressType;
}

export interface GroupedByState {
  [state: string]: {
    value: string;
    label: string;
    misc: string | undefined;
    addressInfo: IFullAddressType;
  }[];
}

export interface PreferredStoreOption {
  label: string;
  options: {
    value: string;
    label: string;
    misc: string | undefined;
    addressInfo: IFullAddressType;
  }[];
}

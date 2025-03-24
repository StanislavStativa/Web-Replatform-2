import { useState, ChangeEvent, useEffect } from 'react';
import {
  GroupedByState,
  IFullAddressType,
  PreferredStoreOption,
  StoresPickupProps,
} from './StoresPickup.types';
import { useI18n } from 'next-localization';
import Select from '@/core/atoms/Form/Select/Select';
import { FormProvider, useForm } from 'react-hook-form';
import { useShipStore } from '@/store/useShipStore';
import { useShipTo } from '@/hooks/useShipTo';
import { storePickupSelectedData } from '@/data/atoms/storePickupSelectedData';
import { useAtom } from 'jotai';
import Cookies from 'js-cookie';
import { USR_PREFERRED_STORE } from '@/config';

const StoresPickup = (props: StoresPickupProps) => {
  const { children } = props?.rendering?.fields?.data?.stores;
  const userPreferredStore = Cookies.get(USR_PREFERRED_STORE);
  const [selectedStorePickUpData, setSelectedStorePickupData] = useState('');
  const { selectedShipCTa } = useShipStore();
  const { isOnlySamples, sampleAndItem } = useShipTo();
  const [, setStorePickupSetFormState] = useAtom(storePickupSelectedData);
  const [storeData, setStoreData] = useState<PreferredStoreOption[]>([]);
  const [selectedStorePickUpAddressData, setSelectedStorePickUpAddressData] =
    useState<IFullAddressType>({
      AddressLine1: '',
      City: '',
      PostalCode: '',
      StateCode: '',
      StoreName: '',
    });

  const { t } = useI18n();
  const methods = useForm({
    defaultValues: {
      pickAddress: '',
    },
  });

  //Component visibility as per item type
  const visibility =
    selectedShipCTa.selectedCta === 'pick'
      ? 'block'
      : isOnlySamples
        ? 'hidden'
        : sampleAndItem
          ? 'hidden'
          : 'hidden';

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event?.target?.value;
    const selectedOption = storeData
      ?.flatMap((option) => option?.options)
      ?.find((option) => option?.value === selectedValue);

    if (selectedOption) {
      methods.setValue('pickAddress', selectedValue);
      setSelectedStorePickupData(selectedValue);
      setSelectedStorePickUpAddressData(selectedOption?.addressInfo);
      setStorePickupSetFormState(selectedOption?.addressInfo);
    }
  };

  const transformStoreData = (data: {
    total?: number;
    results: {
      name: string;
      id?: string;
      fields: {
        name: string;
        value: string;
      }[];
    }[];
  }) => {
    const groupedByState: GroupedByState =
      data?.results &&
      data?.results
        ?.filter((store) => {
          const readyForDisplayField =
            store?.fields && store.fields.find((field) => field.name === 'ReadyForDisplay');
          return readyForDisplayField?.value === '1';
        })
        ?.reduce((acc: GroupedByState, store) => {
          const storeInfo =
            store?.fields &&
            store?.fields?.reduce((acc: { [key: string]: string | undefined }, field) => {
              acc[field.name] = field.value;
              return acc;
            }, {});

          const state = storeInfo?.StateCode ?? '';
          const storeName = storeInfo?.StoreName ?? '';
          const storeNumber = storeInfo?.StoreNumber ?? '';

          if (!state || !storeName || !storeNumber) return acc; // Skip items with missing values

          if (!acc[state]) {
            acc[state] = [];
          }

          acc[state]?.push({
            value: `${storeInfo.StoreName}, ${storeInfo.StateCode}`,
            label: `${storeInfo.StoreName}, ${storeInfo.StateCode}`,
            misc: storeInfo.StoreNumber,

            addressInfo: {
              storeId: store.id,
              StoreName: storeInfo.StoreName,
              AddressLine1: storeInfo.AddressLine1,
              City: storeInfo.City,
              StateCode: storeInfo.StateCode,
              PostalCode: storeInfo.PostalCode,
              sapStoreId: storeInfo.StoreNumber,
              merchantId: storeInfo?.MerchantId,
            },
          });

          return acc;
        }, {});

    // Transform grouped data into the desired structure and sort by label
    const preferredStoreOptions: PreferredStoreOption[] =
      groupedByState &&
      Object?.keys(groupedByState)
        ?.map((state) => ({
          label: state,
          options: groupedByState[state],
        }))
        ?.sort((a, b) => a?.label?.localeCompare(b.label)); // Sort alphabetically by label

    const firstStateKey = preferredStoreOptions?.[0]?.label;
    const firstStoreOption = groupedByState[firstStateKey]?.[0]?.addressInfo;

    if (firstStoreOption) {
      setSelectedStorePickUpAddressData({
        storeId: firstStoreOption.storeId ?? '',
        sapStoreId: firstStoreOption.sapStoreId ?? '',
        AddressLine1: firstStoreOption.AddressLine1 ?? '',
        City: firstStoreOption.City ?? '',
        PostalCode: firstStoreOption.PostalCode ?? '',
        StateCode: firstStoreOption.StateCode ?? '',
        StoreName: firstStoreOption.StoreName ?? '',
        merchantId: firstStoreOption?.merchantId,
      });

      // setStorePickupSetFormState(firstStoreOption);
    }

    return preferredStoreOptions;
  };

  useEffect(() => {
    if (children) {
      const userStore = userPreferredStore ?? '';

      // Transform the data
      const transformedData: PreferredStoreOption[] = transformStoreData(children);

      // Initialize to the first option by default
      let selectedOption = transformedData?.[0]?.options?.[0];

      // Find the matching group and option
      transformedData?.forEach((group) => {
        group.options?.forEach((option) => {
          if (option?.misc === userStore) {
            selectedOption = option;
          }
        });
      });

      // Update the store data to only include the selected group and option

      setStoreData(transformedData);
      setSelectedStorePickupData(selectedOption?.value);
      setSelectedStorePickUpAddressData(selectedOption?.addressInfo);
      setStorePickupSetFormState(selectedOption?.addressInfo);
      methods.reset({
        pickAddress: selectedOption?.value, // Set the entire option object
      });
    }
  }, [children, userPreferredStore]);

  return (
    <div className={`container mx-auto pt-6 px-5 md:px-0 ${visibility}`}>
      <div
        className={`rounded-xl  w-full grid grid-cols-10 border border-border-gray bg-white py-6 px-4 md:px-10 `}
      >
        <div className="col-span-full md:col-span-6">
          <FormProvider {...methods}>
            <div className="flex flex-col gap-y-4">
              <h4 className="text-2xl text-dark-gray">{t('Cart_SelectLocalStore')}</h4>
              <div className="flex flex-col gap-y-2.5">
                <Select
                  name="pickAddress"
                  value={selectedStorePickUpData}
                  onChange={handleSelectChange}
                  groups={storeData}
                  className={`w-full h-50 text-black `}
                  defaultValue={storeData?.[0]?.options?.[0]?.value}
                />

                <div className="flex flex-col text-dark-gray">
                  <p className="font-bold">
                    {t('label_tts')} {selectedStorePickUpAddressData?.StoreName}
                  </p>
                  <p>{selectedStorePickUpAddressData?.AddressLine1}</p>
                  <div className="flex gap-x-1">
                    <p>
                      {selectedStorePickUpAddressData?.City}
                      <span>,</span>
                    </p>
                    <p>{selectedStorePickUpAddressData?.StateCode}</p>
                    <p>{selectedStorePickUpAddressData?.PostalCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default StoresPickup;

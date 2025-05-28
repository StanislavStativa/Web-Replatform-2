import React, { useState } from 'react';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import Image from '@/core/atoms/Image/Image';
import Button from '@/core/atoms/Button/Button';
import Select from '@/core/atoms/Select/Select';
import { SelectVariant } from '@/core/atoms/Form/Select/Select.type';
import { SIZE } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { useI18n } from 'next-localization';
import {
  ColorTilesSelect,
  MaterialsTilesSelect,
  ShapeTilesSelect,
  type TileSearchProps,
  type FormDataType,
  TileSearchFacet,
} from './TileSearch.type';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import ProductAPI, { UUID } from '../ProductListing/ProductAPI';
import { useQuery } from '@tanstack/react-query';
import useImageFormat from '@/hooks/useImageFormat';
import { getPriceGroup } from '@/utils/getPriceGroup';
import useLocalStorage from '@/utils/useLocalStorage';

const TileSearch: React.FC<TileSearchProps> = (props) => {
  const {
    rendering: { fields },
    params,
  } = props;

  const { t } = useI18n();
  const router = useRouter();
  const { setSessionData } = useLocalStorage();
  const { CTAColor, CTASize, HeadingTag } = params || {};
  const dataSource = fields?.data?.datasource;
  const { Title, Description } = dataSource || {};
  const colorOptions = dataSource?.Colors?.targetItems || [];
  const shapeOptions = dataSource?.Shapes?.targetItems || [];
  const materialOptions = dataSource?.Materials?.targetItems || [];
  const [formData, setFormData] = useState<FormDataType>({});

  const { Image: BannerImage, MobileImage, TabletImage, ImageSmartCropFormat } = dataSource;

  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage,
    ImageSmartCropFormat,
    MobileImage,
    TabletImage,
  });
  const priceGroup = getPriceGroup();
  const payload = {
    context: {
      page: { uri: router?.asPath },
      store: { id: priceGroup },
      user: { uuid: UUID },
    },

    widget: { rfkid: dataSource.DiscoverRfkId?.value },
    facet: {
      color: {
        value: [],
      },
      shape: {
        value: [],
      },
      material: {
        value: [],
      },
    },
  };

  const { data } = useQuery({
    queryKey: ['tileSearch'],
    queryFn: () => ProductAPI({ pageParam: payload }),
    refetchOnWindowFocus: false,
  });

  const onSelectChange = (name: string) => (value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const onSearch = () => {
    let url = '';
    let params = {};

    if (!Object.keys(formData).length) return;

    if (formData.shape) {
      url = shapeOptions.find((val) => val?.FacetName?.value === formData.shape)?.url?.path ?? '';
    }

    if (formData.facet_color && !url) {
      url =
        colorOptions.find((val) => val?.FacetName?.value === formData.facet_color)?.url?.path ?? '';
    }

    if (formData.facet_material && !url) {
      url =
        materialOptions.find((val) => val?.FacetName?.value === formData.facet_material)?.url
          ?.path ?? '';
    }

    const colorFacetItem: TileSearchFacet = data?.facet?.color?.value?.find(
      (facet: TileSearchFacet) => {
        return facet?.text?.toLowerCase() === formData?.facet_color?.toLowerCase();
      }
    );

    const shapeFacetItem: TileSearchFacet = data?.facet?.shape?.value?.find(
      (facet: TileSearchFacet) => {
        return facet?.text?.toLowerCase() === formData?.shape?.toLowerCase();
      }
    );

    const materialFacetItem: TileSearchFacet = data?.facet?.material?.value?.find(
      (facet: TileSearchFacet) => {
        return facet?.text?.toLowerCase() === formData?.facet_material?.toLowerCase();
      }
    );

    if (formData.facet_color) params = { ...params, facet_color: colorFacetItem?.id };

    if (formData.facet_material) {
      params = { ...params, facet_material: materialFacetItem?.id };
    }

    if (formData.shape) {
      params = { ...params, facet_shape: shapeFacetItem?.id };
    }
    setSessionData('tts_fromSearch', 'true');
    router.push({
      pathname: url,
      query: params,
    });
  };

  const formMethods = useForm();
  const isCTADisabled = !Object.keys(formData).length;

  return (
    <section className="container px-5 md:px-10 mx-auto">
      <div
        className={cn(
          'max-w-screen-xl mx-auto flex flex-col items-start md:flex-row bg-dark-gray justify-center rounded-xl md:h-336 lg:h-328',
          params?.GridParameters,
          params?.styles
        )}
      >
        {desktopImage?.url || tabletImage?.url || mobileImage?.url ? (
          <div className="relative hidden md:block md:w-2/5 rounded-l-xl overflow-hidden md:mr-6">
            <Image
              alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
              className="w-full h-full object-cover md:h-336 lg:h-328"
              desktopSrc={desktopImage?.url}
              tabletSrc={desktopImage?.url}
              mobileSrc={desktopImage?.url}
            />
          </div>
        ) : null}
        <div className="md:w-3/5 text-center md:text-left my-6 md:my-0 md:mt-9 px-10 md:pl-0 lg:px-10 md:mb-3">
          <Text
            field={Title}
            editable
            tag={HeadingTag || 'h3'}
            className="mb-4 md:mb-5 text-white font-normal text-2xl md:text-32"
          />
          <RichText
            editable
            className="text-base mb-7 font-normal text-white"
            field={Description}
          />
          <FormProvider {...formMethods}>
            <div className="flex flex-col md:flex-row md:space-x-4 w-full">
              <div role="none" className="w-full md:mb-3 mb-6">
                <Select
                  name="shape"
                  options={shapeOptions
                    .map((shape: ShapeTilesSelect) => {
                      return {
                        label: shape.FacetName.value,
                        value: shape.FacetName.value,
                        icon: shape?.Icon?.jsonValue?.value?.src,
                      };
                    })
                    .flat()}
                  variant={SelectVariant.OUTLINED}
                  size={SIZE.MEDIUM}
                  listStyle="py-2 px-3 gap-2"
                  className="rounded-md border border-dark-gray py-3 px-6 text-dark-gray"
                  optionstyle="rounded-lg border border-dark-gray py-3 text-base"
                  defaultLabel="Shape"
                  selected={formData.shape}
                  onSelect={onSelectChange('shape')}
                />
              </div>
              <div role="none" className="w-full md:mb-3 mb-6">
                <Select
                  name="selectColor"
                  options={colorOptions
                    .map((color: ColorTilesSelect) => {
                      return {
                        label: color?.FacetName?.value,
                        value: color?.FacetName?.value,
                        icon: color?.Icon?.jsonValue?.value?.src,
                      };
                    })
                    .flat()}
                  variant={SelectVariant.OUTLINED}
                  size={SIZE.MEDIUM}
                  listStyle="py-2 px-3 gap-2"
                  className="rounded-md border border-dark-gray py-3 px-6 text-dark-gray"
                  optionstyle="rounded-lg border border-dark-gray py-3 text-base"
                  defaultLabel="Color"
                  selected={formData.facet_color}
                  onSelect={onSelectChange('facet_color')}
                />
              </div>
              <div role="none" className="w-full md:mb-3 mb-6 ">
                <Select
                  name="selectMaterial"
                  options={materialOptions
                    .map((material: MaterialsTilesSelect) => {
                      return {
                        label: material?.FacetName?.value,
                        value: material?.FacetName?.value,
                        icon: material?.Icon?.jsonValue?.value?.src,
                      };
                    })
                    .flat()}
                  variant={SelectVariant.OUTLINED}
                  size={SIZE.MEDIUM}
                  listStyle="py-2 px-3 gap-2"
                  className="rounded-md border border-dark-gray py-3 px-6 text-dark-gray"
                  optionstyle="rounded-lg border border-dark-gray py-3 text-base"
                  defaultLabel="Material"
                  selected={formData.facet_material}
                  onSelect={onSelectChange('facet_material')}
                />
              </div>
            </div>
          </FormProvider>

          <div className="mt-5 md:mt-4 md:mb-3">
            <Button
              className={cn(
                'inline-flex py-3 px-6 items-center justify-center rounded-md text-sm font-latoBold w-full md:w-fit',
                isCTADisabled ? 'opacity-50 cursor-not-allowed' : '',
                !isCTADisabled
                  ? 'hover:bg-white hover:border hover:border-white hover:text-dark-gray'
                  : ''
              )}
              onClick={onSearch}
              onKeyDown={onSearch}
              variant={CTAColor as ButtonVariant}
              isCTATextInCaps={props?.params?.IsCTATextInCaps}
              size={CTASize as SIZE}
            >
              {t('Labels_Search')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TileSearch;

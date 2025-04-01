import { PdfLinksProps } from './PdfLinks.types';
import { useForm, FormProvider } from 'react-hook-form';
import { useState } from 'react';
import Button from '@/core/atoms/Button/Button';
import { useI18n } from 'next-localization';
import { SIZE } from '@/utils/constants';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import CustomSelect from '@/core/atoms/Select/Select';

const PdfLinks: React.FC<PdfLinksProps> = (props) => {
  const { targetItems } = props?.rendering?.fields?.data?.datasource?.PDFs ?? { targetItems: [] };

  const [selectedSeriesData, setSelectedSeriesData] = useState('');
  const { t } = useI18n();

  const methods = useForm();
  const seriesDropdownValues = targetItems?.map((item) => ({
    value: `${process.env.NEXT_PUBLIC_DAM_PDF_URL}${item?.Link?.value}`,
    label: item?.name?.value,
  }));

  const handleSelectChange = (value: string) => {
    setSelectedSeriesData(value);
  };

  const handleDownloadClick = (event: React.FormEvent) => {
    if (selectedSeriesData) {
      event.preventDefault();
      window.open(selectedSeriesData);
    }
  };

  return (
    <div className="container mx-auto">
      <FormProvider {...methods}>
        <form className="w-full sm:w-72 md:w-44 flex flex-col gap-y-2.5">
          <CustomSelect
            selected={selectedSeriesData}
            options={seriesDropdownValues}
            onSelect={handleSelectChange}
            defaultLabel={t('Labels_select_series')}
            type="button"
            optionstyle="border !border-light-gray !border-solid rounded-md !py-3 md:min-w-300 md:w-auto w-full"
            className="!px-2.5 !py-1.5 !rounded-md !border-input-border-gray md:min-w-300 md:w-auto w-full "
            listStyle="py-2 px-3 gap-2 text-left"
          />

          <Button
            variant={props?.params?.CTAColor as ButtonVariant}
            size={props?.params?.CTASize as SIZE}
            onClick={handleDownloadClick}
            isCTATextInCaps={props?.params?.IsCTATextInCaps}
            className="hover:font-latoBold w-fit bg-tonal-gray text-dark-gray hover:hover:shadow-lg transition-shadow"
          >
            {t('Labels_Download_PDF')}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default PdfLinks;

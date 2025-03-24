import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  ITypesAdvanceFilters,
  ITypesAdvanceSearchForm,
  ITypesFilters,
  ITypesFiltersVal,
} from '../AdvanceSearch.type';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { useI18n } from 'next-localization';
import Select from '@/core/atoms/Form/Select/Select';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import Button from '@/core/atoms/Button/Button';
import InputFormField from './InputFormField';
import Calendar from '@/core/atoms/Calendar/Calendar';
import { ADVANCESEARCHDROPSID, DOCUMNETTYPE, USEORDERENDPOINT } from '@/utils/constants';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { getAdvanceSearchParam } from '@/utils/config';
import { formatDateTypeA } from '@/utils/dateUtils';
import { useQuery } from '@tanstack/react-query';
import { MyAccountService } from '@/api/services/MyAccountService';
import useDownloadFile from '@/hooks/useDownloadFile';
const AdvanceSearchForm = ({
  isOrderHistory,
  isQuotes,
  isSelectionSheet,
  isPaymentHistory,
  isBillingHistory,
  fetchOrderHistory,
  message,
  isDownload,
  docType,
}: ITypesAdvanceSearchForm) => {
  const { t } = useI18n();
  const { mutate: download, isPending: isDownloading } = useDownloadFile();
  const [filters, setFilters] = useState<ITypesFilters[]>([]);
  const [statusOptions, setStatusOptions] = useState<ITypesAdvanceFilters | undefined>(undefined);
  const [searchByOptions, setSearchByOptions] = useState<ITypesAdvanceFilters | undefined>(
    undefined
  );
  const [orderTypeOptions, setOrderTypeOptions] = useState<ITypesAdvanceFilters | undefined>(
    undefined
  );
  const [periodOptions, setPeriodOptions] = useState<ITypesAdvanceFilters | undefined>(undefined);
  const [filterByOptions, setFilterByOptions] = useState<ITypesAdvanceFilters | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [isTextBox, setIsTextBox] = useState<boolean>(false);
  const [featureLabel, setFeatureLable] = useState<string>('');
  const [filterLabel, setFilterLable] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const { data: filtersData, isLoading } = useQuery({
    queryKey: ['getFiltersData', docType],
    queryFn: () => {
      return MyAccountService.myAccountGetDocumentFilters(docType);
    },
    enabled: Boolean(docType && docType !== ''),
  });

  const columnParm = getAdvanceSearchParam(
    isBillingHistory,
    isPaymentHistory,
    isQuotes,
    isOrderHistory
  );

  const getEndPoint = (): USEORDERENDPOINT => {
    if (isOrderHistory) {
      return USEORDERENDPOINT.ORDER;
    } else if (isSelectionSheet) {
      return USEORDERENDPOINT.SELECTION;
    } else if (isPaymentHistory) {
      return USEORDERENDPOINT.PAYMENT;
    } else if (isBillingHistory) {
      return USEORDERENDPOINT.BILLING;
    } else {
      return USEORDERENDPOINT.QUOTES;
    }
  };
  const getDropDownDetails = useMemo(() => {
    return (id: string): ITypesAdvanceFilters | undefined => {
      const filter = filters ? filters.find((item) => item.id === id) : undefined;
      if (filter) {
        // Find the selected value
        const selectedValue = filter.values.find((value: ITypesFiltersVal) => value.isSelected);
        if (selectedValue) {
          filter.isSelected = selectedValue;
        }
      }
      return filter;
    };
  }, [filters]);

  const formMethods = useForm({
    defaultValues: {
      searchBy: '',
      periodType: '',
      orderType: '',
      status: '',
      periodFrom: '',
      periodTo: '',
      searchText: '',
      filterBy: '',
    },
  });
  const watchPeriodFrom = formMethods.watch('periodFrom');
  const watchPeriodType = formMethods.watch('periodType');
  const watchSearchBy = formMethods.watch('searchBy');
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission

    formMethods.handleSubmit((data) => {
      const isDateRange = Boolean(data?.periodType === 'RANGE');
      const wecoFilter = {
        siteId: '',
        status: data?.status || '',
        statusDue: '',
        period: isDateRange
          ? `${data.periodType}(${formatDateTypeA(data.periodFrom)}-${formatDateTypeA(data.periodTo)})`
          : data?.periodType,
        searchBy: data?.searchBy && data?.searchText ? `${data.searchBy}[${data.searchText}]` : '',
        customer: '',
        shipToSelection: '',
        orderType: data?.orderType,
        currency: '',
        filterBy: data?.filterBy,
      };
      fetchOrderHistory(wecoFilter, getEndPoint());
    })(event);
  };

  //Once the data is fetched reInitializing form with new value
  useEffect(() => {
    formMethods.reset({
      periodType: periodOptions?.isSelected?.value,
      orderType: orderTypeOptions?.isSelected?.value,
      status: statusOptions?.isSelected?.value,
      searchBy:
        searchByOptions?.isSelected?.value === '000' ? '' : searchByOptions?.isSelected?.value,
      filterBy: filterByOptions?.isSelected?.value,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchByOptions, periodOptions, statusOptions, orderTypeOptions, currentPage]);

  useEffect(() => {
    if (watchPeriodType !== '') {
    }
  }, [formMethods, watchPeriodType]);

  useEffect(() => {
    if (watchPeriodFrom !== '') {
    }
  }, [formMethods, watchPeriodType, watchPeriodFrom]);
  useEffect(() => {
    if (filters) {
      const getStatusDetails = getDropDownDetails(ADVANCESEARCHDROPSID.STATUS);
      const getSearchDetails = getDropDownDetails(ADVANCESEARCHDROPSID.CHAR);
      const getOrderDetails = getDropDownDetails(ADVANCESEARCHDROPSID.ORDER);
      const periodDetails = getDropDownDetails(ADVANCESEARCHDROPSID.PERIODE);
      const filterByDetails = getDropDownDetails(ADVANCESEARCHDROPSID.FILTERBY);
      //filter out the Choose Feature
      const filteredSearchByOptions = getSearchDetails?.dropOptions?.filter(
        (option) => option?.value !== '000'
      );
      const getFeatureLabel = getSearchDetails?.dropOptions?.filter(
        (option) => option?.value === '000'
      )?.[0]?.label;
      setFeatureLable(getFeatureLabel as string);

      // update the data obj with filter
      const updatedSearchByOption = { ...getSearchDetails, dropOptions: filteredSearchByOptions };

      //filter out the Choose filters
      const filteredFilterByOptions = filterByDetails?.dropOptions?.filter(
        (option) => option?.value !== ''
      );
      const getFilterLabel = filterByDetails?.dropOptions?.filter(
        (option) => option?.value === ''
      )?.[0]?.label;
      setFilterLable(getFilterLabel as string);

      // update the data obj with filter
      const updatedFilterByOption = { ...filterByDetails, dropOptions: filteredFilterByOptions };

      setStatusOptions(getStatusDetails);
      setSearchByOptions(updatedSearchByOption as ITypesAdvanceFilters);
      setOrderTypeOptions(getOrderDetails);
      setPeriodOptions(periodDetails);
      setFilterByOptions(updatedFilterByOption as ITypesAdvanceFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  useEffect(() => {
    if (isDownload === true) {
      const isRange = Boolean(formMethods.getValues('periodType') === 'RANGE');
      const wecoFilter = {
        siteId: '',
        status: formMethods.getValues('status') || '',
        statusDue: '',
        period: isRange
          ? `${formMethods.getValues('periodType')}[${formMethods.getValues('periodFrom')}-${formMethods.getValues('periodTo')}]`
          : formMethods.getValues('periodType'),
        searchBy:
          formMethods.getValues('searchBy') && formMethods.getValues('searchText')
            ? `${formMethods.getValues('searchBy')}[${formMethods.getValues('searchText')}]`
            : '',
        customer: '',
        shipToSelection: '',
        downloadType: DOCUMNETTYPE.XLSX,
        documentType: docType,
      };

      download(wecoFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDownload]);

  useEffect(() => {
    setCurrentPage(columnParm);
  }, [columnParm]);

  useEffect(() => {
    if (watchSearchBy !== '') {
      setIsTextBox(true);
    } else {
      setIsTextBox(false);
    }
  }, [watchSearchBy]);
  useEffect(() => {
    if (watchPeriodType === 'RANGE') {
      setShowCalendar(true);
    } else {
      setShowCalendar(false);
      formMethods.setValue('periodTo', '');
      formMethods.setValue('periodFrom', '');
    }
  }, [formMethods, watchPeriodType]);

  useEffect(() => {
    if (filtersData && filtersData?.length > 0) {
      const transformedFilters: ITypesFilters[] = filtersData?.map((filter: ITypesFilters) => ({
        ...filter,
        dropOptions: filter.values.map((value: ITypesFiltersVal) => ({
          value: value.value,
          label: value.description?.replace(/[()]/g, ''),
        })),
      }));
      setFilters(transformedFilters);
    } else {
      setFilters([]);
    }
  }, [filtersData]);

  return (
    <FormProvider {...formMethods}>
      <div className="grid grid-cols-1 md:grid-cols-12">
        {(isDownloading || isLoading) && <LoaderSpinner />}
        <form
          onSubmit={onSubmit}
          className="col-span-1 md:col-span-10 md:col-start-1 flex flex-col gap-y-4"
          id="quotes-search" //Todo>> id as per page
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3  gap-x-5 gap-y-5">
            {statusOptions?.isHidden === false && (
              <div>
                <label className="mb-2 block text-xs font-medium">
                  {statusOptions?.description}
                </label>
                <Controller
                  name="status"
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      {...field}
                      options={statusOptions?.dropOptions ? statusOptions?.dropOptions : []}
                      className={`w-full h-50 ${error && 'border-red-500 bg-light-red  placeholder-light-slate-red'}`}
                      placeholder={statusOptions?.description}
                      showNonSelectableDefaultOption={false}
                    />
                  )}
                />
              </div>
            )}
            {searchByOptions?.isHidden === false && (
              <div>
                <label className="mb-2 block text-xs font-medium">
                  {searchByOptions?.description}
                </label>
                <Controller
                  name="searchBy"
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      {...field}
                      options={searchByOptions?.dropOptions ? searchByOptions?.dropOptions : []}
                      className={`w-full h-50 px-3 ${error && 'border-red-500 bg-light-red  placeholder-light-slate-red'}`}
                      placeholder={featureLabel}
                      showNonSelectableDefaultOption={true}
                      selectDefaultValue={featureLabel}
                      chevRonClass="right-1"
                    />
                  )}
                />
              </div>
            )}
            {orderTypeOptions?.isHidden === false && (
              <div>
                <label className="mb-2 block text-xs font-medium">
                  {orderTypeOptions?.description}
                </label>
                <Controller
                  name="orderType"
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      {...field}
                      options={orderTypeOptions?.dropOptions ? orderTypeOptions?.dropOptions : []}
                      className={`w-full h-50 ${error && 'border-red-500 bg-light-red  placeholder-light-slate-red'}`}
                      placeholder={orderTypeOptions?.description}
                    />
                  )}
                />
              </div>
            )}
            {filterByOptions?.isHidden === false && (
              <div>
                <label className="mb-2 block text-xs font-medium">
                  {filterByOptions?.description}
                </label>
                <Controller
                  name="filterBy"
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      {...field}
                      options={filterByOptions?.dropOptions ? filterByOptions?.dropOptions : []}
                      className={`w-full h-50 pr-10 ${error && 'border-red-500 bg-light-red  placeholder-light-slate-red'}`}
                      placeholder={filterLabel}
                      showNonSelectableDefaultOption={true}
                      selectDefaultValue={filterLabel}
                    />
                  )}
                />
              </div>
            )}
          </div>
          {isTextBox && (
            <div className="grid grid-cols-1   gap-x-5 gap-y-5">
              <InputFormField name="searchText" inputType="text" placeholder={''} labelText={''} />
            </div>
          )}

          <div className={'grid grid-cols-1 md:grid-cols-3  gap-x-5 gap-y-5'}>
            {periodOptions?.isHidden === false && (
              <div>
                <label className="mb-2 block text-xs font-medium">{t('Labels_PeriodType')}</label>
                <Controller
                  name="periodType"
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      {...field}
                      options={periodOptions?.dropOptions ? periodOptions?.dropOptions : []}
                      className={`w-full h-50 ${error && 'border-red-500 bg-light-red  placeholder-light-slate-red'}`}
                      placeholder={periodOptions?.description}
                      showNonSelectableDefaultOption={false}
                      chevRonClass="right-1"
                    />
                  )}
                />
              </div>
            )}

            {showCalendar && (
              <div>
                <label className="mb-2 block text-xs font-medium">{t('label_period')}</label>
                <Calendar
                  name="periodFrom"
                  formMethodsValue={formMethods}
                  isDateBtn={false}
                  calendarStyles="w-full"
                  placeholderText={t('label_from')}
                  isToday={false}
                  maxDate={new Date()}
                  isChevron
                />
              </div>
            )}
            {showCalendar && (
              <div>
                <label className="mb-2 block text-xs font-medium invisible">
                  {t('Labels_PeriodType')}
                </label>
                <Calendar
                  name="periodTo"
                  formMethodsValue={formMethods}
                  isDateBtn={false}
                  calendarStyles="w-full"
                  placeholderText="To"
                  isToday={false}
                  maxDate={new Date()}
                  minDate={watchPeriodFrom}
                  isChevron
                />
              </div>
            )}
          </div>
          <div className="w-full md:w-auto flex justify-left gap-4 mt-2">
            <Button variant={ButtonVariant.BLACK} isTypeSubmit={true} className="w-full md:w-auto">
              <p className="text-sm">{t('Invoice_Search')}</p>
            </Button>
          </div>

          {message?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="col-span-1 md:col-span-7 md:col-start-1 inline-flex items-center gap-x-2 bg-tonal-gray border mx-1 p-3  mb-2 mt-2">
                <IoIosInformationCircleOutline size={'15px'} />
                <p className="text-xs">{isQuotes ? t('NoResults_Quotations') : message}</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </FormProvider>
  );
};

export default memo(AdvanceSearchForm);

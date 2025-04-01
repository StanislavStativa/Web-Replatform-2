import { WECOFilterRequest } from '@/api/models/WECOFilterRequest';
import {
  ITypesFilters,
  ITypesFiltersVal,
  ITypesOrderDocument,
  ITypesPdf,
} from '@/core/molecules/AdvanceSearch/AdvanceSearch.type';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { MyAccountService } from '@/api/services/MyAccountService';
import { isPDfCheckVal, USEORDERENDPOINT } from '@/utils/constants';
import { checkZeroData, formatDate } from '@/utils/dateUtils';

export type EndpointType = USEORDERENDPOINT;

const useOrderHistory = () => {
  const [filters, setFilters] = useState<ITypesFilters[]>([]);
  const [searchTableData, setSearchTableData] = useState<ITypesOrderDocument[]>([]);
  const [message, setMessage] = useState('');
  const [docType, setDocType] = useState<string>('');
  const [totalPaymentAmount, setTotalPaymentAmount] = useState<number>(0);

  const fetchData = async (data: WECOFilterRequest, endpoint: EndpointType) => {
    switch (endpoint) {
      case 'orders':
        return await MyAccountService.myAccountGetOrders(data);
      case 'selectionSheets':
        return await MyAccountService.myAccountGetSelectionSheets(data);
      case 'quotes':
        return await MyAccountService.myAccountGetQuotes(data);
      case 'billing':
        return await MyAccountService.myAccountGetBillingHistory(data);
      case 'payment':
        return await MyAccountService.myAccountPaymentCreditMemoHistory(false, data);
      default:
        throw new Error('Invalid endpoint');
    }
  };

  const { mutate: getOrderHistory, isPending } = useMutation({
    mutationFn: async ({ data, endpoint }: { data: WECOFilterRequest; endpoint: EndpointType }) => {
      return await fetchData(data, endpoint);
    },
    onSuccess: (data) => {
      if (data) {
        setTotalPaymentAmount(data?.totals?.[0]?.total);
        // Transform values to dropOptions
        const transformedFilters: ITypesFilters[] = data.filters.map((filter: ITypesFilters) => ({
          ...filter,
          dropOptions: filter.values.map((value: ITypesFiltersVal) => ({
            value: value.value,
            label: value.description?.replace(/[()]/g, ''),
          })),
        }));
        setDocType(data?.documentType);
        const documents = data?.documents;
        // let modifiedData: ITypesOrderDocument[] = [];
        if (documents?.length > 0) {
          setMessage('');

          const modifiedData = documents.map((item: ITypesOrderDocument) => {
            const isPdf =
              item?.pdfs?.length > 0 &&
              item?.pdfs?.filter((item: ITypesPdf) => item?.headerDescription === isPDfCheckVal);
            const clearingData = item?.clearingDate || item?.zzcustom?.clearDate || '';
            return {
              id: item?.id,
              status: item?.status || item?.zzcustom?.customStatus || '',
              documentNumber: item?.id.replace(/^00/, ''),
              date: formatDate(item?.date) || formatDate(item?.documentDate),
              poNumber: item?.referenceNumber,
              referred: item?.zzcustom?.orderType,
              orderTotal: `$${Number(item?.total)?.toFixed(2)}`,
              documentType:
                item?.clearingDocumentNumber ?? item?.zzcustom?.documentTypeFiDescription,
              clearingDate: checkZeroData(clearingData),
              invoice: item?.id.replace(/^00/, ''),
              amount: `$${Number(item?.total)?.toFixed(2)}`,
              saleTotal: `$${Number(item?.total)?.toFixed(2)}`,
              orderNumber: item?.zzcustom?.orderNumber,
              paid: `$${Number(item?.netValuePayed)?.toFixed(2)}`,
              open: `$${Number(item?.netValueOpen)?.toFixed(2)}`,
              dueDate: item?.dueTo,
              in: isPdf ? `${isPdf[0]?.id}` : '',
              customer: item?.customerAddress,
            };
          });

          setSearchTableData(modifiedData);
        } else {
          setSearchTableData([]);
          setMessage(data?.messages?.[0]?.message);
        }

        setFilters(transformedFilters);
      } else {
        setFilters([]);
        setSearchTableData([]);
      }
    },
    onError: () => {
      setSearchTableData([]);
      setFilters([]);
    },
  });

  // Method to fetch order history with the provided filters
  const fetchOrderHistory = (filters: WECOFilterRequest, endpoint: EndpointType) => {
    getOrderHistory({ data: filters, endpoint });
  };

  return {
    filters,
    searchTableData,
    fetchOrderHistory,
    message,
    isPending,
    docType,
    totalPaymentAmount,
  };
};

export default useOrderHistory;

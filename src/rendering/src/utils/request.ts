import axios from 'axios';
import { OrderCloudError } from 'ordercloud-javascript-sdk';

export const handleErrors = (error: OrderCloudError) => {
  if ((error as OrderCloudError).isOrderCloudError) {
    const oc_error = error as OrderCloudError;
    return {
      status: oc_error.status,
      message: oc_error.errorCode,
      data: oc_error.errors,
    };
  }

  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status as number,
      message: (error.response?.data as { error_description: string }).error_description,
    };
  }

  return {
    status: 500,
    message: 'Unknown error',
  };
};

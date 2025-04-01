import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '@/api'; // Adjust the import according to your project structure

const useProductItemDetails = (productId: string) => {
  const queryClient = useQueryClient();

  const triggerRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['getProductItemDetails', productId] });
  };

  const { mutate, data, error } = useMutation({
    mutationKey: ['getProductItemDetails', productId],
    mutationFn: () => ProductService.productGetProductItemDetails(productId),
    onSuccess: () => {
      triggerRefetch();
    },
    onError: () => {
      console.log('there was an error');
      //alert('there was an error');
    },
    onSettled: () => {
      triggerRefetch();
    },
  });

  useEffect(() => {
    if (productId) {
      mutate();
    }
  }, [mutate, productId]);

  return {
    data,
    error,
    refetch: mutate, // Expose the mutate function as refetch for manual triggering
  };
};

export default useProductItemDetails;

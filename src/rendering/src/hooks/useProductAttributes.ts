import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ProductService } from '@/api/services/ProductService';
import { ProductProps } from '@/core/molecules/ProductAttributes/ProductAttributes.types';
import { checkAnonymousAndRefreshToken } from '@/utils/authUtils';
import { anonymousSignIn } from '@/data/order-cloud/auth.service';

// Custom hook to get cart state
export const useProductAttributes = (isFetchEnabled = true, productId: string | undefined) => {
  const [productAttributesData, setProductAttributesData] = useState<null | ProductProps>(null);
  const { data: fetchedAttributesData, isLoading } = useQuery({
    queryKey: ['getProductAttributes', productId],
    queryFn: async () => {
      console.time('getProductAttributes');
      const tokenRefreshed = await checkAnonymousAndRefreshToken(); // Call the common function
      if (tokenRefreshed) {
        await anonymousSignIn();
      }
      const attributes = await ProductService.productGetProductAttributes(productId);
      console.timeEnd('getProductAttributes'); // Ensure this is after the awaited call and reachable
      return attributes;
    },
    enabled: Boolean(isFetchEnabled && productId && productId !== ''),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (fetchedAttributesData) {
      setProductAttributesData(fetchedAttributesData);
    } else {
      setProductAttributesData(null);
    }
  }, [fetchedAttributesData]);
  return { productAttributesData, isLoading };
};

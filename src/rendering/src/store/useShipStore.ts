import { authorizationAtom } from '@/data/atoms/authorization';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

export interface ITypesShipToCta {
  selectedCta: 'pick' | 'ship' | null;
}

// Define the atom with an initial value
const selectedShipCtaAtom = atom<ITypesShipToCta>({ selectedCta: null });

export const useShipStore = () => {
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const [selectedShipCTa, setSelectedShipCTa] = useAtom(selectedShipCtaAtom);

  const handleSetSelectedShipCta = (selectedCta: ITypesShipToCta) => {
    setSelectedShipCTa(selectedCta);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedShipCTa({ selectedCta: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return {
    selectedShipCTa,
    handleSetSelectedShipCta,
  };
};

import Cookies from 'js-cookie';
import { PRICE_GP } from '@/config';

export const getPriceGroup = () => {
  const tokenizedVal = Cookies.get(PRICE_GP);

  // Determine the card brand based on the extracted value
  switch (tokenizedVal) {
    case 'GOLD':
      return 'P12';
    case 'PLATINUM':
      return 'P11';
    case 'DIAMOND':
      return 'P10';
    case 'SILVER':
      return 'P13';
    default:
      return 'Retail';
  }
};

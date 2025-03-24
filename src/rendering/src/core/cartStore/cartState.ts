import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';
import { CartItem, CartItemDetails } from './CartStoreType';

export const cartAtom = atomWithStorage<CartItem[]>('cartState', []);
export const cartDetailAtom = atom<CartItemDetails | null>(null);
export const deleteGuestItem = atom<boolean>(false);
export const stopDataSync = atom<boolean>(false);
export const pathItemFlag = atom<boolean>(false);
export const shippingError = atom<null | string>(null);

export const errorCartData = atom([]);
export default cartAtom;

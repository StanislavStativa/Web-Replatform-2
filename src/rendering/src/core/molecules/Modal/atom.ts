import { atom } from 'jotai';
import { ClickType } from './modal.type';
import { ROUTES } from '@/utils/routes';
import { EventItemData } from '../Cart/CartItemCard/CartItemCard';
export const modalOpen = atom(false);

export const confirmationModelTitle = atom('');
export const confirmationModelDescription = atom('');
export const confirmationClickType = atom<ClickType | null>(null);
export const confirmationProductId = atom<string>('');
export const confirmationCartLineId = atom<string>('');
export const confirmationSampleWarning = atom<boolean>(false);
export const deleteItemProduct = atom<EventItemData>(null);
export const itemConfirmationModal = atom(false);
export const itemConfirmationModalImage = atom('');
export const IsSample = atom(true);
export const IsSpecialOrder = atom(false);
export const loaderAddItem = atom(false);
export const isNotAddtoCartErr = atom(true);
export const SampleModalAlertSummary = atom('');
export const CheckOutHref = atom<string>(ROUTES.SHOPPINGCART);
export const CheckOutText = atom<string>('CHECKOUT');

export const newProjectModalOpen = atom(false);
export const newProjectModelTitle = atom('');
export const newProjectModelDescription = atom('');
export const showProjectItemSection = atom(false);
export const newProjectId = atom('');
export const cartWecoError = atom<boolean>(false);

export const cartSubmitError = atom<boolean>(false);

export const createNewProjectDetails = atom({
  productId: '',
  quantity: '',
  unit: '',
});

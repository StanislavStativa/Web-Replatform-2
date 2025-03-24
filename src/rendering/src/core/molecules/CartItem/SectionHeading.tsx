import { useI18n } from 'next-localization';
import { useAtom } from 'jotai';
import { CartItem, CartItemDetails } from '@/core/cartStore/CartStoreType';
import { cartDetailAtom } from '@/core/cartStore/cartState';
import Confirmation from '../Modal/Confirmation';
import {
  modalOpen,
  confirmationModelDescription,
  confirmationModelTitle,
  confirmationClickType,
} from '@/core/molecules/Modal/atom';
import { ClickType } from '../Modal/modal.type';
import CustomMessage from './CustomMessage';
import { type CartItemProps } from './CartItem.types';
import { cn } from '@/utils/cn';
import useLocalStorage from '@/utils/useLocalStorage';
import { authorizationAtom } from '@/data/atoms/authorization';

const SectionHeading: React.FC<CartItemProps> = (props) => {
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [isModalOpen, setIsModalOpen] = useAtom(modalOpen);
  const [, setClickType] = useAtom(confirmationClickType);
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const { getData } = useLocalStorage();
  const localData = getData<CartItem[]>('cartState');
  // Get total of samples and items in the cart
  const TotalItem = cartDetailState
    ? cartDetailState?.CartItems?.LineItemCount + cartDetailState?.Samples?.LineItemCount
    : 0;

  const [, setTitle] = useAtom(confirmationModelTitle);
  const [, setDescription] = useAtom(confirmationModelDescription);
  const { t } = useI18n();

  const handleButtonClick = () => {
    setIsModalOpen(true);
    setTitle(t('Cart_RemoveAllTitle'));
    setDescription(t('Cart_RemoveAllText'));
    setClickType(ClickType.DeleteAll);
  };

  return (
    <div
      className={cn(
        'w-full flex gap-3 flex-col',
        {
          'gap-9 md:gap-42': TotalItem === 0 && isAuthenticated,
        },
        {
          'gap-9 md:gap-42': localData && localData?.length > 0 && !isAuthenticated,
        }
      )}
    >
      <h3 className="flex text-dark-gray text-28 leading-34 md:text-32 md:leading-38 font-normal">
        {t('lbl_ShoppingCart')}
        {isAuthenticated && (
          <>{TotalItem > 0 ? <span className="ml-2"> {`(${TotalItem})`}</span> : null}</>
        )}
        {!isAuthenticated && localData && localData?.length > 0 && (
          <>
            {localData?.length > 0 ? (
              <span className="ml-2"> {`(${localData?.length})`}</span>
            ) : null}
          </>
        )}
      </h3>
      {isAuthenticated && (
        <>
          {TotalItem > 0 ? (
            <button
              className="text-base font-normal text-dark-gray underline text-left w-fit capitalize"
              onClick={handleButtonClick}
            >
              {t('lbl_RemoveAll')}
            </button>
          ) : (
            <CustomMessage {...props} />
          )}
        </>
      )}

      {!isAuthenticated && (
        <>
          {localData && localData?.length > 0 ? (
            <button
              className="text-base font-normal text-dark-gray underline text-left w-fit capitalize"
              onClick={handleButtonClick}
            >
              {t('lbl_RemoveAll')}
            </button>
          ) : (
            <CustomMessage {...props} />
          )}
        </>
      )}

      {isModalOpen ? <Confirmation /> : null}
    </div>
  );
};

export default SectionHeading;

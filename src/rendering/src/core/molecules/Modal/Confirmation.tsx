import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { SIZE } from '@/utils/constants';
import { useI18n } from 'next-localization';
import { RxCross1 } from 'react-icons/rx';
import Modal from 'react-responsive-modal';
import { ClickType } from './modal.type';
import {
  modalOpen,
  confirmationModelDescription,
  confirmationModelTitle,
  confirmationClickType,
  confirmationCartLineId,
  confirmationSampleWarning,
  deleteItemProduct,
} from '@/core/molecules/Modal/atom';
import { useAtom } from 'jotai';
import useCart from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { triggerEvent } from '@/utils/eventTracking';
import { event } from '@/config';
import { cartDetailAtom } from '@/core/cartStore/cartState';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';

const Confirmation = () => {
  const { t } = useI18n();
  const { deleteAllData, deleteItem, getProductIdFromLocal } = useCart(false);
  const router = useRouter();
  const [getDeleteItemProduct] = useAtom(deleteItemProduct);
  const [isModalOpen, setIsModalOpen] = useAtom(modalOpen);
  const [title] = useAtom(confirmationModelTitle);
  const [description] = useAtom(confirmationModelDescription);
  const [clickType] = useAtom(confirmationClickType);
  const [cartLineId] = useAtom(confirmationCartLineId);
  const [sampleWarning] = useAtom(confirmationSampleWarning);
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClick = () => {
    switch (clickType) {
      case ClickType.DeleteAll:
        if (cartDetailState) {
          const Items =
            cartDetailState?.CartItems?.CartItem?.map((product) => {
              const price = Number(product?.LinePrice?.toFixed(2));
              return {
                discount: Number(product?.PromotionDiscount?.toFixed(2)),
                item_brand: product?.Brand || '',
                item_category: product?.ProductHierarchy1Name || '',
                item_category2: product?.ProductHierarchy2Name || '',
                item_category3: product?.MaterialGroup || '',
                item_category4: product?.CollectionName || '',
                item_category5: '',
                item_id: product?.ProductId || '',
                item_name: product?.ProductName || '',
                price: price,
                quantity: product?.Quantity,
              };
            }) || [];
          const Sampleitem =
            cartDetailState?.Samples?.CartItem?.map((product) => {
              const price = Number(product?.LinePrice?.toFixed(2));
              return {
                discount: Number(product?.PromotionDiscount?.toFixed(2)),
                item_brand: product?.Brand || '',
                item_category: 'Sample',
                item_category2: product?.ProductHierarchy2Name || '',
                item_category3: product?.MaterialGroup || '',
                item_category4: product?.CollectionName || '',
                item_category5: '',
                item_id: product?.ProductId || '',
                item_name: product?.ProductName || '',
                price: price,
                quantity: product?.Quantity,
              };
            }) || [];

          const cartItemsforEvent = [...Items, ...Sampleitem];
          triggerEvent({
            event: event.REMOVE_FROM_CART,
            ecommerce: {
              currency: 'USD',
              value: Number(
                Number(
                  cartDetailState?.CartItems?.LineItemTotal +
                    cartDetailState?.Samples?.LineItemTotal
                ).toFixed(2)
              ),
              items: cartItemsforEvent,
            },
          });
        }
        deleteAllData();
        break;
      case ClickType.Delete:
        triggerEvent({
          event: event.REMOVE_FROM_CART,
          ecommerce: {
            currency: 'USD',
            value: Number(getDeleteItemProduct?.value),
            items: getDeleteItemProduct?.items,
          },
        });
        const localId = getProductIdFromLocal(cartLineId) ?? '';
        deleteItem({ cartLineId, localId });

        break;
      case ClickType.Cart:
        // Redirect to cart
        router.push('/shopping-cart');
        setIsModalOpen(false);
      default:
        break;
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      showCloseIcon={false}
      center
      classNames={{
        modal: 'bg-white !rounded-md !p-6 shadow-lg  lg:w-538',
      }}
    >
      <div className="flex flex-col gap-y-10" id="confirmation-modal">
        <div className="flex flex-col gap-y-3">
          <div className="flex items-start lg:items-center justify-between gap-3 lg:gap-0">
            <h2 className="text-32 leading-10 font-normal">{title}</h2>
            <RxCross1
              size="18px"
              onClick={handleCloseModal}
              className="mt-2 min-w-4.5 cursor-pointer"
            />
          </div>
          <p className="text-base font-normal leading-6">{description}</p>
        </div>

        <div className="flex  justify-end gap-3 flex-col-reverse md:flex-row">
          <Button
            className=" h-11 text-base"
            variant={ButtonVariant.OUTLINE}
            size={SIZE.MEDIUM}
            onClick={sampleWarning ? () => setIsModalOpen(false) : handleCloseModal}
          >
            {sampleWarning ? t('Cart_Close') : t('Cart_Cancel')}
          </Button>
          <Button
            className=" h-11 text-base"
            variant={ButtonVariant.BLACK}
            size={SIZE.MEDIUM}
            onClick={handleClick}
          >
            {sampleWarning ? t('Cart_GotoCart') : t('Cart_ConfirmDeletion')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default Confirmation;

import { useAtom } from 'jotai';
import {
  itemConfirmationModal,
  itemConfirmationModalImage,
  IsSample,
  SampleModalAlertSummary,
  CheckOutHref,
  CheckOutText,
  IsSpecialOrder,
  isNotAddtoCartErr,
} from './atom';
import Modal from 'react-responsive-modal';
import { useI18n } from 'next-localization';
import Close from '@/core/atoms/Icons/Close';
import Link from '@/core/atoms/Link/Link';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import Image from '@/core/atoms/Image/Image';
import { Link as JssLink, RichText, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';
import { FORM_SUBMITTED_ERROR_MESSAGES } from '@/utils/constants';

const ItemConfirmation = () => {
  const [checkOutText] = useAtom(CheckOutText);
  const [checkOutHref] = useAtom(CheckOutHref);
  const { t } = useI18n();
  const CheckoutCTA = {
    value: {
      text: checkOutText,
      href: checkOutHref,
    },
  };

  const [isItemConfirmationModalOpen, setIsItemConfirmationModalOpen] =
    useAtom(itemConfirmationModal);
  const [productImage] = useAtom(itemConfirmationModalImage);
  const [isSample] = useAtom(IsSample);
  const [isSpecialOrder] = useAtom(IsSpecialOrder);
  const [addtoCartErr] = useAtom(isNotAddtoCartErr);
  const [sampleModalAlertSummary] = useAtom(SampleModalAlertSummary);
  const text: RichTextField = {
    value: sampleModalAlertSummary,
  };
  const handleModalToggle = () => {
    setIsItemConfirmationModalOpen(false);
  };

  return (
    <>
      <Modal
        open={isItemConfirmationModalOpen}
        onClose={handleModalToggle}
        showCloseIcon={false}
        center
        classNames={{
          modal: 'bg-white !rounded-xl !p-6 !shadow-none !m-0 mt-5 ',
        }}
      >
        <div className="flex flex-col gap-6" id="confirmation-modal">
          <div className="flex justify-between">
            <h2 className="text-center md:text-start w-full text-2xl font-normal leading-8">
              {t('PDPAttributes_ItemAdded')}
            </h2>
            <Close width={20} height={20} onClick={handleModalToggle} />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
            <button onClick={handleModalToggle}>
              <Image
                className="bg-tonal-gray cursor-pointer"
                field={{
                  value: {
                    src: productImage,
                    width: 160,
                    height: 160,
                    alt: 'product',
                  },
                }}
              />
            </button>

            <div className="flex flex-col gap-3 md:justify-between items-start">
              {addtoCartErr ? (
                <p className="mt-5">{t('PDPAttributes_ItemAddedDescription')}</p>
              ) : (
                <>
                  {FORM_SUBMITTED_ERROR_MESSAGES?.DEFAULT}
                  <p className="text-error-red">
                    Quantity given cannot exceed the maximum as per price schedule restrictions.
                  </p>
                </>
              )}
              {isSpecialOrder && addtoCartErr ? <p>{t('Cart_ItemNotReturnable')}</p> : ''}

              <div className="flex flex-col md:flex-row gap-3 mt-10 justify-center items-center w-fit text-center">
                <button
                  className="border border-black py-3 px-6 rounded-md text-sm font-normal tracking-widest"
                  onClick={handleModalToggle}
                >
                  {addtoCartErr
                    ? t('PDPAttributes_KeepBrowsing').toUpperCase()
                    : t('Cart_Cancel').toUpperCase()}
                </button>
                {addtoCartErr && (
                  <JssLink
                    field={CheckoutCTA}
                    className="border border-white text-white bg-dark-gray py-3 px-6 rounded-md text-sm font-normal tracking-widest w-full md:w-fit"
                  />
                )}
              </div>
            </div>
          </div>
          {isSample && (
            <div className="max-w-80 md:max-w-full bg-tonal-gray text-dark-gray rounded-md p-3 flex items-center gap-3 ">
              <div className="w-4 h-4">
                <IoMdInformationCircleOutline />
              </div>
              <div>
                {sampleModalAlertSummary ? (
                  <RichText className={cn('text-xs font-medium text-start')} field={text} />
                ) : (
                  <p className="text-xs font-medium md:max-w-[415px] text-start">
                    {t('Cart_SampleDescription')}
                    <Link
                      field={{ href: t('Cart_CTALearnMore') }}
                      editable={false}
                      className="font-latoBold text-xs leading-4.5 underline ml-1"
                    >
                      {t('Cart_LearnMore')}
                    </Link>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
export default ItemConfirmation;

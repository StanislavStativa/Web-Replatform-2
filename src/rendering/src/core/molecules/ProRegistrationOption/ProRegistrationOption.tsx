import { ProRegistrationOptionProps } from './ProRegistrationOption.type';
import { Modal } from 'react-responsive-modal';
import { Text, RichText } from '@sitecore-jss/sitecore-jss-nextjs';
import { SIZE } from '@/utils/constants';
import { useAtom } from 'jotai';
import { checkProRegistrationOptionModal } from '@/data/atoms/checkProRegistrationOptionModal';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import router from 'next/router';
import { RxCross1 } from 'react-icons/rx';
const ProRegistrationOption = (props: ProRegistrationOptionProps) => {
  const { CTA, Description, SecondaryCTA, Title } = props?.rendering?.fields;
  const { CTAColor, CTASize } = props?.params;
  const [isModalOpen, setModalOpen] = useAtom(checkProRegistrationOptionModal);

  const handleCTAButtonClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { path, ...filteredQuery } = router?.query; // Remove
    router.push({
      pathname: CTA?.value?.href as string,
      query: {
        ...filteredQuery,
      },
    });
    setModalOpen(false);
  };

  const handleSecondaryCTAClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { path, ...filteredQuery } = router?.query; // Remove
    router.push({
      pathname: SecondaryCTA?.value?.href as string,
      query: {
        ...filteredQuery,
      },
    });
    setModalOpen(false);
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={() => {
        setModalOpen(false);
      }}
      showCloseIcon={false}
      center
      classNames={{
        modal: 'bg-white !rounded-md !p-6 shadow-lg  lg:w-538',
      }}
    >
      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between">
            <Text field={Title} tag={'h2'} className="text-32 font-normal" />
            <RxCross1
              size="18px"
              onClick={() => {
                setModalOpen(false);
              }}
            />
          </div>
          <RichText className="contentDescription" field={Description} />
        </div>

        <div className="flex  justify-end gap-x-3">
          <Button
            className=" h-11  text-lg"
            variant={ButtonVariant.OUTLINE}
            isCTATextInCaps={props?.params?.IsCTATextInCaps}
            size={CTASize as SIZE}
            onClick={handleCTAButtonClick}
          >
            {CTA?.value?.text}
          </Button>
          <Button
            className=" h-11  text-lg"
            variant={CTAColor as ButtonVariant}
            size={CTASize as SIZE}
            isCTATextInCaps={props?.params?.IsCTATextInCaps}
            onClick={handleSecondaryCTAClick}
          >
            {SecondaryCTA?.value?.text}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProRegistrationOption;

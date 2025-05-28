import { RegistrationCard } from './RegisterCards.types';
import Image from '@/core/atoms/Image/Image';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import LinkButton from '@/core/atoms/Link/Link';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import { ACCOUNTTYPES, SIZE } from '@/utils/constants';
import { useAtom } from 'jotai';
import { checkProRegistrationOptionModal } from '@/data/atoms/checkProRegistrationOptionModal';
import Button from '@/core/atoms/Button/Button';
import { useI18n } from 'next-localization';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useLocalStorage from '@/utils/useLocalStorage';
const Card: React.FC<RegistrationCard> = ({ fields, params }) => {
  const { setData } = useLocalStorage();
  const [, setModalOpen] = useAtom(checkProRegistrationOptionModal);
  const { t } = useI18n();
  const router = useRouter();
  const [emailSearchVal, setEmailSearchVal] = useState<string | undefined>(undefined);

  useEffect(() => {
    const emailSearch = router?.query?.email;
    if (emailSearch && emailSearch !== '') {
      setEmailSearchVal(emailSearch as string);
    } else {
      setEmailSearchVal(undefined);
    }
  }, [router?.query?.email]);

  return (
    <div className="bg-tonal-gray shadow-md flex flex-col justify-start gap-y-6 min-h-80 rounded-lg lg:px-16 lg:py-9 px-4">
      <div className="flex items-center justify-center ">
        {fields?.Icon && (
          <Image
            className="mr-4"
            field={{
              value: {
                src: fields?.Icon?.value?.src,
                width: Number(fields?.Icon?.value?.width),
                height: Number(fields?.Icon?.value?.height),
                alt: fields?.Icon?.value?.alt,
              },
              editable: 'true',
            }}
          />
        )}
        <div>
          <Text tag="h3" className="pb-2" field={fields?.Title} />
          <RichText field={fields?.SubTitle} />
        </div>
      </div>

      <div className="border-b border-gray-300 "></div>
      <div className="flex justify-center min-h-20">
        <RichText
          field={fields?.Description}
          className={`${fields?.Title?.value === ACCOUNTTYPES.PERSONALACCOUNT ? ' rich-text lg:pr-12' : 'rich-text'}`}
        />
      </div>
      <div className="flex justify-center lg:mt-5">
        {fields?.Title?.value === ACCOUNTTYPES.PERSONALACCOUNT ? (
          <LinkButton
            className="min-h-11 md:text-center text-base !font-normal w-full md:w-auto"
            field={fields?.CTA}
            variant={params?.CTAColor as LinkVariant}
            size={params?.CTASize as SIZE}
            onClick={() => emailSearchVal && setData('userInfo', { email: emailSearchVal })}
          />
        ) : (
          <Button
            onClick={() => {
              emailSearchVal && setData('userInfo', { email: emailSearchVal });
              setModalOpen(true);
            }}
            className=" h-11  text-base w-full md:w-auto"
            isCTATextInCaps={params?.IsCTATextInCaps}
          >
            {t('Labels_Create_Pro_Account')}
          </Button>
        )}
      </div>
    </div>
  );
};
export default Card;

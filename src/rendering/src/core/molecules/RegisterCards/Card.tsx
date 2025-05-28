import { RegistrationCard } from './RegisterCards.types';
import Image from '@/core/atoms/Image/Image';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { ACCOUNTTYPES, SIZE } from '@/utils/constants';
import Button from '@/core/atoms/Button/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useLocalStorage from '@/utils/useLocalStorage';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
const Card: React.FC<RegistrationCard> = ({ fields, params }) => {
  const { setData } = useLocalStorage();
  const router = useRouter();
  const [emailSearchVal, setEmailSearchVal] = useState<string | undefined>(undefined);
  const handleCTAButtonClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { path, ...filteredQuery } = router?.query; // Remove
    router.push({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      pathname: fields?.CTA?.value?.href as string,
      query: {
        ...filteredQuery,
      },
    });
  };
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
        <Button
          className="h-11 text-base w-full md:w-auto"
          variant={params?.CTAColor as ButtonVariant}
          size={params?.CTASize as SIZE}
          onClick={() => {
            emailSearchVal && setData('userInfo', { email: emailSearchVal });
            handleCTAButtonClick();
          }}
          isCTATextInCaps={params?.IsCTATextInCaps}
        >
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            fields?.CTA?.value?.text
          }
        </Button>
      </div>
    </div>
  );
};
export default Card;

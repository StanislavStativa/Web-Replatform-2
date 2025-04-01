import React from 'react';
import { ITypesCTA } from './Cta.type';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { SIZE } from '@/utils/constants';
import { useRouter } from 'next/router';

const Cta = (props: ITypesCTA) => {
  const router = useRouter();
  const { uid } = props?.rendering;
  const { CTALink } = props?.rendering?.fields ?? {};
  const handleRouting = () => {
    router.replace(CTALink?.value?.href as string);
  };
  return (
    <div id={uid} className="container mx-auto flex justify-center px-5 md:px-10">
      <div className="w-auto pt-8 pb-14 md:pt-10 md:pb-16 flex flex-col gap-y-2">
        <Button
          variant={ButtonVariant?.BLACK}
          size={SIZE.LARGE}
          isCTATextInCaps={props?.params?.IsCTATextInCaps}
          className="w-auto"
          onClick={handleRouting}
        >
          {CTALink?.value?.text}
        </Button>
      </div>
    </div>
  );
};

export default Cta;

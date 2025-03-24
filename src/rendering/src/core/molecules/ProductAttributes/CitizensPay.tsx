import { Image, RichText } from '@sitecore-jss/sitecore-jss-nextjs';
import { type ProductAttributesProps } from './ProductAttributes.types';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { IS_PROUSER } from 'src/config';
import AnchorTag from '@/core/atoms/Anchor/AnchorTag';

const CitizensPay: React.FC<ProductAttributesProps> = ({ fields }) => {
  const { CitizensPayCTA, CitizensPayImage, CitizensPayText, CitizensPayLearnMoreImage } = fields;
  const [isProUser, setIsProUser] = useState<boolean>(false);
  useEffect(() => {
    const proUserCookie = Cookies.get(IS_PROUSER);
    if (proUserCookie !== undefined) setIsProUser(proUserCookie === 'true');
  });
  return (
    <>
      {!isProUser && (
        <div className="flex flex-row justify-start md:justify-center items-center border-0 bg-button-gray rounded-lg p-4 md:p-6 mt-4.5 mb-0 gap-4 sm:py-6 sm:px-2.5">
          <div className="w-auto flex flex-col lg:flex-row items-start lg:items-center justify-center gap-2 md:justify-start ">
            <div className="w-auto flex justify-center md:justify-start">
              <Image field={CitizensPayImage} className="md:mb-0" width={127} height={17} />
            </div>
            <div className="w-auto flex justify-start  text-sm">
              <RichText
                field={CitizensPayText}
                className="mb-2 text-sm md:mb-0 text-left w-auto text-buy-now-text"
              />
            </div>
          </div>
          <div className="w-auto md:flex justify-center">
            <AnchorTag href={CitizensPayCTA?.value?.href} target="_blank">
              <Image
                field={CitizensPayLearnMoreImage}
                className="transform transition-transform duration-300 hover:scale-105"
                width={120}
                height={24}
              />
            </AnchorTag>
          </div>
        </div>
      )}
    </>
  );
};

export default CitizensPay;

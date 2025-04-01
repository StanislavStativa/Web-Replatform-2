import Image from '@/core/atoms/Image/Image';
import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import { RegisterProUserFieldProps } from './RegisterProUser.types';
import { RichText } from '@sitecore-jss/sitecore-jss-nextjs';

const RegisterProUserImage: React.FC<RegisterProUserFieldProps> = (props) => {
  const image = getAdobeImageURL({
    imageName: props?.data?.datasource?.Image?.value,
  });

  return (
    <div className="flex flex-col h-full justify-center border border-border-gray rounded-t-10 rounded-lg bg-white ">
      {image?.url?.length > 0 && (
        <div>
          <Image
            alt={image?.altText}
            className="h-full w-full object-cover rounded-lg rounded-b-0 "
            desktopSrc={image?.url}
          />
        </div>
      )}

      <div className="flex justify-center  h-full px-8 lg:px-16 pt-16 pb-8 ">
        <RichText
          field={props?.data?.datasource?.Description}
          className="rich-text registration-rte "
        />
      </div>
    </div>
  );
};

export default RegisterProUserImage;

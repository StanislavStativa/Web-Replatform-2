import pdfIcon from 'public/assets/pdf.png';
import NextImage from 'next/image';
import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import { type TileCardProps } from './TileCard.type';

const PdfView: React.FC<TileCardProps> = (props) => {
  const { params: { IsImageClickable } = {}, fields: { SecondaryCTA } = {} } = props.rendering;

  const pdfUrl = getAdobeImageURL({
    imageName: props?.rendering?.fields?.Image?.value,
    isContent: true,
  });

  return (
    <>
      {IsImageClickable ? (
        <a
          href={pdfUrl?.url}
          target="_blank"
          className="w-auto relative flex justify-center flex-col"
        >
          <div className="flex items-center justify-center aspect-3/2 w-full">
            <NextImage src={pdfIcon} alt="pdf" width={83} height={111} />
          </div>
          <p className="hover:underline group-hover:underline hover:font-medium w-auto mt-5">
            {SecondaryCTA?.value?.text}
          </p>
        </a>
      ) : (
        <div className="cursor-auto flex flex-col">
          <div className="flex items-center justify-center aspect-3/2 w-full">
            <NextImage src={pdfIcon} alt="pdf" width={83} height={111} />
          </div>
          <p className="hover:underline group-hover:underline hover:font-medium w-auto mt-5">
            {SecondaryCTA?.value?.text}
          </p>
        </div>
      )}
    </>
  );
};

export default PdfView;

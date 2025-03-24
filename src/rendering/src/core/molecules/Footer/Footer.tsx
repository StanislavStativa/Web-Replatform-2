import FooterItem from './FooterItem';
import { type FooterItems, type FooterProps } from './Footer.type';
import { Item, LinkField, Text, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from '@/core/atoms/Link/Link';
import Image from '@/core/atoms/Image/Image';
import RenderIcon from './RenderIcon';
import FooterLinkList from './FooterLinkList';
import FooterSubscription from './FooterSubscription';
import useImageFormat from '@/hooks/useImageFormat';

const Footer: React.FC<FooterProps> = (props) => {
  const {
    fields: {
      FooterLinks,
      SocialTitle,
      SocialLinks,
      CopyrightText,
      QuickLinks,
      AssociationLogo,
      MobileImage,
      TabletImage,
    },
  } = props.rendering;

  const { desktopImage, mobileImage, tabletImage } = useImageFormat({
    BannerImage: AssociationLogo,
    MobileImage: MobileImage,
    TabletImage: TabletImage,
  });

  const currentYear: string = new Date().getFullYear().toString();
  const newCopyrightText: string = CopyrightText?.value?.replace('{COPYRIGHT_YEAR}', currentYear);

  return (
    <>
      <FooterSubscription {...props} />
      <div className="mb-5 md:my-5 container mx-auto px-5 md:px-10">
        <div className="md:flex md:text-start text-center">
          <FooterLinkList linkList={FooterLinks as Item[]} />
          <div className="pt-4 my-5 md:my-0 md:pt-0  flex flex-col items-center md:w-2/6">
            <h3 className="uppercase font-latoSemiBold text-sm mb-2 pt-3">
              <Text field={SocialTitle as TextField} />
            </h3>
            <div className="flex mb-3">
              {(SocialLinks as Item[])?.map((links) => (
                <Link
                  key={links.id}
                  field={links?.fields?.SocialLink as LinkField}
                  className="text-light-gray opacity-100 hover:text-inherit px-1 text-base cursor-pointer"
                  aria-label="Social Icon"
                >
                  <RenderIcon {...links} />
                </Link>
              ))}
            </div>
            <Image
              alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
              desktopSrc={desktopImage?.url}
              tabletSrc={tabletImage?.url}
              mobileSrc={mobileImage?.url}
              className="hidden md:flex"
            />
          </div>
        </div>
        <div className=" flex py-5 flex-col md:flex-row items-center gap-y-2 justify-center text-xs md:flex-wrap gap-x-4">
          <p className="text-sm">
            <Text field={{ ...CopyrightText, value: newCopyrightText }} />
          </p>

          {QuickLinks?.filter((quickLink: FooterItems) => quickLink).map(
            (quickLink: FooterItems) => (
              <FooterItem key={quickLink.id} {...quickLink} params={props?.params} />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Footer;

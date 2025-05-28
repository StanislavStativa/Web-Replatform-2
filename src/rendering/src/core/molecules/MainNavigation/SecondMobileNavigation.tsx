import { Text, LinkField, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { RxCaretLeft } from 'react-icons/rx';
import { useState } from 'react';
import { ThirdMobileNavigation } from './ThirdMobileNavigation';
import Image from '@/core/atoms/Image/Image';
import Link from '@/core/atoms/Link/Link';
import { type MobilenavigationProps } from './MobileNavigation.types';
import { PiCaretRight } from 'react-icons/pi';
import { ChildMenuProps } from '../SecondaryNavigation/SecondaryNavigation.types';
import { useAtom } from 'jotai';
import { HamburgerMenuOpen } from '../HeaderCTA/HeaderCTAMobile';
import LinkCTA from 'next/link';
import useImageFormat from '@/hooks/useImageFormat';
import { ImageFormatType } from '../HeroBanner/HeroBanner.types';
import { cn } from '@/utils/cn';

const GenerateImageUrl = ({
  BannerImage,
  ImageSmartCropFormat,
  MobileImage,
  TabletImage,
}: ImageFormatType) => {
  const { desktopImage, mobileImage, tabletImage } = useImageFormat({
    BannerImage,
    ImageSmartCropFormat,
    MobileImage,
    TabletImage,
  });
  return {
    desktopImage,
    mobileImage,
    tabletImage,
  };
};
export const SecondMobileNavigation = (props: MobilenavigationProps) => {
  const { ChildMenu, Title, CTA } = props.listData.fields;
  const [openSecondMenu, setOpenSecondMenu] = useState(false);
  const [secondListData, setSecondListData] = useState<ChildMenuProps>();
  const [, setHamburgerMenu] = useAtom(HamburgerMenuOpen);

  const toggleThirdMenu = () => {
    setOpenSecondMenu(!openSecondMenu);
  };

  return (
    <div className="absolute top-0 left-0 bg-white h-screen w-65 pb-52 overflow-y-auto">
      <div className={cn(openSecondMenu && 'hidden')}>
        <ul className="w-full">
          <button className="p-5 flex items-center text-center text-base" onClick={props.setOpen}>
            <RxCaretLeft className="font-normal text-base text-stone-700" size="1.5em" /> Main Menu
          </button>
          <hr />
          <div className="px-6 py-3.5 flex flex-col gap-2">
            <Text
              field={Title as TextField}
              tag={'h2'}
              className="text-base font-bold text-dark-gray"
            />
            <button onClick={() => setHamburgerMenu(false)} className="text-left">
              <Link className="text-sm font-normal" field={CTA as LinkField}>
                Shop All {Title?.value}
              </Link>
            </button>
          </div>
          <hr />
          {(ChildMenu as ChildMenuProps[]).map((item: ChildMenuProps) => {
            const {
              Image: DesktopImage,
              MobileImage,
              TabletImage,
              ImageSmartCropFormat,
            } = item?.fields;

            const { desktopImage, mobileImage, tabletImage } = GenerateImageUrl({
              BannerImage: DesktopImage,
              ImageSmartCropFormat,
              MobileImage,
              TabletImage,
            });

            return (
              <li key={item.id} className="flex">
                <button
                  onClick={() => {
                    if (item?.fields?.ChildMenu?.length) {
                      toggleThirdMenu();
                      setSecondListData(item);
                    } else setHamburgerMenu(false);
                  }}
                  className="w-full flex flex-col items-center  font-normal text-dark-gray text-left pt-5 px-6"
                >
                  {item?.fields?.Image?.value && item?.fields?.IsVisibleOnMobile?.value && (
                    <LinkCTA href={item?.fields?.CTA?.value?.href as string}>
                      <Image
                        alt={desktopImage?.altText}
                        className="object-fill"
                        desktopSrc={desktopImage?.url}
                        mobileSrc={mobileImage?.url}
                        tabletSrc={tabletImage?.url}
                      />
                    </LinkCTA>
                  )}
                  <div className="w-full flex justify-between items-center">
                    {item?.fields?.Title?.value && (
                      <div className="no-underline">
                        <Text field={item?.fields?.Title} />
                      </div>
                    )}
                    {!item?.fields?.Title?.value && (
                      <Link className="no-underline" field={item?.fields?.CTA} />
                    )}
                    {!!item?.fields?.ChildMenu?.length && <PiCaretRight size={20} />}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {openSecondMenu && (
        <ThirdMobileNavigation
          listData={secondListData as ChildMenuProps}
          setOpen={toggleThirdMenu}
          Title={Title}
        />
      )}
    </div>
  );
};

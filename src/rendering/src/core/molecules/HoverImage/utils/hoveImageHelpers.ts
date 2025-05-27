import { ITypesHoverImageFields } from '../HoveImage.type';

export const getHoverImageAssets = (fields: ITypesHoverImageFields) => {
  const {
    DesktopHoverImageOne,
    DesktopHoverImageTwo,
    DesktopHoverImageThree,
    DesktopImageOne,
    DesktopImageTwo,
    DesktopImageThree,
    TabletHoverImageOne,
    TabletHoverImageTwo,
    TabletHoverImageThree,
    TabletImageOne,
    TabletImageTwo,
    TabletImageThree,
    MobileImageOne,
    MobileImageTwo,
    MobileImageThree,
    VideoSupportOne,
    VideoSupportTwo,
    VideoSupportThree,
    VideoOne,
    VideoTwo,
    VideoThree,
    LinkOne,
    LinkTwo,
    LinkThree,
    HideLinkOne,
    HideLinkTwo,
    HideLinkThree,
  } = fields ?? {};

  return [
    {
      Image: {
        mainImage: DesktopImageOne?.value,
        hoverImage: DesktopHoverImageOne?.value,
      },
      MobileImage: {
        mainImage: MobileImageOne?.value,
      },
      TabletImage: {
        mainImage: TabletImageOne?.value,
        hoverImage: TabletHoverImageOne?.value,
      },
      videoSrc: VideoOne?.value?.href,
      isVideo: VideoSupportOne?.value,
      isHideLink: HideLinkOne?.value,
      link: LinkOne?.value,
    },
    {
      Image: {
        mainImage: DesktopImageTwo?.value,
        hoverImage: DesktopHoverImageTwo?.value,
      },
      MobileImage: {
        mainImage: MobileImageTwo?.value,
      },
      TabletImage: {
        mainImage: TabletImageTwo?.value,
        hoverImage: TabletHoverImageTwo?.value,
      },
      videoSrc: VideoTwo?.value?.href,
      isVideo: VideoSupportTwo?.value,
      isHideLink: HideLinkTwo?.value,
      link: LinkTwo?.value,
    },
    {
      Image: {
        mainImage: DesktopImageThree?.value,
        hoverImage: DesktopHoverImageThree?.value,
      },
      MobileImage: {
        mainImage: MobileImageThree?.value,
      },
      TabletImage: {
        mainImage: TabletImageThree?.value,
        hoverImage: TabletHoverImageThree?.value,
      },
      videoSrc: VideoThree?.value?.href,
      isVideo: VideoSupportThree?.value,
      isHideLink: HideLinkThree?.value,
      link: LinkThree?.value,
    },
  ];
};

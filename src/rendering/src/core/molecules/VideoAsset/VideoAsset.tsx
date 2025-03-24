import React from 'react';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';
import { VideoAssetProps } from './VideoAsset.types';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import Head from 'next/head'; // Import Head from next/head

const alignmentClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const VideoAsset: React.FC<VideoAssetProps> = (props) => {
  const {
    fields: {
      YoutubeVideoID,
      Title,
      Caption,
      Name,
      ThumbnailUrl,
      UploadDate,
      Description,
      Duration,
    },
    params: { HeadingTag = 'h2', HeadingSize },
  } = props.rendering;

  const TitleAlignment = props?.params?.TitleAlignment
    ? (props.params.TitleAlignment.toLowerCase() as keyof typeof alignmentClasses)
    : 'center';

  // JSON-LD schema for SEO
  const jsonLDSchema = {
    '@context': 'http://schema.org/',
    '@type': 'VideoObject',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    name: Name?.value,
    description: Description?.value,
    thumbnailUrl: ThumbnailUrl?.value?.toString()?.split(','),
    uploadDate: UploadDate?.value,
    duration: Duration?.value,
    contentUrl: `https://www.youtube.com/watch?v=${YoutubeVideoID?.value}`,
    embedUrl: `https://www.youtube.com/embed/${YoutubeVideoID?.value}`,
  };

  return (
    <div className={`container mx-auto px-5 ${alignmentClasses[TitleAlignment]}`}>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLDSchema) }}
          data-nscript="afterInteractive"
        />
      </Head>
      {YoutubeVideoID && (
        <div className={alignmentClasses[TitleAlignment]}>
          <iframe
            id="ytplayer"
            width="100%"
            allowFullScreen
            height="auto"
            title={Title?.value?.toString() || 'Video'}
            className={'w-full aspect-video print:hidden'}
            src={`https://www.youtube.com/embed/${YoutubeVideoID?.value}?autoplay=0&controls=1&rel=0`}
          ></iframe>
        </div>
      )}
      {Title && (
        <Text
          className={cn(
            'my-7 text-dark-gray font-normal md:font-latoLight',
            getHeadingStyles(HeadingSize, HeadingTag)
          )}
          field={Title}
          tag={HeadingTag}
        />
      )}

      {Caption && <RichText className=" text-dark-gray mb-4" field={Caption} />}
    </div>
  );
};

export default VideoAsset;

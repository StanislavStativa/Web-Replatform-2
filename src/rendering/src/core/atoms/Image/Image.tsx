/**
 * Renders an image component with responsive image sources.
 *
 * @param desktopSrc - The image source for desktop devices.
 * @param mobileSrc - The image source for mobile devices.
 * @param tabletSrc - The image source for tablet devices.
 * @param alt - The alternative text for the image.
 * @param className - An optional CSS class name to apply to the image.
 * @param id - An optional props to pass the id of the image.
 * @param field - An optional field to render the image from Sitecore.
 * @param imageTitle - An optional field to render the image title from Sitecore.
 * @param priority - An optional prop to prioritize the image loading.
 * @param editable - An optional prop to render the image in edit mode.
 * @returns A React component that renders an image with responsive sources.
 */

import { type ImageProps } from './Image.types';
import { MOBILE_MAX_WIDTH, TABLET_MAX_WIDTH } from '../../../utils/constants';
import { useEditor } from '@/hooks/useEditor';
import { ImageFieldValue, Image as JSSImage } from '@sitecore-jss/sitecore-jss-nextjs';
import { Image as NextImage } from '@unpic/react';

const Image: React.FC<ImageProps> = ({ className, ...props }) => {
  const { desktopSrc, mobileSrc, tabletSrc, alt, id, field, priority, editable, hidePinterest } =
    props;
  const isEditing = useEditor();

  if (field) {
    if (isEditing || editable) {
      return <JSSImage field={field} editable={editable} className={className} />;
    }

    const value = field.value as ImageFieldValue;
    const src = value.src;
    const width = Number(value.width) || 60;
    const height = Number(value.height) || 60;
    const alt = value?.alt?.toString() || '';

    if (src) {
      return (
        <NextImage
          src={src}
          width={width}
          height={height}
          alt={alt}
          className={className}
          priority={priority}
          data-pin-no-hover={hidePinterest ? 'true' : undefined}
        />
      );
    }

    return <></>;
  } else {
    return (
      <picture>
        <source srcSet={mobileSrc} media={`(max-width: ${MOBILE_MAX_WIDTH - 1}px)`} />
        <source srcSet={tabletSrc} media={`(max-width: ${TABLET_MAX_WIDTH}px)`} />
        <source srcSet={desktopSrc} />
        <img
          id={id}
          src={desktopSrc}
          alt={alt}
          className={className}
          title={alt}
          data-pin-no-hover={hidePinterest ? 'true' : undefined}
          // @ts-expect-error nextjs issue
          fetchpriority={priority ? 'high' : 'auto'}
        />
      </picture>
    );
  }
};

export default Image;

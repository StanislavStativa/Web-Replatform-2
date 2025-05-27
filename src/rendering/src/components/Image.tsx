import type { CSSProperties } from 'react';
import {
  EditMode,
  Image as JssImage,
  Link as JssLink,
  Text,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';

import type { Field, ImageField, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';

interface Fields {
  Image: ImageField;
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

type ImageProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering?: {
    componentName?: string;
  };
};

export const Banner = (props: ImageProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext.pageEditing;
  const isMetadataMode = sitecoreContext?.editMode === EditMode.Metadata;

  const classHeroBannerEmpty =
    isPageEditing && props.fields?.Image?.value?.class === 'scEmptyImage'
      ? 'hero-banner-empty'
      : '';

  const backgroundStyle = props?.fields?.Image?.value?.src
    ? ({
        backgroundImage: `url('${props.fields.Image.value.src}')`,
      } as CSSProperties)
    : {};

  const modifyImageProps = !isMetadataMode
    ? {
        ...props.fields.Image,
        editable: props?.fields?.Image?.editable
          ?.replace(`width="${props.fields?.Image?.value?.width}"`, 'width="100%"')
          ?.replace(`height="${props.fields?.Image?.value?.height}"`, 'height="100%"'),
      }
    : {
        ...props.fields.Image,
        value: {
          ...props.fields.Image.value,
          style: { width: '100%', height: '100%' },
        },
      };

  const id = props?.params?.RenderingIdentifier || undefined;

  return (
    <div
      className={cn('component hero-banner', props.params?.styles, classHeroBannerEmpty)}
      id={id}
    >
      <div className="component-content sc-sxa-image-hero-banner" style={backgroundStyle}>
        {sitecoreContext.pageEditing ? <JssImage field={modifyImageProps} /> : null}
      </div>
    </div>
  );
};

export const Default = (props: ImageProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();

  const id = props?.params?.RenderingIdentifier || undefined;
  const hasLink = !!props.fields?.TargetUrl?.value?.href;

  if (props.fields) {
    const imageElement = <JssImage field={props.fields.Image} className="sc-image" />;

    return (
      <div
        className={cn(
          'component image print:w-[175px] print:h-auto',
          props?.params?.styles,
          props?.rendering?.componentName
        )}
        id={id}
      >
        <div className="component-content">
          {sitecoreContext.pageState === 'edit' || !hasLink ? (
            imageElement
          ) : (
            <JssLink field={props.fields.TargetUrl}>{imageElement}</JssLink>
          )}
          <Text
            tag="span"
            className="image-caption field-imagecaption"
            field={props.fields.ImageCaption}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('component image', props?.params?.styles)} id={id}>
      <div className="component-content">
        <span className="is-empty-hint">Image</span>
      </div>
    </div>
  );
};

export default Default;

import React from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';

const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
);

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

const mapStyles = (styles: string) => {
  return styles
    .replace('container-dark-background', 'bg-dark-gray')
    .replace('sxa-bordered', 'rounded-xl border border-border-gray');
};

const DefaultContainer = (props: ComponentProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();
  const phKey = `container-${props.params.DynamicPlaceholderId}`;
  const id = props.params.RenderingIdentifier;
  let backgroundImage = props.params.BackgroundImage as string;
  let backgroundStyle: { [key: string]: string } = {};

  if (backgroundImage) {
    const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`;
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`;
    backgroundStyle = {
      backgroundImage: `url('${prefix}${backgroundImage}')`,
    };
  }

  return (
    <div
      className={cn(`grid  bg-cover ${mapStyles(styles)}`)}
      style={backgroundStyle}
      id={id ? id : undefined}
    >
      <Placeholder name={phKey} rendering={props.rendering} />
    </div>
  );
};

export const Default = (props: ComponentProps): JSX.Element => {
  const splitStyles = props.params?.Styles?.split(' ');
  if (splitStyles && splitStyles.includes('container')) {
    return (
      <div className="container grid mx-auto px-5 md:px-10 justify-center">
        <DefaultContainer {...props} />
      </div>
    );
  }

  return <DefaultContainer {...props} />;
};

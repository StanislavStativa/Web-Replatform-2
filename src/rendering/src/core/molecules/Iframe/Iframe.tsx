import React from 'react';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';
import { IframeComponentProps } from './Iframe.types';
import { getHeadingStyles } from '@/utils/StyleHeadings';
declare global {
  interface Window {
    redpepper: {
      init: (a: string, b: string, c: number) => void;
    };
  }
}

const Iframe: React.FC<IframeComponentProps> = (props) => {
  const {
    fields: { IFrame, Title },
  } = props.rendering;

  /*   const onScriptLoaded = () => {
    window.redpepper?.init('https://app.redpepperdigital.net/', 'red-pepper-catalog', 6484);
  }; */

  return (
    <div className="w-full container mx-auto px-5 md:px-10 pt-8">
      {/*    <Script
        src="https://app.redpepperdigital.net/app/redpepper/redpepper.min.js"
        async
        onLoad={onScriptLoaded}
      /> */}
      {Title && (
        <Text
          className={cn(
            'pb-8 text-dark-gray font-normal md:font-latoLight',
            getHeadingStyles(props?.params?.HeadingTag, props?.params?.HeadingSize)
          )}
          field={Title}
          tag={props?.params?.HeadingTag || 'h1'}
        />
      )}
      <div id="red-pepper-catalog">
        {IFrame.value && (
          <iframe
            title="red-pepper-catalog"
            src={IFrame.value}
            height="990px"
            width="100%"
            allowFullScreen
            allow="autoplay; encrypted-media"
            sandbox="allow-downloads allow-top-navigation allow-same-origin allow-scripts allow-modals allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  );
};

export default Iframe;

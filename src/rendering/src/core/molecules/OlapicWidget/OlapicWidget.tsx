import React from 'react';
import { type OlapicWidgetProps } from '@/core/molecules/OlapicWidget/OlapicWidget.type';
import dynamic from 'next/dynamic';

const OlapicWidgetData = dynamic(
  () => import('@/core/molecules/OlapicWidget/OlapicWidgetVarient'),
  {
    ssr: false,
  }
);

const OlapicWidget = (props: OlapicWidgetProps): JSX.Element => {
  const scriptId: string =
    props?.rendering?.fields?.OlapicType?.value === 'Gallery'
      ? 'olapic_specific_widget_Gallery'
      : 'olapic_specific_widget';
  return <OlapicWidgetData {...props} scriptId={scriptId} />;
};
export default OlapicWidget;

import React from 'react';
import { type OlapicWidgetProps } from '@/core/molecules/OlapicWidget/OlapicWidget.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import dynamic from 'next/dynamic';
import OlapicHeading from '@/core/molecules/OlapicWidget/OlapicHeading';

const OlapicWidget = dynamic(() => import('@/core/molecules/OlapicWidget/OlapicWidget'), {
  ssr: false,
});
const Default = (props: OlapicWidgetProps): JSX.Element => {
  return (
    <>
      <OlapicHeading rendering={props.rendering} params={props.params} />
      <OlapicWidget {...props} />
    </>
  );
};
export default withDatasourceCheck()(Default);

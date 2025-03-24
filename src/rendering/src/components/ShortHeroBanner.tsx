/**
 * A React component that renders a button with customizable styles.
 *
 * @param {ShortHeroBannerProps} props - The props for the main ShortHeroBannerProps component.
 * @returns {React.ReactElement} - The rendered ShortHeroBannerProps component.
 */

import React from 'react';
import { ShortHeroBannerProps } from '@/core/molecules/ShortHeroBanner/ShortHeroBanner.type';
import ShortHeroBanner from '@/core/molecules/ShortHeroBanner/ShortHeroBanner';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: ShortHeroBannerProps): JSX.Element => {
  return <ShortHeroBanner {...props} />;
};
export default withDatasourceCheck()(Default);

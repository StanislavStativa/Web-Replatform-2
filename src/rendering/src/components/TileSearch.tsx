/**
 * A React component that renders a button with customizable styles.
 *
 * @param {TileSearchProps} props - The props for the main TileSearchProps component.
 * @returns {React.ReactElement} - The rendered TileSearchProps component.
 */

import React from 'react';
import { type TileSearchProps } from '@/core/molecules/TileSearch/TileSearch.type';
import TileSearch from '@/core/molecules/TileSearch/TileSearch';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: TileSearchProps): JSX.Element => {
  return <TileSearch {...props} />;
};
export default withDatasourceCheck()(Default);

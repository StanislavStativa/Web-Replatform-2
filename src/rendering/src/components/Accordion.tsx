/**
 * A React component that renders a button with customizable styles.
 *
 * @param {AccordionProps} props - The props for the main Accordion component.
 * @returns {React.ReactElement} - The rendered Accordion component.
 */

import React from 'react';
import { AccordionProps } from '@/core/molecules/Accordion/Accordion.type';
import Accordion from '@/core/molecules/Accordion/Accordion';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: AccordionProps): JSX.Element => {
  return <Accordion {...props} />;
};
export default withDatasourceCheck()(Default);

import React from 'react';
import ScheduleConsultationForm from '@/core/molecules/ScheduleConsultationForm/ScheduleConsultationForm';
import { type ScheduleConsultationFormProps } from '@/core/molecules/ScheduleConsultationForm/ScheduleConsultationForm.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: ScheduleConsultationFormProps): JSX.Element => {
  return <ScheduleConsultationForm {...props} />;
};
export default withDatasourceCheck()(Default);
